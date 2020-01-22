import fs, { ReadStream } from 'fs';
import path from 'path';
import util from 'util';

import hashString from '../utils/hashString';
import { CACHE_DIR } from '../config';

const fsExists = util.promisify(fs.exists);
const fsReadFile = util.promisify(fs.readFile);

async function getCachedImage(imageUrl: string) {
  const hash = hashString(imageUrl);

  const filePath = path.join(CACHE_DIR, hash);

  const fileExists = await fsExists(filePath);

  if (!fileExists) return null;

  return fsReadFile(filePath);
}

export default getCachedImage;
