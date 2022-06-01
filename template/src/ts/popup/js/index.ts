import '../scss/styles.scss';

import { getMessage } from '../../util/message';
const utilMessage: string = getMessage();

console.log(utilMessage);
const messages = ['hello', 'from', 'popup', 'made', 'with', 'typescript'];
for (const message of messages) {
  console.log(message);
}
