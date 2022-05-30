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
