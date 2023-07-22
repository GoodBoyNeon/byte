export class Configuration<T extends object> {
  options: T;

  constructor(options: T) {
    this.options = options;
  }
}
