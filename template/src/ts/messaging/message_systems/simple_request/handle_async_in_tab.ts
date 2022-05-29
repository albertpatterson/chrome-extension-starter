import { SimpleRequest, SimpleData } from './message_system';
import { ResponseResult } from '../../types';

export async function handleAsyncInTab(
  request: SimpleRequest,
  sender: chrome.runtime.MessageSender
): Promise<ResponseResult<SimpleData>> {
  console.log(
    `Handled Simple Request with message "${request.message}" on tab with title "${document.title}"`
  );

  const simpleDataString = `completed on tab with title ${document.title}, responding to Request with message"${request.message}"`;
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
