import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ColorResolvable,
  EmbedBuilder,
  GuildMember,
} from 'discord.js';
import getColor from 'get-image-colors';
import { emojis } from '../lib/';
import { ModifiedChatInputCommandInteraction } from '../lib';

export const getUserInfo = async (
  interaction: ModifiedChatInputCommandInteraction,
  member: GuildMember,
  ephemeral: boolean = false
) => {
  const colors = await getColor(`${member.displayAvatarURL({ extension: 'png' })}`);
  const hexColors = colors.map(color => color.hex());
  const primaryColorHex = hexColors[0] as ColorResolvable;

  if (!member || !member.joinedTimestamp) return;

  const userCreatedTimestamp = Math.floor(member.user.createdTimestamp / 1000);
  const userJoinedTimestamp = Math.floor(member.joinedTimestamp / 1000);

  let memberPremiumStatus = 'No';

  if (member.premiumSince) {
    memberPremiumStatus = 'Yes';
  }

  const userFlags = member.user.flags?.toArray();
  const badges = getBadges(userFlags as string[]);

  let roles = member.roles.cache
    .sort((a, b) => b.position - a.position)
    .map(r => r)
    .join(' ');

  if (roles.length > 1024) {
    roles = roles.substring(0, 1021);
    roles = roles.substring(0, roles.lastIndexOf(' @'));
    roles += '...';
  }
  if (roles.length === 0) roles = 'None';

  const embed = new EmbedBuilder()
    .setColor(primaryColorHex)
    .setThumbnail(`${member.displayAvatarURL()}`)
    .setDescription(`## ${member.user.username}`)
    .setFields([
      {
        name: `${emojis.id} User ID`,
        value: `${member.id}`,
        inline: true,
      },
      {
        name: `${emojis.sprout} Nickname`,
        value: member.nickname || 'None',
        inline: true,
      },
      {
        name: `${emojis.public} Created`,
        value: `<t:${userCreatedTimestamp}:R>`,
        inline: false,
      },
      {
        name: `${emojis.members} Joined`,
        value: `<t:${userJoinedTimestamp}:R>`,
        inline: true,
      },
      {
        name: `${emojis.boost} Booster`,
        value: `${memberPremiumStatus}`,
        inline: true,
      },
      {
        name: '**Badges and Roles**',
        value: '\n',
        inline: false,
      },
      {
        name: `${emojis.smiley} Badges`,
        value: `${badges.join(' ')}` || 'None',
        inline: false,
      },
      {
        name: `${emojis.planet} Role(s)`,
        value: `${roles}`,
        inline: false,
      },
    ])
    .setFooter({
      text: `Requested by ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL(),
    });

  const avatarButton = new ButtonBuilder()
    .setURL(member.displayAvatarURL())
    .setStyle(ButtonStyle.Link)
    .setLabel('Avatar URL')
    .setEmoji(emojis.link);

  const buttons = [avatarButton];

  const bannerUrl = member.user.bannerURL();
  if (bannerUrl) {
    const bannerButton = new ButtonBuilder()

      .setURL(bannerUrl)
      .setStyle(ButtonStyle.Link)
      .setLabel('Banner URL')
      .setEmoji(emojis.link);

    buttons.push(bannerButton);
  }

  const row = new ActionRowBuilder<ButtonBuilder>({
    components: buttons,
  });
  return {
    embeds: [embed],
    components: [row],
    ephemeral,
  };
};

export const getServerInfo = async (
  interaction: ModifiedChatInputCommandInteraction,
  ephemeral: boolean = false
) => {
  const { guild } = interaction;
  if (!guild) return;

  const owner = `<@${guild?.ownerId}>`;
  const serverCreatedAt = `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`;

  const totalChannels = guild.channels.cache.size;

  const numCategories =
    guild?.channels.cache.filter(
      channel => channel?.type === ChannelType.GuildCategory
    ).size || 0;
  const numThreads =
    guild?.channels.cache.filter(
      c =>
        c.type === ChannelType.PublicThread || c.type === ChannelType.PrivateThread
    ).size || 0;

  const numTextChannel = guild?.channels.cache.filter(
    c => c.type === ChannelType.GuildText
  ).size;
  const numVoiceChannel = guild?.channels.cache.filter(
    channel => channel.type === ChannelType.GuildVoice
  ).size;
  const numForumChannel = guild?.channels.cache.filter(
    channel => channel.type === ChannelType.GuildForum
  ).size;
  const numRoles = guild.roles.cache.map(r => r).length;

  const colors = await getColor(`${guild?.iconURL({ extension: 'png' })}`);
  const hexColors = colors.map(color => color.hex());
  const primaryColorHex = hexColors[0] as ColorResolvable;

  const embed = new EmbedBuilder({
    thumbnail: {
      url: guild?.iconURL() || '',
    },
    description: `## ${guild?.name}`,
    fields: [
      {
        name: `${emojis.id} Server ID`,
        value: guild.id,
        inline: true,
      },
      {
        name: `${emojis.owner} Owner`,
        value: owner,
        inline: true,
      },
      {
        name: `${emojis.public} Server Created`,
        value: serverCreatedAt,
        inline: true,
      },
      {
        name: '**Server Stats**',
        value: '\n',
        inline: false,
      },
      {
        name: `${emojis.members} Total Members`,
        value: `${guild.memberCount}`,
        inline: true,
      },
      {
        name: `${emojis.boost} Boosts`,
        value: `${guild.premiumSubscriptionCount} (Level ${guild.premiumTier})`,
        inline: true,
      },
      {
        name: `${emojis.smiley} Roles`,
        value: `${numRoles}`,
        inline: true,
      },
      {
        name: `**Channels (${totalChannels})**`,
        value: `
${emojis.discovery} Categoires: ${numCategories}
${emojis.textChannel} Text Channels: ${numTextChannel}
${emojis.threads} Threads: ${numThreads}
${emojis.voice} Voice Channels: ${numVoiceChannel}
${emojis.forums} Forum Channels: ${numForumChannel}
`,
      },
    ],
  }).setColor(primaryColorHex);

  const buttons = [];

  const iconUrl = guild.iconURL();
  const bannerUrl = guild.bannerURL();

  if (iconUrl) {
    const iconButton = new ButtonBuilder()
      .setURL(iconUrl)
      .setStyle(ButtonStyle.Link)
      .setLabel('Icon URL')
      .setEmoji(emojis.link);

    buttons.push(iconButton);
  }
  if (bannerUrl) {
    const bannerButton = new ButtonBuilder()
      .setURL(bannerUrl)
      .setStyle(ButtonStyle.Link)
      .setLabel('Banner URL')
      .setEmoji(emojis.link);

    buttons.push(bannerButton);
  }

  const row = new ActionRowBuilder<ButtonBuilder>({
    components: buttons,
  });

  return {
    embeds: [embed],
    components: [row],
    ephemeral,
  };
};

type Badge = {
  ActiveDeveloper: string;
  BugHunterLevel1: string;
  BugHunterLevel2: string;
  PremiumEarlySupporter: string;
  Partner: string;
  Staff: string;
  HypeSquadOnlineHouse1: string;
  HypeSquadOnlineHouse2: string;
  HypeSquadOnlineHouse3: string;
  Hypesquad: string;
  CertifiedModerator: string;
  VerifiedDeveloper: string;
};
const getBadges = (userFlags: string[]) => {
  const badge: Badge = {
    ActiveDeveloper: '<:activedeveloperbadge:1116725876709662862> ',
    BugHunterLevel1: '<:discordbughunter:1116725897781841993> ',
    BugHunterLevel2: '<:discordgoldbughunter:1116725916056424478> ',
    PremiumEarlySupporter: '<:earlysupporter:1116725887732305980> ',
    Partner: '<:partneredserverowner:1116725854282731543> ',
    Staff: '<:discordstaff:1116725872498593814> ',
    HypeSquadOnlineHouse1: '<:hypesquadbravery:1116725880627150881> ',
    HypeSquadOnlineHouse2: '<:hypesquadbrilliance:1116725893243609171> ',
    HypeSquadOnlineHouse3: '<:hypesquadbalance:1116725905428066444> ',
    Hypesquad: '<:hypesquadevents:1116737095420104815>',
    CertifiedModerator: '<:certifiedmoderator:1116725864026083398> ',
    VerifiedDeveloper: '<:earlyverifiedbotdeveloper:1116725847106261102>',
  };

  return userFlags.map((flagName: string) => badge[flagName as keyof Badge]);
};
