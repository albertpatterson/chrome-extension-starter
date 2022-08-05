import { Request, Response } from './types';
import { BaseRequestSystem } from './base_request_system';
import { requestSystemManager } from './registry';
/**
 *
 * @param name the name of the type of request (must be unique)
 * @param handleAsyncInTab handler of requests in the tab
 * @param handleAsyncInServiceWorker handler of requests in the service worker
 * @returns
 */
export function createRequestSystem<T, V>(
  name: string,
  handleAsyncInTab: (
    request: Request<T>,
    sender: chrome.runtime.MessageSender
  ) => Promise<Response<V>>,
  handleAsyncInServiceWorker: (
    request: Request<T>,
    sender: chrome.runtime.MessageSender
  ) => Promise<Response<V>>
) {
  class RequestSystem extends BaseRequestSystem<T, V> {
    canHandle(request: Request<{}>): request is Request<T> {
      return request.name === name;
    }

    protected async handleAsyncInTab(
      request: Request<T>,
      sender: chrome.runtime.MessageSender
    ): Promise<Response<V>> {
      return await handleAsyncInTab(request, sender);
    }

    protected async handleAsyncInServiceWorker(
      request: Request<T>,
      sender: chrome.runtime.MessageSender
    ): Promise<Response<V>> {
      return await handleAsyncInServiceWorker(request, sender);
    }
  }

  const requestSystem = new RequestSystem();

  const createRequest = (params: T): Request<T> => {
    return {
      name,
      data: {
        ...params,
      },
    };
  };

  return {
    requestSystem,
    createRequest,
  };
}

export function registerRequestSystem(
  requestSystem: BaseRequestSystem<{}, {}>
) {
  requestSystemManager.add(requestSystem);
}

/**
 *
 * @param name the name of the type of request (must be unique)
 * @param handleAsyncInTab handler of requests in the tab
 * @param handleAsyncInServiceWorker handler of requests in the service worker
 * @returns
 */
export function createAndRegisterRequestSystem<T, V>(
  name: string,
  handleAsyncInTab: (
    request: Request<T>,
    sender: chrome.runtime.MessageSender
  ) => Promise<Response<V>>,
  handleAsyncInServiceWorker: (
    request: Request<T>,
    sender: chrome.runtime.MessageSender
  ) => Promise<Response<V>>
) {
  const { requestSystem, createRequest } = createRequestSystem(
    name,
    handleAsyncInTab,
    handleAsyncInServiceWorker
  );

  registerRequestSystem(requestSystem);

  return { requestSystem, createRequest };
}
