import { threadId } from 'worker_threads';
import { BaseRequest, ResponseResult } from '../types';

/**
 * Handle requests from the service worker to a browser tab
 */
export abstract class BaseMessageSystem<T extends BaseRequest> {
  /**
   * Send a request from the service worker to a tab
   * @param tabId the id of the tab to receive the message
   * @param request the request to handle
   */
  async sendInServiceWorker(tabId: number, request: T) {
    const response: void | ResponseResult = await chrome.tabs.sendMessage(
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
    const response: void | ResponseResult = await chrome.runtime.sendMessage(
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
  async handleAndRespond(
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
  abstract handleAsyncInTab(
    request: T,
    sender: chrome.runtime.MessageSender
  ): Promise<void | ResponseResult>;

  /**
   * asynchronousely handle the request in the service worker, must be overriden in subclasses
   * @param request the request to handle
   * @param sender the sender of the request
   */
  abstract handleAsyncInServiceWorker(
    request: T,
    sender: chrome.runtime.MessageSender
  ): Promise<void | ResponseResult>;
}

export function createMessageSystem<T extends BaseRequest>(
  canHandle: (br: BaseRequest) => br is T,
  handleAsyncInTab: (
    request: T,
    sender: chrome.runtime.MessageSender
  ) => Promise<ResponseResult>,
  handleAsyncInServiceWorker: (
    request: T,
    sender: chrome.runtime.MessageSender
  ) => Promise<ResponseResult>
) {
  class MessageSystem extends BaseMessageSystem<T> {
    canHandle(request: BaseRequest): request is T {
      return canHandle(request);
    }

    async handleAsyncInTab(
      request: T,
      sender: chrome.runtime.MessageSender
    ): Promise<ResponseResult> {
      return await handleAsyncInTab(request, sender);
    }

    async handleAsyncInServiceWorker(
      request: T,
      sender: chrome.runtime.MessageSender
    ): Promise<ResponseResult> {
      return await handleAsyncInServiceWorker(request, sender);
    }
  }

  return new MessageSystem();
}
