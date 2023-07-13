import { Client } from 'discord.js';
import { Listener } from '../lib/structures/Listener';
import { logger } from 'console-wizard';

class Ready extends Listener<'ready'> {
  constructor() {
    super('ready');
  }

  protected run(client: Client<true>): void {
    logger.success(`Connected to Discord via Client ${client.user.tag}!`);
  }
}

export default Ready;
