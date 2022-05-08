import { getMessage } from './message';

describe('getMessage', () => {
  it('gets the message', () => {
    expect(getMessage()).toBe('hello world from util');
  });
});
