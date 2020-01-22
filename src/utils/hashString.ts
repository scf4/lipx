import crypto from 'crypto';

function hashString(input: string) {
  return crypto
    .createHash('md5')
    .update(input)
    .digest('hex');
}

export default hashString;
