import { readdirSync } from 'fs';
import { join } from 'path';

export const getFiles = (path: string, categorized: boolean = false): string[] => {
  const files: string[] = [];

  const firstDepthFSNodes = readdirSync(path);

  firstDepthFSNodes.forEach(FSNode => {
    if (!categorized) {
      files.push(join(path, FSNode));
      return files;
    }

    // Basically files but named this way for consistency
    const secondDepthFSNodes = readdirSync(`${path}/${FSNode}`);

    secondDepthFSNodes.forEach(fileName => {
      files.push(join(path, FSNode, fileName));
      return files;
    });
  });
  return files;
};
