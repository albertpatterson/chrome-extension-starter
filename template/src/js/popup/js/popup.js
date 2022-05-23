import '../scss/popup.scss';

import { getMessage } from '../../util/message';
const utilMessage = getMessage();

console.log(utilMessage);
const messages = ['hello', 'from', 'popup', 'made', 'with', 'javascript'];
for (const message of messages) {
  console.log(message);
}
