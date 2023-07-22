import { Message } from 'discord.js';
import { Listener } from '../../lib';
import { handleLegacyCommands } from '../../handlers/';
import { config } from '../../config';

class MessageCreate extends Listener<'messageCreate'> {
  constructor() {
    super('messageCreate');
  }

  protected async run(message: Message<boolean>): Promise<void> {
    // if (message.content.match(client.prefixMatch)) {
    if (message.content.startsWith(config.primaryPrefix))
      await handleLegacyCommands(message);
  }
}

export default MessageCreate;
