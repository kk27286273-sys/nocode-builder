import { createHash, createHmac } from 'node:crypto';
import { AwsClient } from 'aws4fetch';
import { releaseContentType } from './release-upload';

const objectKeyPattern = /^r2\/staged\/[0-9a-f-]{36}\.(exe|zip)$/i;

export function r2ReleaseKey(id: string, extension: string) {
  return `r2/staged/${id}.${extension}`;
}

function connection(key?: string) {
  if (key !== undefined && !objectKeyPattern.test(key)) throw new Error('Invalid R2 release object key');
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
  const url = new URL(`/${MEDINSURE_R2_BUCKET}/${key ?? ''}`, endpoint);
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

export async function verifyReleaseStorageProbe(adminSecret: string) {
  const { client, url } = connection();
  const scope = process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_URL;
  if (!scope) throw new Error('Deployment scope is required');
  const fingerprint = createHmac('sha256', adminSecret).update(scope).digest('hex');
  url.pathname += 'diagnostics/' + fingerprint + '.txt';

  const body = 'MedinSure private R2 verification\n';
  const digest = (value: string | ArrayBuffer) => createHash('sha256')
    .update(typeof value === 'string' ? value : Buffer.from(value)).digest('hex');
  async function send(method: string, options: RequestInit = {}) {
    const signed = await client.sign(url, { ...options, method, aws: { allHeaders: true } });
    return fetch(signed, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(7000) });
  }

  let uploaded = false;
  let unsignedDenied = false;
  let contentMatches = false;
  let removed = false;
  try {
    const put = await send('PUT', { body, headers: { 'If-None-Match': '*', 'Content-Type': 'text/plain' } });
    uploaded = put.ok;
    await put.body?.cancel();
    if (uploaded) {
      const anonymous = await fetch(url, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(7000) });
      unsignedDenied = [401, 403].includes(anonymous.status);
      await anonymous.body?.cancel();
      const temporary = new URL(url);
      temporary.searchParams.set('X-Amz-Expires', '60');
      const signed = await client.sign(temporary, { method: 'GET', aws: { signQuery: true } });
      const download = await fetch(signed.url, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(7000) });
      if (download.ok) {
        const bytes = await download.arrayBuffer();
        contentMatches = Buffer.from(bytes).equals(Buffer.from(body)) && digest(bytes) === digest(body);
      } else {
        await download.body?.cancel();
      }
    }
  } catch {
    // Only status booleans leave this routine.
  } finally {
    if (uploaded) {
      try {
        const deletion = await send('DELETE');
        await deletion.body?.cancel();
        const head = await send('HEAD');
        removed = deletion.ok && head.status === 404;
      } catch {
        // Report an unconfirmed cleanup without exposing the request.
      }
    }
  }
  return { uploaded, unsignedDenied, contentMatches, removed };
}
