import { logger } from 'console-wizard';
import { client, prisma } from '../..';
import { ModlogConfigurationOptions } from '../../lib/';
import { ChannelType, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { colors, embeds, emojis } from '../../lib';

export class ModlogConfiguration<T extends ModlogConfigurationOptions> {
  options: T;
  constructor(options: T) {
    this.options = options;
  }

  async getModLogger() {
    return await prisma.modLogger.findUnique({
      where: {
        name_guildId: {
          name: this.options.name,
          guildId: this.options.guildId,
        },
      },
    });
  }

  async save() {
    try {
      const modlogger = await prisma.modLogger.findUnique({
        where: {
          name_guildId: {
            name: this.options.name,
            guildId: this.options.guildId,
          },
        },
      });

      if (!modlogger) {
        await prisma.modLogger.create({
          data: {
            name: this.options.name,
            enabled: this.options.enabled || false,
            guildConfig: {
              connectOrCreate: {
                where: { guildId: this.options.guildId },
                create: { guildId: this.options.guildId },
              },
            },
            channelId: this.options.channelId,
          },
        });
        return;
      } else {
        await prisma.modLogger.update({
          where: {
            name_guildId: {
              name: this.options.name,
              guildId: this.options.guildId,
            },
          },
          data: {
            name: this.options.name,
            enabled: this.options.enabled,
          },
        });
      }
    } catch (error) {
      if (typeof error == 'string') logger.error(error);
    }
  }
  async init(interaction: ChatInputCommandInteraction<'cached'>) {
    const isEnabled = this.options.enabled ? emojis.tick : emojis.x;

    const keys = ['enabled', 'channel'];

    const embed = new EmbedBuilder({
      title: `${emojis.gear} ${this.options.name} Logger`,

      description: `Configure ${this.options.name} mog logger. To change a option, send a message with \`option_name new_value\`. React to ${emojis.x} to cancel.`,
      color: colors.secondary,
      fields: [
        {
          name: 'Enabled',
          value: `${isEnabled} (Possible values: \`yes\`, \`no\`)`,
        },
        {
          name: 'Channel',
          value: this.options.channelId ? `<#${this.options.channelId}>` : 'Not set',
        },
      ],
      timestamp: new Date(),
    });

    const replyMessage = await interaction.followUp({
      embeds: [embed],
    });
    await replyMessage.react(emojis.x);

    const reactionCollector = replyMessage.createReactionCollector({
      max: 1,
      time: 5 * 60 * 1000,
      filter: (reaction, user) =>
        reaction.emoji.toString() === emojis.x && user.id === interaction.user.id,
    });

    const messageCollector = replyMessage.channel.createMessageCollector({
      time: 5 * 60 * 1000,
      filter: m => m.author.id === interaction.user.id,
    });

    reactionCollector.on('collect', async r => {
      messageCollector.stop();
      await r.message.delete().catch(() => {
        interaction.followUp({ embeds: [embeds.error] });
      });
    });
    reactionCollector.on('end', async (_collected, reason) => {
      if (reason !== 'time') return;

      messageCollector.stop();
      await replyMessage.edit({
        embeds: [embeds.expired],
      });
      setTimeout(async () => await replyMessage.delete().catch(() => {}), 60 * 1000);
    });

    messageCollector.on('collect', async m => {
      const args = m.content.toLowerCase().split(' ');
      const key = args[0];
      const value = args[1];

      if (!key) return;

      if (!keys.includes(key)) {
        await m.reply(`Invalid key! The valid ones are: ${keys.join(', ')}`);
        return;
      }

      if (key === 'channel') {
        const channel = m.mentions.channels.first();
        if (!channel) {
          await m.reply('Invalid Channel!');
          return;
        }
        if (channel.type !== ChannelType.GuildText) {
          await m.reply(`${channel} is not a Text Channel`);
          return;
        }
        const webhook = await channel
          .createWebhook({
            name: `Byte | ${this.options.name}`,
            avatar: `${client.user?.displayAvatarURL()}`,
            reason: this.options.name,
          })
          .catch(
            async () =>
              await m.reply(
                'I do not have permissions to create webhook!\n\n**Hint:** Enable `Manage Webhooks` permissions for `byte` role'
              )
          );

        const channelId = channel.id;

        await prisma.modLogger.update({
          where: {
            name_guildId: {
              name: this.options.name,
              guildId: this.options.guildId,
            },
          },
          data: {
            channelId,
            webhookUrl: webhook.url,
          },
        });
        await m.reply(`Set channel to ${channel}`);
      }
      if (key === 'enabled') {
        const enabled = value === 'yes' ? true : value === 'no' ? false : undefined;
        if (!enabled) {
          await m.reply('Wrong value provided. Your options are: `yes` or `no`');
          return;
        }
        const status = enabled ? 'Enabled' : 'Disabled';
        await prisma.modLogger.update({
          where: {
            name_guildId: {
              name: this.options.name,
              guildId: this.options.guildId,
            },
          },
          data: {
            enabled,
          },
        });

        await m.reply(`${status} ${this.options.name} Logger!`);
      }
    });
  }
}
