import { BaseRequest } from '../../types';
import { createMessageSystem } from '../base_message_system';
import { handleAsyncInTab } from './handle_async_in_tab';
import { handleAsyncInServiceWorker } from './handle_async_in_service_worker';

const SIMPLE_REQUEST_NAME = 'simple request';
export interface SimpleRequest extends BaseRequest {
  name: typeof SIMPLE_REQUEST_NAME;
  message: string;
}

export function create(message: string): SimpleRequest {
  return {
    name: SIMPLE_REQUEST_NAME,
    message,
  };
}

export function canHandle(request: BaseRequest): request is SimpleRequest {
  return request.name === SIMPLE_REQUEST_NAME;
}

export interface SimpleData {
  simpleDataString: string;
}

export const messageSystem = createMessageSystem<SimpleRequest, SimpleData>(
  canHandle,
  handleAsyncInTab,
  handleAsyncInServiceWorker
);
