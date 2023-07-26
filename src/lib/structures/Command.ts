import { logger } from 'console-wizard';
import {
  CommandData,
  CommandInteractionMap,
  CommandReturnType,
  CommandRunParams,
} from '..';
import { client } from '../..';

export class Command<T extends keyof CommandInteractionMap> {
  public data: CommandData;

  constructor(data: CommandData) {
    this.data = data;
  }

  async run(_params: CommandRunParams<T>): CommandReturnType {
    if (client.environment === 'development') {
      logger.info(`New Command: ${this.data.name}`);
    }
    return;
  }
}
