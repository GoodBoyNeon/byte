import { getFiles } from '../util/getFiles';
import { importDefault } from '../util/importDefault';

export const handleListeners = async () => {
  const listenersDir = `${__dirname}/../listeners/`;
  const listenerFiles = getFiles(listenersDir);

  for (const file of listenerFiles) {
    // TODO: Typesafe `EventListener`
    const EventListener = await importDefault(file);

    if (EventListener && typeof EventListener === 'function') {
      const event = new EventListener();
      if (event instanceof EventListener) {
        event.load();
      }
    }
  }
};
