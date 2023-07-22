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
        modLoggers: {
          createMany: {
            data: [
              {
                name: 'MessageDelete',
                enabled: false,
                channelId: null,
              },
              {
                name: 'MessageEdit',
                enabled: false,
                channelId: null,
              },
            ],
          },
        },
      },
    });
  }
}

export default GuildCreate;
