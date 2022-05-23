import { getMessage } from '../util/message';
const utilMessage = getMessage();
console.log(utilMessage);

const messages = [
  'I',
  'run',
  'on ',
  'all',
  'pages',
  'made',
  'with',
  'javascript',
];
for (const message of messages) {
  console.log(message);
}
