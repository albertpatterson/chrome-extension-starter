import { Request, ResponseResult } from './types';

/**
 * Handle requests from the service worker to a browser tab
 *  T: request data type
 *  V: response data type
 */
export abstract class BaseMessageSystem<T, V> {
  /**
   * Send a request from the service worker to a tab
   * @param tabId the id of the tab to receive the message
   * @param request the request to handle
   */
  async sendInServiceWorker(
    tabId: number,
    request: Request<T>
  ): Promise<void | ResponseResult<V>> {
    const response: void | ResponseResult<V> = await chrome.tabs.sendMessage(
      tabId,
      request
    );

    return response;
  }

  /**
   * Send a request from a tab to the service worker
   * @param request the request to handle
   */
  async sendInTab(request: Request<T>): Promise<void | ResponseResult<V>> {
    const response: void | ResponseResult<V> = await chrome.runtime.sendMessage(
      request
    );

    return response;
  }

  /** Can this message system handle this type of request? */
  abstract canHandle(request: Request<{}>): request is Request<T>;

  /**
   * Synchronousely initiate the request handling in the tab and indicate that the response will be sent asynchronously
   * @param request the request to handle
   * @param sender the sender of the request
   * @param sendResponse send response from the tab to the service worker
   * @returns
   */
  handle(
    request: Request<T>,
    sender: chrome.runtime.MessageSender,
    sendResponse: (r: any) => void,
    isInTab: boolean
  ): boolean {
    this.handleAndRespond(request, sender, sendResponse, isInTab);
    return true;
  }

  /**
   * asynchronousely handle the request and send result
   * @param request the request to handle
   * @param sender the sender of the request
   * @param sendResponse send response from the tab to the service worker
   */
  protected async handleAndRespond(
    request: Request<T>,
    sender: chrome.runtime.MessageSender,
    sendResponse: (r: any) => void,
    isInTab: boolean
  ) {
    const result = await (isInTab
      ? this.handleAsyncInTab(request, sender)
      : this.handleAsyncInServiceWorker(request, sender));
    sendResponse(result);
  }

  /**
   * asynchronousely handle the request in the tab, must be overriden in subclasses
   * @param request the request to handle
   * @param sender the sender of the request
   */
  protected abstract handleAsyncInTab(
    request: Request<T>,
    sender: chrome.runtime.MessageSender
  ): Promise<void | ResponseResult<V>>;

  /**
   * asynchronousely handle the request in the service worker, must be overriden in subclasses
   * @param request the request to handle
   * @param sender the sender of the request
   */
  protected abstract handleAsyncInServiceWorker(
    request: Request<T>,
    sender: chrome.runtime.MessageSender
  ): Promise<void | ResponseResult<V>>;
}

/**
 *
 * @param name the name of the type of request (must be unique)
 * @param handleAsyncInTab handler of requests in the tab
 * @param handleAsyncInServiceWorker handler of requests in the service worker
 * @returns
 */
export function createMessageSystem<T, V>(
  name: string,
  handleAsyncInTab: (
    request: Request<T>,
    sender: chrome.runtime.MessageSender
  ) => Promise<ResponseResult<V>>,
  handleAsyncInServiceWorker: (
    request: Request<T>,
    sender: chrome.runtime.MessageSender
  ) => Promise<ResponseResult<V>>
) {
  class MessageSystem extends BaseMessageSystem<T, V> {
    canHandle(request: Request<{}>): request is Request<T> {
      return request.name === name;
    }

    protected async handleAsyncInTab(
      request: Request<T>,
      sender: chrome.runtime.MessageSender
    ): Promise<ResponseResult<V>> {
      return await handleAsyncInTab(request, sender);
    }

    protected async handleAsyncInServiceWorker(
      request: Request<T>,
      sender: chrome.runtime.MessageSender
    ): Promise<ResponseResult<V>> {
      return await handleAsyncInServiceWorker(request, sender);
    }
  }

  const messageSystem = new MessageSystem();

  const createRequest = (params: T): Request<T> => {
    return {
      name,
      data: {
        ...params,
      },
    };
  };

  return {
    messageSystem,
    createRequest,
  };
}
