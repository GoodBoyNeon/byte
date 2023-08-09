import {
  ApplicationCommandType,
  ChatInputApplicationCommandData,
  MessageApplicationCommandData,
  UserApplicationCommandData,
} from 'discord.js';
import { Byte } from '../structures/Byte';
import {
  CommandInteractionMap,
  ModifiedAutocompleteInteraction,
} from './IntercationTypes';

export type ChatInputCommand = ApplicationCommandType.ChatInput;
export type MessageCommand = ApplicationCommandType.Message;
export type UserCommand = ApplicationCommandType.User;

export interface CommandRunParams<T extends keyof CommandInteractionMap> {
  client: Byte;
  interaction: CommandInteractionMap[T];
}
export type CommandAutocompleteParams = {
  client: Byte;
  interaction: ModifiedAutocompleteInteraction;
};

type Command<T extends number, U extends object, V extends object> = {
  type: T;
} & U &
  V;

type BaseCommandData = {
  devOnly?: boolean;
  ownerOnly?: boolean;
};

export type ChatInputCommandData = Command<
  ApplicationCommandType.ChatInput,
  BaseCommandData,
  ChatInputApplicationCommandData
>;

export type UserContextMenuData = Command<
  ApplicationCommandType.User,
  BaseCommandData & { description?: string },
  UserApplicationCommandData
>;

export type MessageContextMenuData = Command<
  ApplicationCommandType.Message,
  BaseCommandData & { description?: string },
  MessageApplicationCommandData
>;

export type CommandData =
  | ChatInputCommandData
  | UserContextMenuData
  | MessageContextMenuData;
