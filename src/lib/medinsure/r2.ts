import { AwsClient } from 'aws4fetch';
import { releaseContentType } from './release-upload';

const objectKeyPattern = /^r2\/staged\/[0-9a-f-]{36}\.(exe|zip)$/i;

export function r2ReleaseKey(id: string, extension: string) {
  return `r2/staged/${id}.${extension}`;
}

function connection(key: string) {
  if (!objectKeyPattern.test(key)) throw new Error('Invalid R2 release object key');
  const { MEDINSURE_R2_ENDPOINT, MEDINSURE_R2_BUCKET, MEDINSURE_R2_ACCESS_KEY_ID, MEDINSURE_R2_SECRET_ACCESS_KEY } = process.env;
  if (!MEDINSURE_R2_ENDPOINT || !MEDINSURE_R2_BUCKET || !MEDINSURE_R2_ACCESS_KEY_ID || !MEDINSURE_R2_SECRET_ACCESS_KEY ||
    !/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(MEDINSURE_R2_BUCKET)) {
    throw new Error('R2 release storage is not configured');
  }
  const endpoint = new URL(MEDINSURE_R2_ENDPOINT);
  const cloudflare = endpoint.protocol === 'https:' && /^[a-f0-9]{32}(\.(eu|fedramp|us))?\.r2\.cloudflarestorage\.com$/i.test(endpoint.hostname);
  const local = !process.env.VERCEL_ENV && endpoint.protocol === 'http:' && endpoint.hostname === '127.0.0.1';
  if ((!cloudflare && !local) || endpoint.pathname !== '/' || endpoint.username || endpoint.password ||
    endpoint.search || endpoint.hash || (cloudflare && endpoint.port)) throw new Error('Invalid R2 S3 endpoint');
  const url = new URL(`/${MEDINSURE_R2_BUCKET}/${key}`, endpoint);
  const client = new AwsClient({
    accessKeyId: MEDINSURE_R2_ACCESS_KEY_ID, secretAccessKey: MEDINSURE_R2_SECRET_ACCESS_KEY,
    service: 's3', region: 'auto', retries: 0,
  });
  return { client, url };
}

export async function createReleaseUpload(key: string, size: number) {
  const { client, url } = connection(key);
  url.searchParams.set('X-Amz-Expires', '900');
  const headers = { 'Content-Type': releaseContentType, 'If-None-Match': '*' };
  // Fetch supplies Content-Length for a File body. Sign it server-side and
  // return only the headers browser JavaScript is allowed to set.
  const signed = await client.sign(url, {
    method: 'PUT', headers: { ...headers, 'Content-Length': String(size) },
    aws: { signQuery: true, allHeaders: true },
  });
  return { url: signed.url, headers };
}

export async function readReleaseObject(key: string, signal: AbortSignal) {
  const { client, url } = connection(key);
  const signed = await client.sign(url, { method: 'GET' });
  return fetch(signed.url, { method: 'GET', headers: signed.headers, cache: 'no-store', redirect: 'error', signal });
}

export async function createReleaseDownload(key: string, filename: string) {
  const { client, url } = connection(key);
  url.searchParams.set('X-Amz-Expires', '60');
  url.searchParams.set('response-content-disposition', `attachment; filename="${filename}"`);
  const signed = await client.sign(url, { method: 'GET', aws: { signQuery: true } });
  return signed.url;
}
