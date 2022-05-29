import { ResponseResult, isResponseFailure } from './types';

export function stringifyResponse(response: ResponseResult | void) {
  if (response) {
    if (isResponseFailure(response)) {
      return `response failure: "${response.data}"`;
    } else {
      return `response success: "${response.data}"`;
    }
  } else {
    return 'no response received';
  }
}

export function logResponse(response: ResponseResult | void) {
  console.log(stringifyResponse(response));
}
