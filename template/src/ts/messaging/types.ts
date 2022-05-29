export interface BaseRequest {
  name: string;
}

export interface ResponseSuccess {
  succeeded: true;
  data: string;
}

export interface ResponseFailure {
  succeeded: false;
  data: string;
}

export type ResponseResult = ResponseSuccess | ResponseFailure;

export function isResponseSuccess(
  result: ResponseResult
): result is ResponseSuccess {
  return result.succeeded;
}

export function isResponseFailure(
  result: ResponseResult
): result is ResponseFailure {
  return !result.succeeded;
}
