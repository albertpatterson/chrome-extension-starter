import { ResponseResult, isResponseFailure } from './framework/types';

export function stringifyResponse<T>(response: ResponseResult<T> | void) {
  if (response) {
    const stringified = JSON.stringify(response.data);
    if (isResponseFailure(response)) {
      return `response failure: "${stringified}"`;
    } else {
      return `response success: "${stringified}"`;
    }
  } else {
    return 'no response received';
  }
}

export function logResponse<T>(response: ResponseResult<T> | void) {
  console.log(stringifyResponse(response));
}
