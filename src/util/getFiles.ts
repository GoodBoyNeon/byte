import { readdirSync } from 'fs';
import { join } from 'path';

export const getFiles = (
  path: string,
  categorized: boolean = false,
  extension?: string[]
): string[] => {
  const files: string[] = [];

  const firstDepthFSNodes = readdirSync(path);

  firstDepthFSNodes.forEach(FSNode => {
    if (!categorized) {
      files.push(join(path, FSNode));
    } else {
      // Basically files but named this way for consistency
      const secondDepthFSNodes = readdirSync(`${path}/${FSNode}`);

      secondDepthFSNodes.forEach(fileName => {
        files.push(join(path, FSNode, fileName));
      });
    }
  });
  if (extension) {
    return files.filter(file => extension.some(ext => file.endsWith(ext)));
  }
  return files;
};
