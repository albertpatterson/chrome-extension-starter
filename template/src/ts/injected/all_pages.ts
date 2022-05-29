import { handleRequestInTab, sendRequestInTab } from '../messaging/message';
import { logResponse } from '../messaging/util';
import { create as createSimpleRequest } from '../messaging/message_systems/simple_request/message_system';

(async () => {
  const msg = `page with title "${document.title}" loaded!`;
  console.log(`sending simple request in tab with message "${msg}"`);
  const result = await sendRequestInTab(createSimpleRequest(msg));
  logResponse(result);
})();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('received request in tab', request);

  return handleRequestInTab(request, sender, sendResponse);
});
