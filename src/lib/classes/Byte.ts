import { Client } from 'discord.js';
import { config } from '../../config';

export class Byte extends Client {
  constructor() {
    super(config.clientOptions);
  }

  async deploy() {
    await this.login(process.env.TOKEN);
  }
}
