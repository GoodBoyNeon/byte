type ConfiguratorPropsKey = {
  isUser: boolean;
  isChannel: boolean;
  isRole: boolean;
};
type ConfiguratorProps = {
  name: string;
  data: { [key: string]: ConfiguratorPropsKey | string };
};

export class Configurator<T extends ConfiguratorProps> {
  name: string;
  props: ConfiguratorProps;
  constructor(props: T) {
    this.name = props.name;
    this.props = props;
  }
}
