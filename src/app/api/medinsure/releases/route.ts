import { createHash, randomUUID } from 'node:crypto';
import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { compareVersions, releaseBucket, validVersion } from '@/lib/medinsure/releases';

const limit = 50 * 1024 * 1024;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  const error = (message: string, status = 400) => Response.json({ error: message }, { status });
  const token = process.env.ADMIN_ACCESS_TOKEN;
  if (!token || request.cookies.get('nexia_admin_session')?.value !== token) return error('빌더 관리자 로그인이 필요합니다.', 401);
  if (request.headers.get('sec-fetch-site') === 'cross-site') return error('잘못된 요청입니다.', 403);
  if (process.env.VERCEL_ENV === 'preview') return error('설치 파일 저장소가 설정되지 않았습니다.', 503);
  const body = await request.json().catch(() => null);

  try {
    const db = createAdminClient();
    const storage = db.storage.from(releaseBucket);
    switch (body?.action) {
      case 'list': {
        const { data: releases, error: listError } = await db.from('medinsure_releases')
          .select('id, version, notes, size_bytes, sha256, created_at, object_path').order('created_at', { ascending: false }).limit(100);
        const { data: policies, error: channelError } = await db.from('medinsure_release_policies').select('id,release_id,minimum_version,created_at').order('id', { ascending: false }).limit(100);
        if (listError || channelError) throw listError || channelError;
        return Response.json({ releases, policies, current: policies?.[0]?.release_id || null });
      }
      case 'prepare': {
        const extension = typeof body.name === 'string' ? body.name.match(/\.(exe|zip)$/i)?.[1].toLowerCase() : null;
        if (!extension ||
          !Number.isSafeInteger(body.size) || body.size < 64 || body.size > limit) return error('50MB 이하의 EXE 또는 ZIP 파일을 선택해 주세요.');
        const id = randomUUID();
        const { data, error: uploadError } = await storage.createSignedUploadUrl(`staged/${id}.${extension}`, { upsert: false });
        if (uploadError) throw uploadError;
        return Response.json({ id, path: data.path, token: data.token });
      }
      case 'register': {
        if (typeof body.id !== 'string' || !uuid.test(body.id) ||
          !['exe', 'zip'].includes(body.extension) || !validVersion(body.version) ||
          typeof body.notes !== 'string' || body.notes.length > 3000) return error('버전과 설명을 확인해 주세요.');
        const path = `staged/${body.id}.${body.extension}`;
        const { data, error: urlError } = await storage.createSignedUrl(path, 60);
        if (urlError) throw urlError;
        const file = await fetch(data.signedUrl, { cache: 'no-store' });
        const size = Number(file.headers.get('content-length'));
        if (!file.ok || !file.body || !Number.isSafeInteger(size) || size < 64 || size > limit) return error('업로드 파일 크기를 확인할 수 없습니다.');
        const reader = file.body.getReader();
        const hash = createHash('sha256');
        const prefix = Buffer.alloc(Math.min(size, 1024 * 1024));
        let received = 0;
        try {
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            if (received + value.length > size) return error('파일 크기가 일치하지 않습니다.');
            if (received < prefix.length) Buffer.from(value).copy(prefix, received, 0, prefix.length - received);
            received += value.length;
            hash.update(value);
          }
        } finally { await reader.cancel(); }
        const pe = prefix.readUInt32LE(60);
        const peValid = prefix.toString('ascii', 0, 2) === 'MZ' && pe >= 64 && pe + 4 <= prefix.length && prefix.readUInt32LE(pe) === 0x4550;
        const zipValid = prefix.readUInt32LE(0) === 0x04034b50;
        if (received !== size || (body.extension === 'zip' ? !zipValid : !peValid)) return error('파일 형식이 올바르지 않습니다.');
        const { error: insertError } = await db.from('medinsure_releases').insert({
          id: body.id, version: body.version, notes: body.notes, object_path: path, size_bytes: size, sha256: hash.digest('hex'),
        });
        if (insertError?.code === '23505') return error('이미 등록된 버전 또는 파일입니다.', 409);
        if (insertError) throw insertError;
        return Response.json({ registered: true });
      }
      case 'publish': {
        let id = body.id;
        let minimum = body.minimum ?? null;
        if (Number.isSafeInteger(body.policyId)) {
          const { data, error: historyError } = await db.from('medinsure_release_policies').select('release_id,minimum_version').eq('id', body.policyId).single();
          if (historyError) throw historyError;
          id = data.release_id; minimum = data.minimum_version;
        }
        if (id !== null) {
          if (typeof id !== 'string' || !uuid.test(id)) return error('버전을 선택해 주세요.');
          const { data, error: lookupError } = await db.from('medinsure_releases').select('sha256,version').eq('id', id).single();
          if (lookupError) throw lookupError;
          if (minimum !== null && (!validVersion(minimum) || compareVersions(minimum, data.version) > 0)) return error('최소 허용 버전을 확인해 주세요.');
          if (minimum !== null && process.env.MEDINSURE_FORCE_UPDATES_APPROVED !== 'true') return error('강제 업데이트 운영 승인이 필요합니다.', 403);
          const approved = (process.env.MEDINSURE_APPROVED_EXE_HASHES || '').split(',').map((value) => value.trim().toLowerCase());
          if (!approved.includes(data.sha256)) return error('서명·악성코드 검사 후 승인된 파일만 공개할 수 있습니다.', 409);
        }
        const { error: publishError } = await db.from('medinsure_release_policies').insert({ release_id: id, minimum_version: id === null ? null : minimum });
        if (publishError) throw publishError;
        return Response.json({ updated: true });
      }
      default: return error('요청을 확인해 주세요.');
    }
  } catch {
    return error('설치 파일 처리에 실패했습니다. 저장소와 데이터베이스 설정을 확인해 주세요.', 503);
  }
}
