import { ResponseResult, isResponseFailure } from './types';

export function logResponse(response: ResponseResult | void) {
  if (response) {
    if (isResponseFailure(response)) {
      console.log('response failure', response.data);
    } else {
      console.log('response success', response.data);
    }
  } else {
    console.log('no response received');
  }
}
