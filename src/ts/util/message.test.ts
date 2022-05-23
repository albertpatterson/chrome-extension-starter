import { getMessage } from './message';

describe('getMessage', () => {
  it('gets the message', () => {
    expect(getMessage()).toBe('hello from util made with typescript');
  });
});
