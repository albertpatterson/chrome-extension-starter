import { BaseRequest, ResponseResult } from '../../types';

export async function handleAsyncInTab(
  request: BaseRequest,
  sender: chrome.runtime.MessageSender
): Promise<ResponseResult<{}>> {
  throw new Error('noop handleAsyncInTab called');
}
