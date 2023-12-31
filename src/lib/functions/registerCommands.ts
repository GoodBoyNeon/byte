import { ApplicationCommandType } from 'discord.js';
import { getFiles, importDefault } from '../../util';
import { client } from '../..';
import { guildIds } from '../constants';
import { TableData, logger } from 'console-wizard';
import { ChatInputCommand, Command, MessageCommand, UserCommand } from '..';

export const registerCommands = async () => {
  const commands: Command<ChatInputCommand | MessageCommand | UserCommand>[] = [];
  const commandFiles = getFiles(`${__dirname}/../../commands/`, true, [
    '.ts',
    '.js',
  ]);
  const loadedCommands: TableData[] = [];

  for (const file of commandFiles) {
    const CommandInstance = await importDefault(file);

    if (CommandInstance && typeof CommandInstance === 'function') {
      const command = new CommandInstance();

      if (!(command instanceof CommandInstance)) {
        return;
      }
      if (!command.data.type) return logger.error('Command: No type found!');

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
  }
  if (client.environment == 'development') {
    const devGuild = client.guilds.cache.get(guildIds.devGuildId);
    await devGuild?.commands.set(
      commands.map(c => {
        // Remove the description from non-chat input commands
        if (c.data.type !== ApplicationCommandType.ChatInput) {
          const { description, ...data } = c.data;
          return data;
        }
        return c.data;
      })
    );

    logger.success(
      `Registered ${commands.length} Application (/) Commands! [Guild]`
    );
  }
  if (client.environment === 'production') {
    await client.application?.commands.set(
      commands.map(c => {
        // Remove the description from non-chat input commands
        if (c.data.type !== ApplicationCommandType.ChatInput) {
          const { description, ...data } = c.data;
          return data;
        }
        return c.data;
      })
    );

    logger.success(
      `Registered ${commands.length} Application (/) Commands! [Global]`
    );
  }

  logger.info('LOADED COMMANDS:');
  logger.table(loadedCommands);
};
