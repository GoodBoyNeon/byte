import {
  CommandAutocompleteParams,
  CommandData,
  CommandInteractionMap,
  CommandRunParams,
} from '..';

export class Command<T extends keyof CommandInteractionMap> {
  public data: CommandData;

  constructor(data: CommandData) {
    this.data = data;
  }

  async run(_params: CommandRunParams<T>): Promise<void> {}
  async autocomplete(_params: CommandAutocompleteParams): Promise<void> {}
}
