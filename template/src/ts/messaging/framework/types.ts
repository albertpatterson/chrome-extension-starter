export interface Request<T> {
  name: string;
  data: T;
}

export interface ResponseSuccess<T> {
  succeeded: true;
  data: T;
}

export interface ResponseFailure<T> {
  succeeded: false;
  data: T;
}

export type ResponseResult<T> = ResponseSuccess<T> | ResponseFailure<T>;

export function isResponseSuccess<T>(
  result: ResponseResult<T>
): result is ResponseSuccess<T> {
  return result.succeeded;
}

export function isResponseFailure<T>(
  result: ResponseResult<T>
): result is ResponseFailure<T> {
  return !result.succeeded;
}
