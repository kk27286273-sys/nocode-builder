import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import test from 'node:test';

const loopback = '127.0.0.1';
const headers = { cookie: 'nexia_admin_session=local-admin', 'content-type': 'application/json' };
const MiB = 1024 * 1024;

async function listen(handler) {
  const server = createServer((req, res) => void Promise.resolve(handler(req, res)).catch(() => {
    if (!res.headersSent) res.writeHead(500);
    res.end();
  }));
  server.listen(0, loopback);
  await once(server, 'listening');
  return { server, url: `http://${loopback}:${server.address().port}` };
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json' }).end(JSON.stringify(value));
}

test('isolated R2 release lifecycle and existing route protections', { timeout: 120000 }, async (t) => {
  const objects = new Map();
  const lengths = new Map();
  const readFailures = new Map();
  const files = [];
  const policies = [];
  const fixture = await listen(async (req, res) => {
    const url = new URL(req.url, 'http://fixture');
    if (url.pathname.startsWith('/test-releases/')) {
      const signedHeaders = url.searchParams.get('X-Amz-SignedHeaders')?.split(';') ?? [];
      const signed = url.searchParams.has('X-Amz-Signature');
      if (req.method === 'PUT') {
        if (!signed || !signedHeaders.includes('if-none-match') || !signedHeaders.includes('content-type') || !signedHeaders.includes('content-length') ||
          req.headers['if-none-match'] !== '*' || req.headers['content-type'] !== 'application/octet-stream')
          return json(res, 403, {});
        if (objects.has(url.pathname)) return json(res, 412, {});
        objects.set(url.pathname, await readBody(req));
        return res.writeHead(200).end();
      }
      if (!signed && !req.headers.authorization?.startsWith('AWS4-HMAC-SHA256 ')) return json(res, 403, {});
      switch (readFailures.get(url.pathname)) {
        case 'denied': return json(res, 403, {});
        case 'network': return req.socket.destroy();
        case 'timeout': return;
      }
      const file = objects.get(url.pathname);
      if (!file) return json(res, 404, {});
      return res.writeHead(200, { 'content-length': lengths.get(url.pathname) ?? file.length,
        'content-disposition': url.searchParams.get('response-content-disposition') || 'attachment' }).end(file);
    }
    if (url.pathname === '/storage/v1/object/sign/medinsure-installers/staged/legacy.zip') {
      return json(res, 200, { signedURL: '/object/sign/medinsure-installers/staged/legacy.zip?token=fixture' });
    }
    const collection = url.pathname === '/rest/v1/medinsure_releases' ? files :
      url.pathname === '/rest/v1/medinsure_release_policies' ? policies : null;
    if (!collection) return json(res, 404, {});
    if (req.method === 'POST') {
      const row = JSON.parse(await readBody(req));
      if (collection === files && files.some((file) => file.version === row.version || file.id === row.id))
        return json(res, 409, { code: '23505', message: 'Duplicate fixture release' });
      collection.unshift(collection === policies ? { id: policies.length + 1, ...row } : row);
      return res.writeHead(201).end();
    }
    const id = url.searchParams.get('id')?.slice(3);
    let rows = id ? collection.filter((row) => String(row.id) === id) : collection;
    if (url.searchParams.has('limit')) rows = rows.slice(0, Number(url.searchParams.get('limit')));
    return json(res, 200, req.headers.accept === 'application/vnd.pgrst.object+json' ? rows[0] : rows);
  });
  t.after(() => fixture.server.close());

  const zip = process.env.MEDINSURE_TEST_ZIP ? await readFile(process.env.MEDINSURE_TEST_ZIP) : Buffer.alloc(64 * MiB);
  if (!process.env.MEDINSURE_TEST_ZIP) zip.writeUInt32LE(0x04034b50);
  assert.ok(zip.length > 50 * MiB && zip.length <= 100 * MiB);
  const previous = Buffer.from(zip.subarray(0, 256));
  previous[100] = 1;
  const sha = (buffer) => createHash('sha256').update(buffer).digest('hex');
  const port = Number(process.env.MEDINSURE_TEST_PORT || 3049);
  const base = `http://${loopback}:${port}`;
  const cwd = process.env.MEDINSURE_TEST_APP_DIR || process.cwd();
  const child = spawn(process.execPath, [resolve(cwd, 'node_modules/next/dist/bin/next'), 'start', '--hostname', loopback, '--port', String(port)], {
    cwd, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, VERCEL_ENV: '', ADMIN_ACCESS_TOKEN: 'local-admin',
      NEXT_PUBLIC_SUPABASE_URL: fixture.url, SUPABASE_URL: fixture.url, SUPABASE_SERVICE_ROLE_KEY: 'local-service',
      MEDINSURE_R2_ENDPOINT: fixture.url, MEDINSURE_R2_BUCKET: 'test-releases',
      MEDINSURE_R2_ACCESS_KEY_ID: 'local-key', MEDINSURE_R2_SECRET_ACCESS_KEY: 'local-secret',
      MEDINSURE_APPROVED_EXE_HASHES: [sha(zip), sha(previous)].join(','), MEDINSURE_FORCE_UPDATES_APPROVED: '' },
  });
  let output = '';
  child.stdout.on('data', (chunk) => { output += chunk; });
  child.stderr.on('data', (chunk) => { output += chunk; });
  t.after(() => { child.kill(); });
  for (let attempt = 0;; attempt++) {
    try {
      if ((await fetch(base + '/builder', { redirect: 'manual' })).status < 500) break;
    } catch { /* Wait for the isolated Next server. */ }
    if (attempt === 60 || child.exitCode !== null) assert.fail(output);
    await new Promise((done) => setTimeout(done, 250));
  }

  const api = (action, body = {}, auth = headers) => fetch(base + '/api/medinsure/releases',
    { method: 'POST', headers: auth, body: JSON.stringify({ action, ...body }), signal: AbortSignal.timeout(75_000) });
  const download = () => fetch(base + '/api/medinsure/download', { redirect: 'manual' });
  const update = () => fetch(base + '/api/medinsure/update');
  const manifest = () => fetch(base + '/update.json');
  async function prepare(size) {
    const response = await api('prepare', { name: 'MedinSure.zip', size });
    assert.equal(response.status, 200, await response.clone().text());
    return response.json();
  }
  const upload = (draft, body) => fetch(draft.upload.url, { method: 'PUT', headers: draft.upload.headers, body });
  const register = (draft, version) => api('register', { id: draft.id, extension: draft.extension, version, notes: 'fixture' });

  assert.equal((await api('list', {}, { 'content-type': 'application/json' })).status, 401);
  assert.equal((await api('list', {}, { ...headers, 'sec-fetch-site': 'cross-site' })).status, 403);
  assert.equal((await api('prepare', { name: 'big.zip', size: 100 * MiB + 1 })).status, 400);
  const missing = await prepare(64);
  const missingResult = await register(missing, '1.9.9');
  assert.equal(missingResult.status, 404);
  assert.match((await missingResult.json()).error, /다시 업로드/);
  for (const [failure, status, message] of [
    ['denied', 502, /권한을 거부/],
    ['network', 502, /연결 또는 파일 전송/],
    ['timeout', 504, /시간이 초과/],
  ]) {
    const draft = await prepare(64);
    readFailures.set(new URL(draft.upload.url).pathname, failure);
    const response = await register(draft, '1.9.9');
    assert.equal(response.status, status);
    assert.match((await response.json()).error, message);
    assert.equal(files.length, 0);
  }
  const oversized = await prepare(100 * MiB);
  const oversizedPath = new URL(oversized.upload.url).pathname;
  objects.set(oversizedPath, Buffer.alloc(64));
  lengths.set(oversizedPath, 100 * MiB + 1);
  assert.equal((await register(oversized, '1.9.9')).status, 400);
  assert.equal(files.length, 0);
  assert.equal((await fetch(base + '/builder', { redirect: 'manual' })).status, 307);
  assert.equal((await fetch(base)).status, 200);
  assert.equal((await fetch(base + '/builder-login')).status, 200);
  assert.equal((await fetch(base + '/login')).status, 200);
  assert.equal((await fetch(base + '/pay')).status, 200);
  assert.equal((await download()).status, 404);
  assert.equal((await manifest()).status, 404);
  const first = await prepare(previous.length);
  assert.equal((await upload(first, previous)).status, 200);
  assert.equal((await register(first, '2.0.0')).status, 200);
  assert.equal((await api('publish', { id: first.id })).status, 200);
  const second = await prepare(zip.length);
  assert.equal((await upload(second, zip)).status, 200);
  assert.equal((await upload(second, zip)).status, 412);
  assert.equal((await fetch(new URL(second.upload.url).origin + new URL(second.upload.url).pathname)).status, 403);
  assert.equal((await register(second, '2.0.0')).status, 409);
  assert.equal((await register(second, '2.0.1')).status, 200);
  assert.equal(files[0].sha256, sha(zip));
  assert.equal(files[0].size_bytes, zip.length);
  assert.equal((await (await update()).json()).latest_version, '2.0.0');
  assert.equal((await (await manifest()).json()).latest_version, '2.0.0');
  assert.equal((await api('publish', { id: second.id, minimum: '2.0.1' })).status, 403);
  assert.equal((await api('publish', { id: second.id })).status, 200);
  const published = { latest_version: '2.0.1', minimum_version: '0.0.0',
    download_url: 'https://medinsure.co.kr/api/medinsure/download', sha256: sha(zip) };
  assert.deepEqual(await (await update()).json(), published);
  const alias = await manifest();
  assert.equal(alias.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await alias.json(), published);
  const redirected = await download();
  assert.equal(redirected.status, 302);
  const location = new URL(redirected.headers.get('location'));
  assert.equal(location.searchParams.get('X-Amz-Expires'), '60');
  const downloaded = await fetch(location);
  assert.match(downloaded.headers.get('content-disposition'), /MedinSure-2\.0\.1\.zip/);
  assert.equal(sha(Buffer.from(await downloaded.arrayBuffer())), sha(zip));
  assert.equal((await api('publish', { policyId: 1 })).status, 200);
  assert.equal((await (await update()).json()).latest_version, '2.0.0');
  assert.equal((await (await manifest()).json()).sha256, sha(previous));
  assert.equal((await api('publish', { id: null })).status, 200);
  assert.equal((await download()).status, 404);
  assert.equal((await update()).status, 404);
  assert.equal((await manifest()).status, 404);
  files.unshift({ id: 'legacy', version: '1.0.0', object_path: 'staged/legacy.zip' });
  policies.unshift({ id: policies.length + 1, release_id: 'legacy' });
  const legacy = await download();
  assert.equal(legacy.status, 302);
  assert.match(legacy.headers.get('location'), /\/storage\/v1\/object\/sign\/medinsure-installers\/staged\/legacy\.zip/);
});
