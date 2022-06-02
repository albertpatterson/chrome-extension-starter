import { handleRequestInTab } from '../../messaging/framework/message';
import { logResponse } from '../../messaging/util';
import { createRequest as createSimpleRequest } from '../../messaging/message_systems/simple_request/message_system';
import { messageSystem } from '../../messaging/message_systems/simple_request/message_system';

/**
 * handle requests sent via the message system
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('received request in tab', request);

  return handleRequestInTab(request, sender, sendResponse);
});

/**
 * Top level extension logic
 */
(async () => {
  const msg = `page with title "${document.title}" loaded!`;
  console.log(`sending simple request in tab with message "${msg}"`);
  const result = await messageSystem.sendInTab(
    createSimpleRequest({ message: msg })
  );
  logResponse(result);

  if (result) {
    console.log(result.data.simpleDataString);
  }
})();
