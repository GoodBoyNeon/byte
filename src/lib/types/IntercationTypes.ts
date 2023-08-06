import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  GuildMember,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';

export interface ModifiedChatInputCommandInteraction
  extends ChatInputCommandInteraction {
  member: GuildMember;
}

export interface ModifiedUserContextMenuCommandInteraction
  extends UserContextMenuCommandInteraction {
  targetMember: GuildMember;
  member: GuildMember;
}

export interface ModifiedMessageContextMenuCommandInteraction
  extends MessageContextMenuCommandInteraction {
  targetMember: GuildMember;
  member: GuildMember;
}

export interface ModifiedAutocompleteInteraction extends AutocompleteInteraction {
  member: GuildMember;
}

export interface CommandInteractionMap {
  1: ModifiedChatInputCommandInteraction;
  2: ModifiedUserContextMenuCommandInteraction;
  3: ModifiedMessageContextMenuCommandInteraction;
}

export type ModifiedCommandInteraction =
  | ModifiedChatInputCommandInteraction
  | ModifiedUserContextMenuCommandInteraction
  | ModifiedMessageContextMenuCommandInteraction;
