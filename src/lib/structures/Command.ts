import { logger } from 'console-wizard';
import { CommandData, CommandReturnType, CommandRunParams } from '..';
import { client } from '../..';

export class Command {
  public data: CommandData;

  constructor(data: CommandData) {
    this.data = data;
  }

  async run(_params: CommandRunParams): CommandReturnType {
    if (client.environment === 'development') {
      logger.info(`New Command: ${this.data.name}`);
    }
    return;
  }
}
