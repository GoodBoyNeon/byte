import {
  ApplicationCommandType,
  ChatInputApplicationCommandData,
  Guild,
  GuildMember,
  InteractionDeferReplyOptions,
  InteractionReplyOptions,
  Message,
  MessageApplicationCommandData,
  MessageReplyOptions,
  UserApplicationCommandData,
} from 'discord.js';
import { Byte } from '../structures/Byte';
import { ModifiedChatInputCommandInteraction } from './IntercationTypes';

export type CommandRunParams = {
  client: Byte;
  interaction?: ModifiedChatInputCommandInteraction;
  message?: Message;
  args: string[];
  member: GuildMember | null;
  guild: Guild | null;
};
export type CommandReplyOptions = MessageReplyOptions &
  InteractionReplyOptions &
  InteractionDeferReplyOptions;

export type CommandReturnType = Promise<CommandReplyOptions | undefined>;

type Command<T extends number, U extends object, V extends object> = {
  type: T;
} & U &
  V;

export type ChatInputCommandData = Command<
  ApplicationCommandType.ChatInput,
  {
    devOnly?: boolean;
    ownerOnly?: boolean;
    application: true;
    legacy: boolean;
  },
  ChatInputApplicationCommandData
>;

export type UserContextMenuData = Command<
  ApplicationCommandType.User,
  {
    devOnly?: boolean;
    ownerOnly?: boolean;
    application: true;
    legacy: boolean;
  },
  UserApplicationCommandData
>;

export type MessageContextMenuData = Command<
  ApplicationCommandType.Message,
  {
    devOnly?: boolean;
    ownerOnly?: boolean;
    application: true;
    legacy: boolean;
  },
  MessageApplicationCommandData
>;

export type CommandData =
  | ChatInputCommandData
  | UserContextMenuData
  | MessageContextMenuData;
