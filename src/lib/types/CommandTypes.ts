import {
  ApplicationCommandType,
  AutocompleteInteraction,
  ChatInputApplicationCommandData,
  MessageApplicationCommandData,
  UserApplicationCommandData,
} from 'discord.js';
import { Byte } from '../structures/Byte';
import { CommandInteractionMap } from './InteractionTypes';

export type ChatInputCommand = ApplicationCommandType.ChatInput;
export type UserCommand = ApplicationCommandType.User;
export type MessageCommand = ApplicationCommandType.Message;

export interface CommandTypeMap {
  [ApplicationCommandType.ChatInput]: ApplicationCommandType.ChatInput;
  [ApplicationCommandType.User]: ApplicationCommandType.User;
  [ApplicationCommandType.Message]: ApplicationCommandType.Message;
}

export interface CommandRunParams<T extends keyof CommandInteractionMap> {
  client: Byte;
  interaction: CommandInteractionMap[T];
}
export type CommandAutocompleteParams = {
  client: Byte;
  interaction: AutocompleteInteraction<'cached'>;
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
