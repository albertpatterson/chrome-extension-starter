import { Request } from './types';
import { messageSystems } from '../message_systems/message_systems';

export function handleRequestInTab<T>(
  request: Request<T>,
  sender: chrome.runtime.MessageSender,
  sendResponse: (r: any) => void
): boolean {
  for (const messageSystem of messageSystems) {
    if (messageSystem.canHandle(request)) {
      return messageSystem.handle(request, sender, sendResponse, true);
    }
  }

  sendResponse({ succeeded: false, data: 'no handler registered' });
  return false;
}

export function handleRequestInServiceWorker<T>(
  request: Request<T>,
  sender: chrome.runtime.MessageSender,
  sendResponse: (r: any) => void
): boolean {
  for (const messageSystem of messageSystems) {
    if (messageSystem.canHandle(request)) {
      return messageSystem.handle(request, sender, sendResponse, false);
    }
  }

  sendResponse({ succeeded: false, data: 'no handler registered' });
  return false;
}
