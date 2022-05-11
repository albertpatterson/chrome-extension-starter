import { getMessage } from '../util/message';
const utilMessage: string = getMessage();
console.log(utilMessage);

const messages = ['hello', 'from', 'injected', ''];
for (const message of messages) {
  console.log(message);
}
