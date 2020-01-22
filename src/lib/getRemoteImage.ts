import fs, { ReadStream } from 'fs';
import path from 'path';
import fetch, { Response } from 'node-fetch';

import hashString from '../utils/hashString';
import { CACHE_DIR } from '../config';

async function getRemoteImage(imageUrl: string) {
  let response: Response;

  try {
    response = await fetch(imageUrl, { timeout: 6000 });
  } catch {
    return null;
  }

  if (!response.ok) return null;

  const stream = response.body;

  const chunks: Uint8Array[] = [];

  const hash = hashString(imageUrl);
  const filePath = path.join(CACHE_DIR, hash);
  const writeStream = fs.createWriteStream(filePath);

  stream.on('data', chunk => {
    writeStream.write(chunk);
    chunks.push(chunk);
  });

  await new Promise(res => {
    stream.on('end', () => {
      writeStream.end();
      res();
    });
  });

  return Buffer.concat(chunks);
}

export default getRemoteImage;
