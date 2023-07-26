import { client } from '..';
import { ModifiedMessageContextMenuCommandInteraction } from '../lib';

export const handleMessageContextMenuCommands = async (
  interaction: ModifiedMessageContextMenuCommandInteraction
) => {
  const command = client.messageContextMenus.get(interaction.commandName);
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
