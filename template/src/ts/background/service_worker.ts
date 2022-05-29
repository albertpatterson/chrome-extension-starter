import { handleRequestInServiceWorker } from '../messaging/message';
import { logResponse } from '../messaging/util';
import { create as createSimpleRequest } from '../messaging/message_systems/simple_request/message_system';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('received message in service worker', request);

  return handleRequestInServiceWorker(request, sender, sendResponse);
});
