/**
 * @file
 * @author Albert Patterson <albert.patterson.code@gmail.com>
 * @see [Linkedin]{@link https://www.linkedin.com/in/apattersoncmu/}
 * @see [Github]{@link https://github.com/albertpatterson}
 * @see [npm]{@link https://www.npmjs.com/~apatterson189}
 * @see [Youtube]{@link https://www.youtube.com/channel/UCrECEffgWKBMCvn5tar9bYw}
 * @see [Medium]{@link https://medium.com/@albert.patterson.code}
 *
 * Free software under the GPLv3 licence. Permissions of this strong copyleft
 * license are conditioned on making available complete source code of
 * licensed works and modifications, which include larger works using a
 * licensed work, under the same license. Copyright and license notices must
 * be preserved. Contributors provide an express grant of patent rights.
 */

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
