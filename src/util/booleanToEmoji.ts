import { emojis } from '../lib';

export const booleanToEmoji = (val: boolean) => {
  return val ? emojis.tick : emojis.x;
};
