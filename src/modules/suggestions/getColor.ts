import { colors } from '../../lib';

export const getColor = (pos: number, neg: number) => {
  return pos > neg ? colors.green : pos < neg ? colors.red : colors.white;
};
