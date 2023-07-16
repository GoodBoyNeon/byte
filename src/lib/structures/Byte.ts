import { Client, Collection } from 'discord.js';
import { Command } from '..';
import { config } from '../../config';
import { handleListeners } from '../../handlers/handleListeners';

export class Byte extends Client {
  environment: string | undefined;
  prefixMatch: RegExp;

  chatInputCommands: Collection<string, Command>;
  userContextMenus: Collection<string, Command>;
  messageContextMenus: Collection<string, Command>;
  legacyCommands: Collection<string, Command>;

  constructor() {
    super(config.clientOptions);

    this.environment = process.env.NODE_ENV;
    this.prefixMatch = new RegExp(config.prefixRegexp, 'i');

    this.chatInputCommands = new Collection();
    this.userContextMenus = new Collection();
    this.messageContextMenus = new Collection();
    this.legacyCommands = new Collection();
  }

  async deploy() {
    await handleListeners();
    await this.login(process.env.BOT_TOKEN);
  }
}
