import fs from 'fs';
import path from 'path';
import util from 'util';
import { MimeType } from 'file-type/core';

import validateFileType from './validateFileType';
import hashString from '../utils/hashString';
import config from '../config';
import fetchFile from '../utils/fetchFile';

const fsExists = util.promisify(fs.exists);
const fsReadFile = util.promisify(fs.readFile);
const fsWriteFile = util.promisify(fs.writeFile);

async function getImage(imageUrl: string): Promise<{ file: Buffer; type: MimeType }> {
  const hash = hashString(imageUrl);
  const filePath = path.join(config.cacheDir, hash);

  // Check local cache
  const alreadyCached = await fsExists(filePath);

  if (alreadyCached) {
    const file = await fsReadFile(filePath);
    const type = await validateFileType(file);

    return { file, type };
  }

  // Load remote image

  const file = await fetchFile(imageUrl, { size: config.maxSize, timeout: config.timeout });

  const type = await validateFileType(file);

  // Save to cache
  await fsWriteFile(filePath, file);

  return { file, type };
}

export default getImage;
