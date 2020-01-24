import { parse } from 'url';

function isValidUrl(url: string): boolean {
  const parsed = parse(url);

  return (
    ['http:', 'https:'].includes(parsed.protocol) &&
    parsed.hostname &&
    parsed.pathname !== '/'
  );
}

export default isValidUrl;
