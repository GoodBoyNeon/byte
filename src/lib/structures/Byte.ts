import 'dotenv/config';
import { Client } from 'discord.js';
import { config } from '../../config';
import { handleListeners } from '../../handlers/handleListeners';

export class Byte extends Client {
  constructor() {
    super(config.clientOptions);
  }

  async deploy() {
    await handleListeners();
    await this.login(process.env.BOT_TOKEN);
  }
}
