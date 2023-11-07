import { readFileSync } from 'fs';
import { fortunesCache, generateRandomNumber } from '../../util';

export const getRandomFortune = () => {
  if (
    !fortunesCache.get('fortunes') ||
    fortunesCache.get('fortunes')?.length === 0
  ) {
    const file = readFileSync(`${__dirname}/../../../data/fortunes`, 'utf8');
    fortunesCache.set('fortunes', file.split('%'));
  }
  const fortunes = fortunesCache.get('fortunes');
  if (!fortunes) return;

  const random = generateRandomNumber(0, fortunes?.length - 1);
  if (!random) return;

  return fortunes[random];
};
