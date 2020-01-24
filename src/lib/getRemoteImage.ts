import fs, { ReadStream } from 'fs';
import path from 'path';
import util from 'util';
import fileType from 'file-type';
import fetch, { Response } from 'node-fetch';

import hashString from '../utils/hashString';
import { CACHE_DIR } from '../config';

const fsWriteFile = util.promisify(fs.writeFile);

async function getRemoteImage(imageUrl: string) {
  let response: Response;

  try {
    response = await fetch(imageUrl, { timeout: 6000 });
  } catch {
    return null;
  }

  if (!response.ok) return null;

  const stream = response.body;

  const hash = hashString(imageUrl);

  const filePath = path.join(CACHE_DIR, hash);

  const chunks: Uint8Array[] = [];

  stream.on('data', chunk => {
    chunks.push(chunk);
  });

  await new Promise(res => {
    stream.on('end', () => {
      res();
    });
  });

  const fileBuffer = Buffer.concat(chunks);

  const { mime } = await fileType.fromBuffer(fileBuffer);

  if (!mime.startsWith('image/')) return null;

  fsWriteFile(filePath, fileBuffer);

  return fileBuffer;
}

export default getRemoteImage;
