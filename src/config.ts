import path from 'path';

const config = {
  port: +process.env.PORT || 3000,
  cacheDir: path.join(__dirname, '..', '.cache'),
  timeout: 8000,
  maxSize: 12 * 1000 * 1000,
};

export default config;
