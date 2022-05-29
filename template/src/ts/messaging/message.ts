import { BaseRequest } from './types';
import { getMessageSystems } from './message_systems';

export async function sendRequestInServiceWorker(
  tabId: number,
  request: BaseRequest
) {
  for (const messageSystem of getMessageSystems()) {
    if (messageSystem.canHandle(request)) {
      return await messageSystem.sendInServiceWorker(tabId, request);
    }
  }

  throw new Error('no message system registered for message type');
}

export async function sendRequestInTab(request: BaseRequest) {
  for (const messageSystem of getMessageSystems()) {
    if (messageSystem.canHandle(request)) {
      return await messageSystem.sendInTab(request);
    }
  }

  throw new Error('no message system registered for message type');
}

export function handleRequestInTab(
  request: BaseRequest,
  sender: chrome.runtime.MessageSender,
  sendResponse: (r: any) => void
): boolean {
  for (const messageSystem of getMessageSystems()) {
    if (messageSystem.canHandle(request)) {
      return messageSystem.handle(request, sender, sendResponse, true);
    }
  }

  sendResponse({ succeeded: false, data: 'no handler registered' });
  return false;
}

export function handleRequestInServiceWorker(
  request: BaseRequest,
  sender: chrome.runtime.MessageSender,
  sendResponse: (r: any) => void
): boolean {
  for (const messageSystem of getMessageSystems()) {
    if (messageSystem.canHandle(request)) {
      return messageSystem.handle(request, sender, sendResponse, false);
    }
  }

  sendResponse({ succeeded: false, data: 'no handler registered' });
  return false;
}
