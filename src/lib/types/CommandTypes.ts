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
import { CommandInteractionMap } from './IntercationTypes';

export type ChatInputCommand = ApplicationCommandType.ChatInput;
export type MessageCommand = ApplicationCommandType.Message;
export type UserCommand = ApplicationCommandType.User;

export interface CommandRunParams<T extends keyof CommandInteractionMap> {
  client: Byte;
  interaction?: CommandInteractionMap[T];
  message?: Message;
  args: string[];
  member: GuildMember | null;
  guild: Guild | null;
}
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
    defered?: boolean;
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
    defered?: boolean;
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
    defered?: boolean;
    legacy: boolean;
  },
  MessageApplicationCommandData
>;

export type CommandData =
  | ChatInputCommandData
  | UserContextMenuData
  | MessageContextMenuData;
