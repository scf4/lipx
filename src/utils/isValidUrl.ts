import { parse } from 'url';

function isValidUrl(url: string): boolean {
  // We shouldn't need it to be any more complicated than this
  const parsed = parse(url);
  return parsed.hostname && parsed.pathname !== '/';
}

export default isValidUrl;
