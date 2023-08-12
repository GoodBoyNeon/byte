import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  ColorResolvable,
  EmbedBuilder,
  GuildMember,
} from 'discord.js';
import getColor from 'get-image-colors';
import { colors, emojis, inviteLink, supportServerInvite } from '../lib/';
import { client } from '..';
import { cpus } from 'os';

export const getBotInfo = async (
  interaction: ChatInputCommandInteraction<'cached'>,
  ephemeral: boolean = false
) => {
  const memoryUsage = `${Math.round(
    process.memoryUsage().heapUsed / 1048576
  )} MB / ${Math.round(process.memoryUsage().heapTotal / 1048576)} MB`;

  const cpuUsage = `${cpus()
    .map(({ times }) => {
      return `${
        Math.round(
          ((times.user + times.nice + times.sys + times.irq) / times.idle) * 10000
        ) / 100
      }%`;
    })
    .join(' | ')}`;

  const embed = new EmbedBuilder({
    description: `## ${client.user?.username}\nByte is a general-purpose Discord Bot made to serve your server, with cutting-edge features and little to no bugs!\n`,
    thumbnail: { url: client.user?.displayAvatarURL() || '' },
    color: colors.green,
    fields: [
      {
        name: `${emojis.id} User ID`,
        value: `${client.user?.id}`,
        inline: true,
      },
      {
        name: `${emojis.sprout} Username`,
        value: `${client.user?.tag}`,
        inline: true,
      },
      {
        name: `${emojis.public} Guilds Count`,
        value: `${client.guilds.cache.size}`,
        inline: true,
      },
      {
        name: '**Specs for nerds**',
        value: `
**Written in:** Typescript (discord.js)
**Node Version:** ${process.version}
**CPU Usage:** ${cpuUsage}
**RAM Usage:** ${memoryUsage}`,
      },
    ],
  });
  const inviteLinkButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Link)
    .setURL(inviteLink)
    .setLabel('Invite');

  const joinServerButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Link)
    .setURL(supportServerInvite)
    .setLabel('Support Server');

  const row = new ActionRowBuilder<ButtonBuilder>({
    components: [inviteLinkButton, joinServerButton],
  });

  await interaction.reply({
    embeds: [embed],
    ephemeral,
    components: [row],
  });
};

export const getUserInfo = async (
  interaction: ChatInputCommandInteraction<'cached'>,
  member: GuildMember,
  ephemeral: boolean = false
) => {
  const colors = await getColor(`${member.displayAvatarURL({ extension: 'png' })} `);
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
    .setThumbnail(`${member.displayAvatarURL()} `)
    .setDescription(`## ${member.user.username} `)
    .setFields([
      {
        name: `${emojis.id} User ID`,
        value: `${member.id} `,
        inline: true,
      },
      {
        name: `${emojis.sprout} Nickname`,
        value: member.nickname || 'None',
        inline: true,
      },
      {
        name: `${emojis.public} Created`,
        value: `<t:${userCreatedTimestamp}:R> `,
        inline: false,
      },
      {
        name: `${emojis.members} Joined`,
        value: `<t:${userJoinedTimestamp}:R> `,
        inline: true,
      },
      {
        name: `${emojis.boost} Booster`,
        value: `${memberPremiumStatus} `,
        inline: true,
      },
      {
        name: '**Badges and Roles**',
        value: '\n',
        inline: false,
      },
      {
        name: `${emojis.smiley} Badges`,
        value: `${badges.join(' ')} ` || 'None',
        inline: false,
      },
      {
        name: `${emojis.planet} Role(s)`,
        value: `${roles} `,
        inline: false,
      },
    ])
    .setFooter({
      text: `Requested by ${interaction.user.username} `,
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
  await interaction.reply({
    embeds: [embed],
    components: [row],
    ephemeral,
  });
};

export const getServerInfo = async (
  interaction: ChatInputCommandInteraction<'cached'>,
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

  const colors = await getColor(`${guild?.iconURL({ extension: 'png' })} `);
  const hexColors = colors.map(color => color.hex());
  const primaryColorHex = hexColors[0] as ColorResolvable;

  const embed = new EmbedBuilder({
    thumbnail: {
      url: guild?.iconURL() || '',
    },
    description: `## ${guild?.name} `,
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
        value: `${guild.memberCount} `,
        inline: true,
      },
      {
        name: `${emojis.boost} Boosts`,
        value: `${guild.premiumSubscriptionCount} (Level ${guild.premiumTier})`,
        inline: true,
      },
      {
        name: `${emojis.smiley} Roles`,
        value: `${numRoles} `,
        inline: true,
      },
      {
        name: `** Channels(${totalChannels}) ** `,
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

  const buttons: ButtonBuilder[] = [];

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

  await interaction.reply({
    embeds: [embed],
    components: [row],
    ephemeral,
  });
};

type BadgeKey = keyof typeof emojis.badges;

const getBadges = (userFlags: string[]) => {
  return userFlags.map((flagName: string) => emojis.badges[flagName as BadgeKey]);
};
