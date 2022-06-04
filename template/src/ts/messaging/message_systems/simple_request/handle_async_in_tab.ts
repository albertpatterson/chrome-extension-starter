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
 * Update this function to contain the logic run in the tab when this request type is recieved.
 */

import { SimpleRequestData, SimpleRequestResponseData } from './types';
import { Request, ResponseResult } from '../../framework/types';

export async function handleAsyncInTab(
  request: Request<SimpleRequestData>,
  sender: chrome.runtime.MessageSender
): Promise<ResponseResult<SimpleRequestResponseData>> {
  console.log(
    `Handled Simple Request with message "${request.data.message}" on tab with title "${document.title}"`
  );

  const simpleDataString = `completed on tab with title ${document.title}, responding to Request with message"${request.data.message}"`;
  console.log(
    `returning successful result in tab with simpleDataString "${simpleDataString}"`
  );

  return {
    succeeded: true,
    data: {
      simpleDataString,
    },
  };
}
