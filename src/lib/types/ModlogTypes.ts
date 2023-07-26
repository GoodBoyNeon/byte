import { ModloggerType } from '@prisma/client';

export interface ModlogConfigurationOptions {
  name: ModloggerType;
  guildId: string;
  channelId: string | null;
  enabled?: boolean;
  webhookUrl?: string | null;
}
