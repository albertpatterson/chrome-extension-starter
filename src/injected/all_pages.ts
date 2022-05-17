import { getMessage } from '../util/message';
const utilMessage: string = getMessage();
console.log(utilMessage);

const messages = ['I', 'run', 'on ', 'all', 'pages'];
for (const message of messages) {
  console.log(message);
}
