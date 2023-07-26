import { client } from '..';
import { ModifiedChatInputCommandInteraction } from '../lib';

export const handleChatInputCommands = async (
  interaction: ModifiedChatInputCommandInteraction
) => {
  const command = client.chatInputCommands.get(interaction.commandName);
  const args: string[] = [];

  interaction.options.data.forEach(({ value }) => {
    args.push(String(value));
  });

  const reply = await command?.run({
    client,
    interaction,
    args,
    guild: interaction.guild,
    member: interaction.member,
  });

  if (!reply) return;

  if (command?.data.defered) {
    await interaction.followUp(reply);
    return;
  }
  await interaction.reply(reply);
};