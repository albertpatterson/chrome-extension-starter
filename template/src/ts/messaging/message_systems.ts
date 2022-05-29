import { BaseRequest } from './types';
import { BaseMessageSystem } from './message_systems/base_message_system';
import { messageSystem as simpleMessageSystem } from './message_systems/simple_request/message_system';

const messageSystems: Array<BaseMessageSystem<BaseRequest, {}>> = [
  simpleMessageSystem,
  // Add subsequent message systems here
];

export function getMessageSystems() {
  return [...messageSystems];
}
