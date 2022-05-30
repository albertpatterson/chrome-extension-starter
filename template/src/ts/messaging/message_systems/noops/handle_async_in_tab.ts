import { Request, ResponseResult } from '../../framework/types';

export async function handleAsyncInTab(
  request: Request<{}>,
  sender: chrome.runtime.MessageSender
): Promise<ResponseResult<{}>> {
  throw new Error('noop handleAsyncInTab called');
}
