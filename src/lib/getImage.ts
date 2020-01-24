import fs from 'fs';
import path from 'path';
import util from 'util';
import { MimeType } from 'file-type/core';
import fetch from 'node-fetch';

import validateFileType from './validateFileType';
import hashString from '../utils/hashString';
import { ErrorMessage } from '../types/errors';
import config from '../config';

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
  const response = await fetch(imageUrl, { timeout: config.timeout });

  if (+response.headers.get('Content-Length') > config.maxSize) {
    throw new Error(ErrorMessage.FileTooLarge);
  }

  const file = await response.buffer();
  const type = await validateFileType(file);

  // Save to cache
  await fsWriteFile(filePath, file);

  return { file, type };
}

export default getImage;
