import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  GuildMember,
  InteractionResponse,
} from 'discord.js';
import {
  ChatInputCommand,
  Command,
  CommandRunParams,
  colors,
  emojis,
} from '../../lib';
import { generateRandomNumber } from '../../util';

type RPSFunctionArgs = {
  interaction: ChatInputCommandInteraction<'cached'>;
  opponent: GuildMember | 'Bot';
  userScore: number;
  opponentScore: number;
  reply: InteractionResponse<true>;
  curRound: number;
  maxRounds: number;
};
type ChoiceType = 'rock' | 'paper' | 'scissors';

type Choice = {
  label: string;
  type: ChoiceType;
  defeats: Choice | null;
};
const rock: Choice = {
  label: '🪨 Rock',
  type: 'rock',
  defeats: null,
};

const paper: Choice = {
  label: '📜 Paper',
  type: 'paper',
  defeats: null,
};

const scissors: Choice = {
  label: '✂️ Scissors',
  type: 'scissors',
  defeats: null,
};

rock.defeats = scissors;
paper.defeats = rock;
scissors.defeats = paper;

const choiceMap = [rock, paper, scissors] as const;

class RPS extends Command<ChatInputCommand> {
  constructor() {
    super({
      name: 'rps',
      description: 'Play Rock Paper Scissors with your friends or the Bot!',
      type: ApplicationCommandType.ChatInput,
      options: [
        {
          name: 'opponent',
          description: 'Choose who you want to play with',
          type: ApplicationCommandOptionType.User,
          required: false,
        },
        {
          name: 'rounds',
          description: 'How many rounds do you want to play? (default 1, max 10)',
          minValue: 1,
          maxValue: 10,
          type: ApplicationCommandOptionType.Integer,
          required: false,
        },
      ],
    });
  }
  async run({
    interaction,
  }: CommandRunParams<ApplicationCommandType.ChatInput>): Promise<void> {
    const opponent = interaction.options.getMember('opponent') || 'Bot';
    const maxRounds = interaction.options.getInteger('rounds') || 1;

    // eslint-disable-next-line prefer-const
    const curRound = 1;

    if (typeof opponent !== 'string') {
      if (interaction.member.id === opponent.id) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle('You can not play rock paper scissors with yourself!')
              .setFooter({
                text: 'Tip: You can always play with the bot by not specifying an opponent, if you have no friends',
              }),
          ],
        });
        return;
      }
      if (opponent.user.bot) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle('You can not play rock paper scissors with Discord Bots!')
              .setColor(colors.red),
          ],
          ephemeral: true,
        });
        return;
      }
    }
    const reply = await interaction.deferReply();

    const userScore = 0;
    const opponentScore = 0;
    const baseEmbed = this.getBaseEmbed(interaction, opponent);
    await interaction.followUp('Starting game...');
    if (opponent !== 'Bot') {
      const embed = EmbedBuilder.from(baseEmbed)
        .setDescription(
          `${baseEmbed.data.description}\nPlease request ${opponent} to accept the invite by clicking the button below.`
        )
        .setFooter({ text: `Game of ${maxRounds} rounds` });

      const button = new ButtonBuilder({
        label: 'Accept Invite',
        emoji: emojis.tick,
        customId: `rps--accept`,
        style: ButtonStyle.Success,
      });
      const row = new ActionRowBuilder<ButtonBuilder>({ components: [button] });
      await interaction.editReply({
        content: '',
        embeds: [embed],
        components: [row],
      });

      await reply
        .awaitMessageComponent({
          filter: button =>
            button.customId === `rps--accept` && button.user.id === opponent.id,
          componentType: ComponentType.Button,
          time: 60 * 1000,
        })
        .then(i => {
          i.reply({ content: `Make your choice!`, ephemeral: true });
        })
        .catch(async () => {
          await interaction.editReply({
            content: '',
            embeds: [
              EmbedBuilder.from(baseEmbed)
                .setColor(colors.red)
                .setDescription(
                  `${baseEmbed.data.description}\n${opponent} did not accept the invite in time. The game has been canceled!`
                ),
            ],
            components: [],
          });
        });
    }
    await this.rps({
      interaction,
      userScore,
      opponentScore,
      opponent,
      reply,
      maxRounds,
      curRound,
    });
  }
  async rps({
    interaction,
    opponent,
    reply,
    curRound,
    maxRounds,
    userScore,
    opponentScore,
  }: RPSFunctionArgs) {
    if (curRound > maxRounds) {
      await this.endGame(
        interaction,
        opponent,
        userScore,
        opponentScore,
        curRound - 1
      );
      return;
    }
    const baseEmbed = this.getBaseEmbed(interaction, opponent);

    const starterFieldData = {
      name: `Status`,
      value: `${interaction.member}: **Pending**\n${opponent}: **Pending**`,
    };
    const startEmbed = EmbedBuilder.from(baseEmbed)
      .setDescription(
        `${baseEmbed.data.description}\nMake a choice via the buttons below!\n\n> Scores so far: **${userScore}-${opponentScore}**`
      )
      .setFields(starterFieldData)
      .setFooter({ text: `Round ${curRound} of ${maxRounds}` });

    const buttons = choiceMap.map(choice => {
      return new ButtonBuilder({
        style: ButtonStyle.Primary,
        customId: `rps--choice-${choice.type}`,
        label: choice.label,
      });
    });
    const row = new ActionRowBuilder<ButtonBuilder>({
      components: buttons,
    });
    await interaction.editReply({
      content: '',
      embeds: [startEmbed],
      components: [row],
    });
    const ids = [interaction.user.id, `${opponent === 'Bot' ? null : opponent.id}`];
    const collector = reply.createMessageComponentCollector({
      time: 30 * 1000,
      componentType: ComponentType.Button,
      filter: i => i.customId.startsWith('rps--choice') && ids.includes(i.user.id),
    });
    let userChoice: Choice | undefined;
    let opponentChoice: Choice | undefined;

    collector.on('collect', async i => {
      await i.deferUpdate();
      if (i.user.id === interaction.user.id) {
        userChoice = choiceMap.find(
          choice => choice.type === i.customId.split('-').at(-1)
        );
      }
      if (opponent === 'Bot') {
        opponentChoice = choiceMap[generateRandomNumber(1, 3) || 0];
      } else if (i.user.id === opponent.id) {
        opponentChoice = choiceMap.find(
          choice => choice.type === i.customId.split('-').at(-1)
        );
      }

      if (opponent !== 'Bot' && (!userChoice || !opponentChoice)) {
        const embed = EmbedBuilder.from(startEmbed).setFields({
          name: 'Status',
          value: `
${interaction.member}: **${userChoice ? 'Chosen' : 'Pending'}**
${opponent}: **${opponent ? 'Chosen' : 'Pending'}**
`,
        });
        await interaction.editReply({
          content: '',
          embeds: [embed],
          components: [row],
        });
      }

      if (userChoice && opponentChoice) {
        let status: string = '';
        let winner: GuildMember | 'Bot' | null = null;
        if (userChoice?.defeats === opponentChoice) {
          status = `${interaction.member} Wins`;
          winner = interaction.member;
          userScore++;
        }
        if (opponentChoice?.defeats === userChoice) {
          status = `${opponent} Wins`;
          winner = opponent;
          opponentScore++;
        }
        if (opponentChoice === userChoice) {
          status = `It's a Tie`;
        }

        const overEmbed = EmbedBuilder.from(startEmbed)
          .setDescription(
            `${interaction.member} Chooses **${userChoice?.label}**\n${opponent} chooses **${opponentChoice?.label}**\n\n> ${status}!`
          )
          .setFields();
        if (winner !== 'Bot' && winner?.displayAvatarURL()) {
          overEmbed.setThumbnail(winner.displayAvatarURL());
        }
        if (maxRounds === curRound) {
          await interaction.editReply({
            content: 'The game has completed!',
            embeds: [overEmbed],
            components: [],
          });
          curRound++;
          collector.stop();
          setTimeout(async () => {
            await this.rps({
              interaction,
              reply,
              opponent,
              userScore,
              opponentScore,
              curRound,
              maxRounds,
            });
          }, 1000);
          return;
        }
        overEmbed.addFields({
          name: `Next round will start in 5 seconds...`,
          value: '\n',
        });
        await interaction.editReply({
          content: '',
          embeds: [overEmbed],
          components: [],
        });
        curRound++;
        collector.stop();
        setTimeout(async () => {
          await this.rps({
            interaction,
            reply,
            opponent,
            userScore,
            opponentScore,
            maxRounds,
            curRound,
          });
        }, 5 * 1000);
      }
      collector.on('end', async (_i, reason) => {
        if (reason === 'time') {
          const looser = userChoice ? opponent : interaction.member;
          await interaction.editReply(
            `${looser} failed to response in the given timeframe.`
          );
          return;
        }
      });
    });
  }
  async endGame(
    interaction: ChatInputCommandInteraction<'cached'>,
    opponent: GuildMember | 'Bot',
    userScore: number,
    opponentScore: number,
    rounds: number,
    content?: string
  ) {
    const baseEmbed = this.getBaseEmbed(interaction, opponent);
    const winner =
      userScore > opponentScore
        ? interaction.member
        : userScore < opponentScore
          ? opponent
          : 'None (Tie)';
    const endEmbed = EmbedBuilder.from(baseEmbed)
      .setDescription(
        `${baseEmbed.data.description}\n**Game Ended**\n\n> **Winner:** ${winner}\n> Final Score: **${userScore}-${opponentScore}**`
      )
      .setFooter({ text: `They played a total of ${rounds} rounds` });
    if (typeof winner !== 'string') endEmbed.setThumbnail(winner.displayAvatarURL());

    await interaction.editReply({
      content,
      embeds: [endEmbed],
      components: [],
    });
  }
  getBaseEmbed(
    interaction: ChatInputCommandInteraction<'cached'>,
    opponent: GuildMember | 'Bot'
  ) {
    return new EmbedBuilder({
      author: {
        name: `Started by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      },
      title: 'Rock Paper Scissors',
      description: `# ${interaction.member} vs ${opponent}`,
      color: colors.green,
    });
  }
}

export default RPS;
