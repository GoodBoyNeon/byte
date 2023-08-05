import { ActivityType, Client, Collection } from 'discord.js';
import { ChatInputCommand, Command, MessageCommand, UserCommand } from '..';
import { config } from '../../config';
import { handleListeners } from '../../handlers/handleListeners';
import { client } from '../..';

export class Byte extends Client {
  environment: string | undefined;

  chatInputCommands: Collection<string, Command<ChatInputCommand>>;
  userContextMenus: Collection<string, Command<UserCommand>>;
  messageContextMenus: Collection<string, Command<MessageCommand>>;
  legacyCommands: Collection<string, Command<ChatInputCommand>>;

  constructor() {
    super(config.clientOptions);

    this.environment = process.env.NODE_ENV;

    this.chatInputCommands = new Collection();
    this.userContextMenus = new Collection();
    this.messageContextMenus = new Collection();
    this.legacyCommands = new Collection();
  }

  async deploy() {
    await handleListeners();
    await this.login(process.env.BOT_TOKEN);
    client.user?.setPresence({
      activities: [
        {
          name: `${client.guilds.cache.size} Servers!`,
          type: ActivityType.Watching,
        },
      ],
    });
  }
}
