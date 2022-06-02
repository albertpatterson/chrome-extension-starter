import { getMessage } from '../../util/message';
const utilMessage = getMessage();
console.log(utilMessage);

const messages = [
  'I',
  'run',
  'on ',
  'the',
  'home',
  'page',
  'only',
  'made',
  'with',
  'javascript',
];
for (const message of messages) {
  console.log(message);
}
