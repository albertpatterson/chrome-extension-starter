import { handleRequestInServiceWorker } from '../messaging/framework/message';

/**
 * handle requests sent via the message system
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('received message in service worker', request);

  return handleRequestInServiceWorker(request, sender, sendResponse);
});

/**
 * Top level extension logic
 */
(async () => {
  console.log('Extension loaded');
})();
