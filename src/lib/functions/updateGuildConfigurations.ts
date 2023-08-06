export const updateGuildConfig = async () => {
  // client.guilds.cache.forEach(async guild => {
  //   await prisma.guildConfiguration.create({
  //     data: {
  //       guildId: guild.id,
  //       suggestionsConfig: {
  //         create: {
  //           enabled: false,
  //           channelId: null,
  //           attachments: false,
  //         },
  //       },
  //       modLoggers: {
  //         createMany: {
  //           data: [
  //             {
  //               name: 'MessageDelete',
  //               enabled: false,
  //               channelId: null,
  //               webhookUrl: null,
  //             },
  //             {
  //               name: 'MessageEdit',
  //               enabled: false,
  //               channelId: null,
  //               webhookUrl: null,
  //             },
  //             {
  //               name: 'Ban',
  //               enabled: false,
  //               channelId: null,
  //               webhookUrl: null,
  //             },
  //             {
  //               name: 'Kick',
  //               enabled: false,
  //               channelId: null,
  //               webhookUrl: null,
  //             },
  //           ],
  //         },
  //       },
  //     },
  //   });
  // });
  //
  // const guildConfigs = await prisma.guildConfiguration.findMany();
  //
  // for (const guildConfig of guildConfigs) {
  //   try {
  //     await prisma.suggestionsConfig.create({
  //       data: {
  //         enabled: false,
  //         guildId: guildConfig.guildId,
  //         channelId: null,
  //         attachments: false,
  //       },
  //     });
  //   } catch (err) {
  //     if (typeof err === 'string') {
  //       logger.error(err);
  //     }
  //   }
  // }
};
