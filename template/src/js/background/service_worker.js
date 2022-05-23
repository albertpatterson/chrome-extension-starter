import { getMessage } from '../util/message';
const utilMessage = getMessage();
console.log(utilMessage);

const messages = ['hello', 'from', 'background', 'made', 'with', 'javascript'];
for (const message of messages) {
  console.log(message);
}
