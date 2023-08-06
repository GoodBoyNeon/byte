import {
  ApplicationCommandType,
  ChatInputApplicationCommandData,
  MessageApplicationCommandData,
  UserApplicationCommandData,
} from 'discord.js';
import { Byte } from '../structures/Byte';
import { CommandInteractionMap } from './IntercationTypes';

export type ChatInputCommand = ApplicationCommandType.ChatInput;
export type MessageCommand = ApplicationCommandType.Message;
export type UserCommand = ApplicationCommandType.User;

export interface CommandRunParams<T extends keyof CommandInteractionMap> {
  client: Byte;
  interaction: CommandInteractionMap[T];
}

type Command<T extends number, U extends object, V extends object> = {
  type: T;
} & U &
  V;

export type ChatInputCommandData = Command<
  ApplicationCommandType.ChatInput,
  {
    devOnly?: boolean;
    ownerOnly?: boolean;
  },
  ChatInputApplicationCommandData
>;

export type UserContextMenuData = Command<
  ApplicationCommandType.User,
  {
    devOnly?: boolean;
    ownerOnly?: boolean;
  },
  UserApplicationCommandData
>;

export type MessageContextMenuData = Command<
  ApplicationCommandType.Message,
  {
    devOnly?: boolean;
    ownerOnly?: boolean;
  },
  MessageApplicationCommandData
>;

export type CommandData =
  | ChatInputCommandData
  | UserContextMenuData
  | MessageContextMenuData;
