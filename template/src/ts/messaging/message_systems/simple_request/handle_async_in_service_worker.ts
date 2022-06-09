/**
 * @file
 * @author Albert Patterson <albert.patterson.code@gmail.com>
 * @see [Linkedin]{@link https://www.linkedin.com/in/apattersoncmu/}
 * @see [Github]{@link https://github.com/albertpatterson}
 * @see [npm]{@link https://www.npmjs.com/~apatterson189}
 * @see [Youtube]{@link https://www.youtube.com/channel/UCrECEffgWKBMCvn5tar9bYw}
 * @see [Medium]{@link https://medium.com/@albert.patterson.code}
 *
 * Free software under the GPLv3 licence. Permissions of this strong copyleft
 * license are conditioned on making available complete source code of
 * licensed works and modifications, which include larger works using a
 * licensed work, under the same license. Copyright and license notices must
 * be preserved. Contributors provide an express grant of patent rights.
 */

/**
 * Update this function to contain the logic run in the service worker when this request type is recieved.
 */

import { messageSystem as simpleMessageSystem } from './message_system';
import { ResponseResult, Request } from '../../framework/types';
import { createRequest as createSimpleRequest } from './message_system';
import { logResponse, stringifyResponse } from '../../util';
import { SimpleRequestData, SimpleRequestResponseData } from './types';

export async function handleAsyncInServiceWorker(
  request: Request<SimpleRequestData>,
  sender: chrome.runtime.MessageSender
): Promise<ResponseResult<SimpleRequestResponseData>> {
  console.log(
    `Handling Simple Request with message "${request.data.message}" in service worker`
  );

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  const activeTab = tabs[0];

  const msg = `Hello from service worker, replying to your request "${request.data.message}"`;
  const simpleRequest = createSimpleRequest({ message: msg });

  console.log(`sending simple request in service worker with message"${msg}"`);
  const response =
    activeTab.id === undefined
      ? { succeeded: false, data: { simpleDataString: 'no active tab id' } }
      : await simpleMessageSystem.sendInServiceWorker(
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
