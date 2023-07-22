import { Client } from 'discord.js';
import { Listener } from '../../lib/';
import { logger } from 'console-wizard';
import { registerCommands } from '../../lib/';

class Ready extends Listener<'ready'> {
  constructor() {
    super('ready');
  }

  protected async run(client: Client<true>): Promise<void> {
    logger.success(`Connected to Discord via Client ${client.user.tag}!`);

    await registerCommands();
  }
}

export default Ready;
