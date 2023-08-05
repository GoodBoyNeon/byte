import { colors } from '../../lib';

export const getColor = (pos: number, neg: number) => {
<<<<<<< HEAD
  return pos > neg ? colors.green : pos < neg ? colors.red : colors.secondary;
=======
  return pos > neg ? colors.green : pos < neg ? colors.red : colors.white;
>>>>>>> refs/remotes/origin/main
};
