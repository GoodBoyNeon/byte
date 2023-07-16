import { ApplicationCommandType } from 'discord.js';
import { getFiles, importDefault } from '../../util';
import { client } from '../..';
import { guildIds } from '../constants';
import { TableData, logger } from 'console-wizard';
import { Command } from '..';

export const registerCommands = async () => {
  const commands: Command[] = [];
  const commandFiles = getFiles(`${__dirname}/../../commands/`, true);
  const loadedCommands: TableData[] = [];

  for (const file of commandFiles) {
    const CommandInstance = await importDefault(file);

    if (CommandInstance && typeof CommandInstance === 'function') {
      const command = new CommandInstance();

      if (!(command instanceof CommandInstance)) {
        return;
      }
      if (!command.data.type) return logger.error('Command: No type found!');

      if (command.data.application) {
        if (command.data.type === ApplicationCommandType.ChatInput) {
          client.chatInputCommands.set(command.data.name, command);
          loadedCommands.push({
            name: command.data.name,
            type: 'Chat Input Command',
          });
        }
        if (command.data.type === ApplicationCommandType.User) {
          client.userContextMenus.set(command.data.name, command);
          loadedCommands.push({
            name: command.data.name,
            type: 'User Context Menu',
          });
        }
        if (command.data.type === ApplicationCommandType.Message) {
          client.messageContextMenus.set(command.data.name, command);
          loadedCommands.push({
            name: command.data.name,
            type: 'Message Context Menu',
          });
        }

        commands.push(command);
      }
      if (command.data.legacy) {
        client.legacyCommands.set(command.data.name, command);
        loadedCommands.push({ name: command.data.name, type: 'Legacy Command' });
      }
    }
  }

  if (client.environment == 'development') {
    const devGuild = client.guilds.cache.get(guildIds.devGuildId);
    await devGuild?.commands.set(commands.map(c => c.data));

    logger.success(
      `Registered ${commands.length} Application (/) Commands! [Guild]`
    );

    /* Uncomment to Reset all commands */
    // await client.application?.commands.set([]);
    // await devGuild?.commands.set([]);
  }
  if (client.environment === 'production') {
    await client.application?.commands.set(commands.map(c => c.data));

    logger.success(
      `Registered ${commands.length} Application (/) Commands! [Global]`
    );
  }

  logger.info('LOADED COMMANDS:');
  logger.table(loadedCommands);
};
