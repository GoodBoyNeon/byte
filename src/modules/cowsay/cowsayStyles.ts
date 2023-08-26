export const CowsayStyleType = {
  BorgCow: 'BorgCow',
  DeadCow: 'DeadCow',
  GreedyCow: 'GreedyCow',
  ParanoidCow: 'ParanoidCow',
  StonedCow: 'StonedCow',
  TiredCow: 'TiredCow',
  WiredCow: 'WiredCow',
  YoungCow: 'YoungCow',
} as const;

export type CowsayStyle = Record<keyof typeof CowsayStyleType, string>;

const cowsayStyle: CowsayStyle = {};
