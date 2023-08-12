import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';

// export interface ModifiedChatInputCommandInteraction
//   extends ChatInputCommandInteraction {
//   member: GuildMember;
// }
//
// export interface ModifiedUserContextMenuCommandInteraction
//   extends UserContextMenuCommandInteraction {
//   targetMember: GuildMember;
//   member: GuildMember;
// }
//
// export interface ModifiedMessageContextMenuCommandInteraction
//   extends MessageContextMenuCommandInteraction {
//   targetMember: GuildMember;
//   member: GuildMember;
// }
//
// export interface ModifiedAutocompleteInteraction extends AutocompleteInteraction {
//   member: GuildMember;
// }

export interface CommandInteractionMap {
  [ApplicationCommandType.ChatInput]: ChatInputCommandInteraction<'cached'>;
  [ApplicationCommandType.User]: UserContextMenuCommandInteraction<'cached'>;
  [ApplicationCommandType.Message]: MessageContextMenuCommandInteraction<'cached'>;
}
// export type ModifiedCommandInteraction =
//   | ModifiedChatInputCommandInteraction
//   | ModifiedUserContextMenuCommandInteraction
//   | ModifiedMessageContextMenuCommandInteraction;
