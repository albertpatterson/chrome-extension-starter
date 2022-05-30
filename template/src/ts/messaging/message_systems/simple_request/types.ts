/**
 * Update these types for each type of request
 */

/** the name of the type of request (must be unique) */
export const NAME = 'simple request';

/**
 * The type of data passed with the request
 */
export interface SimpleRequestData {
  message: string;
}

/**
 * The type of data passed with the response
 */
export interface SimpleRequestResponseData {
  simpleDataString: string;
}
