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
  id: '<:idicon:1130091252499615764>',
  members: '<:members:1130087257546702848>',
  public: '<:public:1130088965177872414>',
  nickname: '<:nicknameicon:1130091557563924572>',
  owner: '<:owner:1130112992026034246>',
  planet: '<:planet:1130092577002115072>',
  smiley: '<:smiley:1130092447016431646>',
};

export const embeds = {
  error: new EmbedBuilder({
    title: 'An unexpected error occured!',
    description: `Beep boop, this wasn't supposed to happen... I apologize for the inconvenience, please report this bug in [Byte's Support Server](${supportServerInvite})`,
    color: colors.red,
  }),
};

export const invisChar = ' ';
