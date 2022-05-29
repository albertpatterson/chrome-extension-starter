import { SimpleRequest } from './message_system';
import { ResponseResult } from '../../types';

export async function handleAsyncInTab(
  request: SimpleRequest,
  sender: chrome.runtime.MessageSender
): Promise<ResponseResult> {
  console.log(
    `Handled Simple Request with message "${request.message}" on tab with title "${document.title}"`
  );

  const data = `completed on tab with title ${document.title}, responding to Request with message"${request.message}"`;
  console.log(`returning successful result in tab with data "${data}"`);

  return {
    succeeded: true,
    data,
  };
}
