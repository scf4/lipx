import fs from 'fs';
import fastify from 'fastify';
import fileType from 'file-type';

import getCachedImage from './lib/getCachedImage';
import getRemoteImage from './lib/getRemoteImage';
import isValidUrl from './utils/isValidUrl';

import { CACHE_DIR } from './config';

// Create the cache directory
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

// Set up the server
const server = fastify();

server.get('*', async ({ req }, res) => {
  const imageUrl = req.url.match(/\/(.*)/)[1];

  if (!imageUrl) return res.status(200).send('OK');

  // Validate url
  if (!isValidUrl(imageUrl)) return res.status(400).send();

  // Get file from local cache or remote url
  let image = await getCachedImage(imageUrl);
  if (!image) image = await getRemoteImage(imageUrl);

  if (!image) return res.status(502).send();

  // Get mime type
  const { mime } = await fileType.fromBuffer(image);

  return res.type(mime).send(image);
});

const port = +process.env.PORT || 3000;

server.listen(port, (err, address) => {
  if (err) throw err;
  console.log(`Server listening on ${address}`);
});
