import { Client } from 'discord.js';
import { Listener, updateGuildConfig } from '../../lib/';
import { logger } from 'console-wizard';
import { registerCommands } from '../../lib/';

class Ready extends Listener<'ready'> {
  constructor() {
    super('ready');
  }

  protected async run(client: Client<true>): Promise<void> {
    logger.success(`Connected to Discord via Client ${client.user.tag}!`);

    await registerCommands();
    await updateGuildConfig();
  }
}

export default Ready;
