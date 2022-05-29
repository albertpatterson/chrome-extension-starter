import {
  SimpleRequest,
  SimpleData,
  messageSystem as simpleMessageSystem,
} from './message_system';
import { ResponseResult } from '../../types';
import { create as createSimpleRequest } from './message_system';
import { logResponse, stringifyResponse } from '../../util';

export async function handleAsyncInServiceWorker(
  request: SimpleRequest,
  sender: chrome.runtime.MessageSender
): Promise<ResponseResult<SimpleData>> {
  console.log(
    `Handling Simple Request with message "${request.message}" in service worker`
  );

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  const activeTab = tabs[0];

  const msg = `Hello from service worker, replying to your request "${request.message}"`;
  const simpleRequest = createSimpleRequest(msg);

  console.log(`sending simple request in service worker with message"${msg}"`);
  const response = await simpleMessageSystem.sendInServiceWorker(
    activeTab.id,
    simpleRequest
  );

  logResponse(response);

  const data = {
    simpleDataString: `completed on in service worker with response "${stringifyResponse(
      response
    )}"}`,
  };
  console.log(
    `returning successful result in service worker with simpleDataString "${data.simpleDataString}"`
  );
  return {
    succeeded: true,
    data,
  };
}
