/**
 * This module should not need to be updated for new request types
 */

import { createMessageSystem } from '../../framework/base_message_system';
import { handleAsyncInTab } from './handle_async_in_tab';
import { handleAsyncInServiceWorker } from './handle_async_in_service_worker';
import { NAME } from './types';

export const { messageSystem, createRequest } = createMessageSystem(
  NAME,
  handleAsyncInTab,
  handleAsyncInServiceWorker
);
