import fetch, { RequestInit, RequestInfo } from 'node-fetch';
import AbortController from 'abort-controller';

export default async function fetchFile(url: RequestInfo, init?: RequestInit) {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const response = await fetch(url, { ...init, signal });
    const file = await response.buffer();
    return file;
  } catch (error) {
    controller.abort();
    throw error;
  }
}