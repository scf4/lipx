import fastify from 'fastify';

import setup from './lib/setup';
import getImage from './lib/getImage';
import isValidUrl from './utils/isValidUrl';

import config from './config';

setup();

const server = fastify();

server.get('/', async () => {
  return 'OK';
});

server.get('/*', async ({ req }, reply) => {
  const imageUrl = req.url.match(/\/(.*)/)[1];

  if (!isValidUrl(imageUrl)) {
    return reply.status(400).send();
  }

  try {
    const { file, type } = await getImage(imageUrl);
    return reply.type(type).send(file);
  } catch (e) {
    console.error(e);
    return reply.status(415).send();
  }
});

server.listen(config.port, (err, address) => {
  if (err) throw err;
  console.log(`Server listening on ${address}`);
});
