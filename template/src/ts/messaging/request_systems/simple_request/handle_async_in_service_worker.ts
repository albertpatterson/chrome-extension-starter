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

import { simpleRequestSystem } from '.';
import { Response, Request } from '../../framework/types';
import { createSimpleRequest } from '.';
import { logResponse, stringifyResponse } from '../../util';
import { SimpleRequestData, SimpleResponseData } from './types';

export async function handleAsyncInServiceWorker(
  request: Request<SimpleRequestData>,
  sender: chrome.runtime.MessageSender
): Promise<Response<SimpleResponseData>> {
  console.log(
    `Handling Simple Request with message "${request.data.message}" in service worker`
  );

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  const activeTabId = activeTab?.id;

  if (activeTabId === undefined) {
    return {
      succeeded: false,
      data: {
        error: 'active tab not found.',
      },
    };
  }

  const msg = `Hello from service worker, replying to your request "${request.data.message}"`;
  const simpleRequest = createSimpleRequest({ message: msg });

  console.log(
    `sending simple request in service worker (to active tab) with message"${msg}"`
  );
  const response = await simpleRequestSystem.sendRequestToTab(
    activeTabId,
    simpleRequest
  );

  console.log('received response (from active tab):');
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
