/**
 * @file
 * @author Albert Patterson <albert.patterson.code@gmail.com>
 * @see [Linkedin]{@link https://www.linkedin.com/in/apattersoncmu/}
 * @see [Github]{@link https://github.com/albertpatterson}
 * @see [npm]{@link https://www.npmjs.com/~apatterson189}
 * @see [Youtube]{@link https://www.youtube.com/channel/UCrECEffgWKBMCvn5tar9bYw}
 * @see [Medium]{@link https://medium.com/@albert.patterson.code}
 *
 * Free software under the GPLv3 licence. Permissions of this strong copyleft
 * license are conditioned on making available complete source code of
 * licensed works and modifications, which include larger works using a
 * licensed work, under the same license. Copyright and license notices must
 * be preserved. Contributors provide an express grant of patent rights.
 */

import { Request, Response } from './types';

/**
 * Handle requests from the service worker to a browser tab
 *  T: request data type
 *  V: response data type
 */
export abstract class BaseRequestSystem<T, V> {
  /**
   * Send a request from the service worker to a tab
   * @param tabId the id of the tab to receive the message
   * @param request the request to handle
   */
  async sendRequestToTab(
    tabId: number,
    request: Request<T>
  ): Promise<void | Response<V>> {
    const response: void | Response<V> = await chrome.tabs.sendMessage(
      tabId,
      request
    );

    return response;
  }

  /**
   * Send a request from a tab to the service worker
   * @param request the request to handle
   */
  async sendRequestToServiceWorker(
    request: Request<T>
  ): Promise<void | Response<V>> {
    const response: void | Response<V> = await chrome.runtime.sendMessage(
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
  ): Promise<void | Response<V>>;

  /**
   * asynchronousely handle the request in the service worker, must be overriden in subclasses
   * @param request the request to handle
   * @param sender the sender of the request
   */
  protected abstract handleAsyncInServiceWorker(
    request: Request<T>,
    sender: chrome.runtime.MessageSender
  ): Promise<void | Response<V>>;
}
