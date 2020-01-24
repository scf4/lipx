import fs from 'fs';
import config from '../config';

export default function setup() {
  // Create the cache directory if it doesn't exist
  if (!fs.existsSync(config.cacheDir)) {
    fs.mkdirSync(config.cacheDir);
  }
}
