import { Guild } from 'discord.js';
import { Listener } from '../../lib';
import { prisma } from '../..';

class GuildCreate extends Listener<'guildCreate'> {
  constructor() {
    super('guildCreate');
  }

  protected async run(guild: Guild): Promise<void> {
    await prisma.guildConfiguration.create({
      data: {
        guildId: guild.id,
        suggestionsConfig: {
          create: {
            enabled: false,
            channelId: null,
            attachments: true,
          },
        },
        modLoggers: {
          createMany: {
            data: [
              {
                name: 'MessageDelete',
                enabled: false,
                channelId: null,
                webhookUrl: null,
              },
              {
                name: 'MessageEdit',
                enabled: false,
                channelId: null,
                webhookUrl: null,
              },
              {
                name: 'Ban',
                enabled: false,
                channelId: null,
                webhookUrl: null,
              },
              {
                name: 'Kick',
                enabled: false,
                channelId: null,
                webhookUrl: null,
              },
            ],
          },
        },
      },
    });
  }
}

export default GuildCreate;
