import {
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
}

export interface ModifiedMessageContextMenuCommandInteraction
  extends MessageContextMenuCommandInteraction {
  targetMember: GuildMember;
}
