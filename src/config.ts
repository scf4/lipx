import path from 'path';

const config = {
  port: +process.env.PORT || 3000,
  cacheDir: path.join(__dirname, '..', '.cache'),
  timeout: 6000,
  maxSize: 3 * 1000 * 1000,
};

export default config;
