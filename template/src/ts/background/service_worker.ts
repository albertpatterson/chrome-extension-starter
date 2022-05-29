import { create as createSimpleRequest } from '../messaging/message_systems/simple_request/message_system';
import { sendRequest } from '../messaging/message';
import { logResponse } from '../messaging/util';

const testInterval = setInterval(() => {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs) {
      const activeTab = tabs[0];

      const simpleRequest = createSimpleRequest('Hello from service worker');

      const response = await sendRequest(activeTab.id, simpleRequest);

      logResponse(response);

      clearInterval(testInterval);
    }
  );
}, 1e3);
