/**
 * Register message systems here
 */

import { BaseMessageSystem } from '../framework/base_message_system';
import { messageSystem as simpleMessageSystem } from './simple_request/message_system';

export const messageSystems: Array<BaseMessageSystem<{}, {}>> = [
  simpleMessageSystem,
  // Add new message systems here
];
