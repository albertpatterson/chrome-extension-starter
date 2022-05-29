import { SimpleRequest } from './message_system';
import { ResponseResult } from '../../types';

export async function handleAsyncInTab(
  request: SimpleRequest,
  sender: chrome.runtime.MessageSender
): Promise<ResponseResult> {
  console.log(
    `Handled Simple Message with message "${request.message}" on tab with title ${document.title}`
  );

  return {
    succeeded: true,
    data: `completed on tab with title ${document.title}`,
  };
}
