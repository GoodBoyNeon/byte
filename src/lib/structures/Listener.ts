import { ClientEvents } from 'discord.js';
import { client } from '../..';
import { logger } from 'console-wizard';

export class Listener<K extends keyof ClientEvents> {
  public event: K;
  public once: boolean;

  constructor(event: K, once: boolean = false) {
    this.event = event;
    this.once = once;
  }

  protected run(...args: ClientEvents[K]) {
    if (args) {
      return;
    }
    logger.info(`Received ${this.event} event`);
  }

  load() {
    this.once
      ? client.once(this.event, this.run.bind(this))
      : client.on(this.event, this.run.bind(this));
  }
  unload() {
    client.off(this.event, this.run.bind(this));
  }
}
