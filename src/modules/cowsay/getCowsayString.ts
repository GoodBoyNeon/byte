import { readFileSync } from 'fs';
import {
  GetCowsayStringProps,
  defaultTongue,
  eyes,
  specialTongue,
} from './cowsayData';

export const getCowsayString = ({ text, file, style }: GetCowsayStringProps) => {
  let cow = '';
  const eyesStr = eyes[style];
  const tongue =
    style === 'dead' || style === 'stoned' ? specialTongue : defaultTongue;

  const thoughts = '\\';
  const ballonTopLines = ' ' + '_'.repeat(text.length + 2) + ' ';
  const ballonBottomLines = ' ' + '-'.repeat(text.length + 2) + ' ';

  cow += ballonTopLines;
  cow += '\n';

  cow += `< ${text} >`;
  cow += '\n';

  cow += ballonBottomLines;
  cow += '\n';
  const rawCow = readFileSync(`${__dirname}/../../../data/cows/${file}.cow`, {
    encoding: 'utf8',
    flag: 'r',
  });
  cow +=
    rawCow
      .split('$the_cow = <<EOC;')
      .at(-1)
      ?.split('EOC')[0]
      ?.replace('$eyes', eyesStr)
      .replace('$tongue', tongue)
      .replaceAll('$thoughts', thoughts)
      .split('\n')
      .join('\n')
      .split('\\\\')
      .join('\\') ?? '';

  cow += '\n';

  return cow;
};
