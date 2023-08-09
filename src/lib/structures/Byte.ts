import { ActivityType, Client, Collection } from 'discord.js';
import { ChatInputCommand, Command, MessageCommand, UserCommand } from '..';
import { config } from '../../config';
import { handleListeners } from '../../handlers/handleListeners';
import { client } from '../..';
import { logger } from 'console-wizard';

export class Byte extends Client {
  environment: string | undefined;

  chatInputCommands: Collection<string, Command<ChatInputCommand>>;
  userContextMenus: Collection<string, Command<UserCommand>>;
  messageContextMenus: Collection<string, Command<MessageCommand>>;

  constructor() {
    super(config.clientOptions);

    this.environment = process.env.NODE_ENV;

    this.chatInputCommands = new Collection();
    this.userContextMenus = new Collection();
    this.messageContextMenus = new Collection();
  }

  async deploy() {
    logger.info(`Deployment started for ${client.environment} Environment`);
    await handleListeners();
    await this.login(process.env.BOT_TOKEN);
    client.user?.setPresence({
      activities: [
        {
          name: `/help in ${client.guilds.cache.size} Servers!`,
          type: ActivityType.Listening,
        },
      ],
    });
  }
}
