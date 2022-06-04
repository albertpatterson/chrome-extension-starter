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

import { Request } from './types';
import { messageSystems } from '../message_systems/message_systems';

export function handleRequestInTab<T>(
  request: Request<T>,
  sender: chrome.runtime.MessageSender,
  sendResponse: (r: any) => void
): boolean {
  for (const messageSystem of messageSystems) {
    if (messageSystem.canHandle(request)) {
      return messageSystem.handle(request, sender, sendResponse, true);
    }
  }

  sendResponse({ succeeded: false, data: 'no handler registered' });
  return false;
}

export function handleRequestInServiceWorker<T>(
  request: Request<T>,
  sender: chrome.runtime.MessageSender,
  sendResponse: (r: any) => void
): boolean {
  for (const messageSystem of messageSystems) {
    if (messageSystem.canHandle(request)) {
      return messageSystem.handle(request, sender, sendResponse, false);
    }
  }

  sendResponse({ succeeded: false, data: 'no handler registered' });
  return false;
}
