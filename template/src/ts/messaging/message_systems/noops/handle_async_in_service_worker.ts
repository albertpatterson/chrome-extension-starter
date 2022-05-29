import { BaseRequest, ResponseResult } from '../../types';

export async function handleAsyncInServiceWorker(
  request: BaseRequest,
  sender: chrome.runtime.MessageSender
): Promise<ResponseResult<{}>> {
  throw new Error('noop handleAsyncInServiceWorker called');
}
