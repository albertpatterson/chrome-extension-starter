import { BaseRequest } from './types';
import { getMessageSystems } from './message_systems';

export async function sendRequest(tabId: number, request: BaseRequest) {
  for (const messageSystem of getMessageSystems()) {
    if (messageSystem.canHandle(request)) {
      return await messageSystem.sendInServiceWorker(tabId, request);
    }
  }

  throw new Error('no message system registered for message type');
}

export function handleRequest(
  request: BaseRequest,
  sender: chrome.runtime.MessageSender,
  sendResponse: (r: any) => void
): boolean {
  for (const messageSystem of getMessageSystems()) {
    if (messageSystem.canHandle(request)) {
      return messageSystem.handleInTab(request, sender, sendResponse);
    }
  }

  sendResponse({ succeeded: false, data: 'no handler registered' });
  return false;
}
