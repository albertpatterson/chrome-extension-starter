import { Request, ResponseResult } from '../../framework/types';

export async function handleAsyncInServiceWorker(
  request: Request<{}>,
  sender: chrome.runtime.MessageSender
): Promise<ResponseResult<{}>> {
  throw new Error('noop handleAsyncInServiceWorker called');
}
