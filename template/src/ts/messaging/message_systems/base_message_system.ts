import { threadId } from 'worker_threads';
import { BaseRequest, ResponseResult } from '../types';

/**
 * Handle requests from the service worker to a browser tab
 */
export abstract class BaseMessageSystem<T extends BaseRequest, V> {
  /**
   * Send a request from the service worker to a tab
   * @param tabId the id of the tab to receive the message
   * @param request the request to handle
   */
  async sendInServiceWorker(tabId: number, request: T) {
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
  async sendInTab(request: T) {
    const response: void | ResponseResult<V> = await chrome.runtime.sendMessage(
      request
    );

    return response;
  }

  /** Can this message system handle this type of request? */
  abstract canHandle(request: BaseRequest): request is T;

  /**
   * Synchronousely initiate the request handling in the tab and indicate that the response will be sent asynchronously
   * @param request the request to handle
   * @param sender the sender of the request
   * @param sendResponse send response from the tab to the service worker
   * @returns
   */
  handle(
    request: T,
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
    request: T,
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
    request: T,
    sender: chrome.runtime.MessageSender
  ): Promise<void | ResponseResult<V>>;

  /**
   * asynchronousely handle the request in the service worker, must be overriden in subclasses
   * @param request the request to handle
   * @param sender the sender of the request
   */
  protected abstract handleAsyncInServiceWorker(
    request: T,
    sender: chrome.runtime.MessageSender
  ): Promise<void | ResponseResult<V>>;
}

export function createMessageSystem<T extends BaseRequest, V>(
  canHandle: (br: BaseRequest) => br is T,
  handleAsyncInTab: (
    request: T,
    sender: chrome.runtime.MessageSender
  ) => Promise<ResponseResult<V>>,
  handleAsyncInServiceWorker: (
    request: T,
    sender: chrome.runtime.MessageSender
  ) => Promise<ResponseResult<V>>
) {
  class MessageSystem extends BaseMessageSystem<T, V> {
    canHandle(request: BaseRequest): request is T {
      return canHandle(request);
    }

    protected async handleAsyncInTab(
      request: T,
      sender: chrome.runtime.MessageSender
    ): Promise<ResponseResult<V>> {
      return await handleAsyncInTab(request, sender);
    }

    protected async handleAsyncInServiceWorker(
      request: T,
      sender: chrome.runtime.MessageSender
    ): Promise<ResponseResult<V>> {
      return await handleAsyncInServiceWorker(request, sender);
    }
  }

  return new MessageSystem();
}
