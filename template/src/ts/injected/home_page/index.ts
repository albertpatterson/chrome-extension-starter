import { getMessage } from '../../util/message';
const utilMessage: string = getMessage();
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
  'typescript',
];
for (const message of messages) {
  console.log(message);
}
