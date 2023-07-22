import { EmbedBuilder } from 'discord.js';

export const supportServerInvite = 'https://discord.gg/hQpYpA93uA';

export const guildIds = {
  devGuildId: '1108888085988638844',
  mainGuildId: '964184865480278026',
};

export const colors = {
  primary: 0x00e484,
  secondary: 0x2b2d31,
  yellow: 0xf9e2af,
  red: 0xf38ba8,
};

export const emojis = {
  bullet: '<:bullet:1128979261810819113>',
  boost: '<:boosticon:1130102559751815208>',
  id: '<:idicon:1131573159628390471>',
  members: '<:members:1131573754619756725>',
  public: '<:public:1131573490034692097>',
  sprout: '<:sprout:1131571354311864360>',
  owner: '<:owner:1130112992026034246>',
  planet: '<:planet:1131570501471453194>',
  smiley: '<:smiley_:1131570749522583604>',
  x: '<:x_:1131236279422562405>',
  gear: '<:gear_:1131569644357046332>',
  tick: '<:tick:1131221693159981117>',
  link: '<:link_:1131569823273472070>',
  textChannel: '<:text_channel:1131574384897822841>',
  threads: '<:threads:1131574380183437393>',
  voice: '<:voice:1131574375167049833>',
  discovery: '<:discovery:1131574372121980978>',
  forums: '<:forums:1131575144775688292>',
};

export const embeds = {
  error: new EmbedBuilder({
    title: 'An unexpected error occured!',
    description: `Beep boop, this wasn't supposed to happen... I apologize for the inconvenience, please report this bug in [Byte's Support Server](${supportServerInvite})`,
    color: colors.red,
  }),

  expired: new EmbedBuilder({
    title: 'This interaction has expired!',
    color: colors.red,
  }),
};

export const invisChar = ' ';
