import { getFiles } from '../../util';

export const eyes = {
  default: 'oo',
  borg: '==',
  dead: 'xx',
  greedy: '$$',
  paranoid: '@@',
  stoned: '**',
  tired: '--',
  wired: 'OO',
  young: '..',
} as const;

export const defaultTongue = '  ';
// Special tongue appies for styles: dead, stoned
export const specialTongue = 'U ';

export const files = getFiles(`${__dirname}/../../../data/cows`);
export const cowsayFiles =
  files.map(p => p.split('/').at(-1)?.split('.')[0] ?? '') ?? [];
export type GetCowsayStringProps = {
  text: string;
  file: (typeof cowsayFiles)[number];
  style: keyof typeof eyes;
};
