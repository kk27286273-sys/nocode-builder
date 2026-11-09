import { timingSafeEqual } from 'node:crypto';
import { NextRequest } from 'next/server';
import { verifyReleaseStorageProbe } from '@/lib/medinsure/r2';

const headers = { 'Cache-Control': 'private, no-store' };

function accessDenied(request: NextRequest) {
  if (process.env.VERCEL_ENV !== 'production' || process.env.MEDINSURE_R2_DIAGNOSTIC_ENABLED !== 'true') {
    return Response.json({ error: 'not_found' }, { status: 404, headers });
  }
  const expected = Buffer.from(process.env.ADMIN_ACCESS_TOKEN ?? '');
  const actual = Buffer.from(request.cookies.get('nexia_admin_session')?.value ?? '');
  if (!expected.length || expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return Response.json({ error: 'unauthorized' }, { status: 401, headers });
  }
}

export function GET(request: NextRequest) {
  const denied = accessDenied(request);
  if (denied) return denied;
  return new Response('<!doctype html><html lang="ko"><meta charset="utf-8"><title>R2 읽기 진단</title><form method="post"><button type="submit">R2 읽기 진단 실행</button></form></html>', {
    headers: {
      ...headers,
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': "default-src 'none'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
    },
  });
}

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const denied = accessDenied(request);
  if (denied) return denied;
  if (request.headers.get('origin') !== new URL(request.url).origin ||
      request.headers.get('sec-fetch-site') !== 'same-origin') {
    return Response.json({ error: 'forbidden' }, { status: 403, headers });
  }
  try {
    const result = await verifyReleaseStorageProbe(process.env.ADMIN_ACCESS_TOKEN!);
    const verified = result.uploaded && result.unsignedDenied && result.contentMatches && result.removed;
    return Response.json(result, { status: verified ? 200 : 503, headers });
  } catch {
    return Response.json({ error: 'diagnostic_failed' }, { status: 503, headers });
  }
}
