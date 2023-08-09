import { EmbedBuilder } from 'discord.js';

export const supportServerInvite = 'https://discord.gg/hQpYpA93uA';

export const inviteLink =
  'https://discord.com/api/oauth2/authorize?client_id=933839241962729562&permissions=403041398&scope=bot%20applications.commands';

export const guildIds = {
  devGuildId: '1108888085988638844',
  mainGuildId: '964184865480278026',
};

export const colors = {
  green: 0x00e484,
  secondary: 0x2b2d31,
  yellow: 0xf9e2af,
  red: 0xf38ba8,
  white: 0xf1f1f1,
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
  greenBox: '<:greenbox:1134837774172819496>',
  redBox: '<:redbox:1134837771748511776>',
  upvote: '<:upvote:1138709561507852359>',
  downvote: '<:downvote:1134841385166577724>',
  badges: {
    ActiveDeveloper: '<:ActiveDeveloper:1138706500769022093>',
    BugHunterLevel1: '<:BugHunterLevel1:1138710294370201662>',
    BugHunterLevel2: '<:BugHunterLevel2:1138710297096503323>',
    PremiumEarlySupporter: '<:PremiumEarlySupporter:1138711374650953799>',
    Partner: '<:Partner:1138711382922121287>',
    Staff: '<:Staff:1138711399481225236>',
    HypeSquadOnlineHouse1: '<:HypeSquadOnlineHouse1:1138711389469417573>',
    HypeSquadOnlineHouse2: '<:HypeSquadOnlineHouse2:1138711402094280744>',
    HypeSquadOnlineHouse3: '<:HypeSquadOnlineHouse3:1138711378841059338>',
    Hypesquad: '<:HypeSquad:1138712452335403018>',
    CertifiedModerator: '<:CertifiedModerator:1138711371966582855>',
    VerifiedDeveloper: '<:VerifiedBotDeveloper:1138711394699714651>',
  },
} as const;

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

  permissionError: new EmbedBuilder({
    title: 'Access Denied: Level Up Your Permissions!',
    description: 'You do NOT have sufficient permissions to perform this action!',
    color: colors.red,
  }),
};
