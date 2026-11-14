import { createHash, randomUUID } from 'node:crypto';
import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { approvedArtifact, compareVersions, noReleaseCache, releaseIdPattern, validVersion } from '@/lib/medinsure/releases';
import { createReleaseDownload, createReleaseUpload, r2ReleaseKey, readReleaseObject } from '@/lib/medinsure/r2';
import { releaseUploadLimit as limit } from '@/lib/medinsure/release-upload';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const error = (message: string, status = 400) => Response.json({ error: message }, { status });
  const token = process.env.ADMIN_ACCESS_TOKEN;
  if (!token || request.cookies.get('nexia_admin_session')?.value !== token) return error('빌더 관리자 로그인이 필요합니다.', 401);
  if (request.headers.get('sec-fetch-site') === 'cross-site') return error('잘못된 요청입니다.', 403);
  if (process.env.VERCEL_ENV === 'preview') return error('설치 파일 저장소가 설정되지 않았습니다.', 503);
  const body = await request.json().catch(() => null);

  try {
    const db = createAdminClient();
    switch (body?.action) {
      case 'list': {
        const { data: releases, error: listError } = await db.from('medinsure_releases')
          .select('id, version, notes, size_bytes, sha256, created_at, object_path, artifact_kind').order('created_at', { ascending: false }).limit(100);
        const { data: policies, error: channelError } = await db.from('medinsure_release_policies').select('id,release_id,setup_release_id,minimum_version,created_at').order('id', { ascending: false }).limit(100);
        if (listError || channelError) throw listError || channelError;
        return Response.json({ releases, policies, current: policies?.[0]?.release_id || null }, { headers: noReleaseCache });
      }
      case 'prepare': {
        const extension = typeof body.name === 'string' ? body.name.match(/\.(exe|zip)$/i)?.[1].toLowerCase() : null;
        if (!extension ||
          !Number.isSafeInteger(body.size) || body.size < 64 || body.size > limit) return error('256MiB 이하의 EXE 또는 ZIP 파일을 선택해 주세요.');
        const id = randomUUID();
        const upload = await createReleaseUpload(r2ReleaseKey(id, extension), body.size);
        return Response.json({ id, extension, upload }, { headers: { 'Cache-Control': 'no-store' } });
      }
      case 'register': {
        if (typeof body.id !== 'string' || !releaseIdPattern.test(body.id) ||
          !['exe', 'zip'].includes(body.extension) || !validVersion(body.version) ||
          typeof body.notes !== 'string' || body.notes.length > 3000) return error('버전과 설명을 확인해 주세요.');
        const kind = body.extension === 'exe' ? 'setup' : 'update';
        const path = r2ReleaseKey(body.id, body.extension);
        const transfer = new AbortController();
        let timeout = setTimeout(() => transfer.abort(), 10_000);
        const hash = createHash('sha256');
        let size: number;
        let received = 0;
        try {
          const file = await readReleaseObject(path, transfer.signal);
          if (file.status === 404) return error('업로드된 파일이 없습니다. 파일을 다시 업로드해 주세요.', 404);
          if (file.status === 403 || file.status === 401) return error('저장소에서 파일 읽기 권한을 거부했습니다. 관리자에게 문의해 주세요.', 502);
          if (!file.ok) return error('저장소에서 파일을 조회하지 못했습니다.', 502);

          size = Number(file.headers.get('content-length'));
          if (!file.body || !Number.isSafeInteger(size) || size < 64 || size > limit)
            return error('업로드 파일 크기를 확인할 수 없습니다.');

          clearTimeout(timeout);
          timeout = setTimeout(() => transfer.abort(), 45_000);
          const reader = file.body.getReader();
          const prefix = Buffer.alloc(Math.min(size, 1024 * 1024));
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            if (received + value.length > size) return error('파일 크기가 일치하지 않습니다.');
            if (received < prefix.length) Buffer.from(value).copy(prefix, received, 0, prefix.length - received);
            received += value.length;
            hash.update(value);
          }
          if (received !== size) return error('파일 크기가 일치하지 않습니다.');
          const pe = prefix.readUInt32LE(60);
          const peValid = prefix.toString('ascii', 0, 2) === 'MZ' && pe >= 64 && pe + 4 <= prefix.length && prefix.readUInt32LE(pe) === 0x4550;
          const zipValid = prefix.readUInt32LE(0) === 0x04034b50;
          if (body.extension === 'zip' ? !zipValid : !peValid) return error('파일 형식이 올바르지 않습니다.');
        } catch {
          if (transfer.signal.aborted) return error('저장소 파일 조회 시간이 초과되었습니다. 다시 시도해 주세요.', 504);
          return error('저장소 연결 또는 파일 전송에 실패했습니다. 다시 시도해 주세요.', 502);
        } finally {
          clearTimeout(timeout);
          // Do not await cancellation of a response stream that Next may have cloned.
          transfer.abort();
        }
        const digest = hash.digest('hex');
        if (!approvedArtifact(body.version, kind, digest)) {
          return error('빌드 검증 목록에 있는 파일 유형·버전·SHA-256과 일치하지 않습니다.', 409);
        }
        const { error: insertError } = await db.from('medinsure_releases').insert({
          id: body.id, version: body.version, notes: body.notes, object_path: path, size_bytes: size, sha256: digest, artifact_kind: kind,
        });
        if (insertError?.code === '23505') return error('이미 등록된 버전 또는 파일입니다.', 409);
        if (insertError) throw insertError;
        return Response.json({ registered: true });
      }
      case 'verify-download': {
        // Administrator-only verification of staged artifacts before any public policy changes.
        if (typeof body.id !== 'string' || !releaseIdPattern.test(body.id)) return error('등록된 파일을 선택해 주세요.');
        const { data: file, error: lookupError } = await db.from('medinsure_releases')
          .select('version,artifact_kind,object_path,sha256').eq('id', body.id).single();
        if (lookupError) throw lookupError;
        if (!file || !['setup', 'update'].includes(file.artifact_kind) ||
            !approvedArtifact(file.version, file.artifact_kind, file.sha256)) return error('검증된 파일이 아닙니다.', 409);
        const extension = file.artifact_kind === 'setup' ? 'exe' : 'zip';
        const url = await createReleaseDownload(file.object_path, `MedinSure-${file.version}.${extension}`);
        return Response.json({ url, sha256: file.sha256 }, { headers: noReleaseCache });
      }
      case 'publish': {
        let updateId = body.id;
        let setupId = body.setupId ?? null;
        let minimum = body.minimum ?? null;
        if (Number.isSafeInteger(body.policyId)) {
          const { data, error: historyError } = await db.from('medinsure_release_policies')
            .select('release_id,setup_release_id,minimum_version').eq('id', body.policyId).single();
          if (historyError) throw historyError;
          updateId = data.release_id;
          setupId = data.setup_release_id;
          minimum = data.minimum_version;
        }
        if (updateId !== null || setupId !== null) {
          if (typeof updateId !== 'string' || !releaseIdPattern.test(updateId) || typeof setupId !== 'string' || !releaseIdPattern.test(setupId)) {
            return error('검증된 설치 파일과 업데이트 ZIP을 모두 선택해 주세요.', 409);
          }
          const { data, error: lookupError } = await db.from('medinsure_releases')
            .select('id,sha256,version,artifact_kind,object_path,size_bytes').in('id', [updateId, setupId]);
          if (lookupError) throw lookupError;
          const update = data.find((file) => file.id === updateId && file.artifact_kind === 'update');
          const setup = data.find((file) => file.id === setupId && file.artifact_kind === 'setup');
          if (!update || !setup || update.version !== setup.version ||
            !approvedArtifact(update.version, 'update', update.sha256) ||
            !approvedArtifact(setup.version, 'setup', setup.sha256)) {
            return error('동일 버전의 두 파일이 모두 빌드 검증을 통과해야 합니다.', 409);
          }
          if (minimum !== null && (!validVersion(minimum) || compareVersions(minimum, update.version) > 0)) return error('최소 허용 버전을 확인해 주세요.');
          if (minimum !== null && process.env.MEDINSURE_FORCE_UPDATES_APPROVED !== 'true') return error('강제 업데이트 운영 승인이 필요합니다.', 403);
          const available = await Promise.all([update, setup].map(async (file) => {
            const object = await readReleaseObject(file.object_path, AbortSignal.timeout(10_000), 'HEAD');
            return object.ok && Number(object.headers.get('content-length')) === file.size_bytes;
          }));
          if (!available.every(Boolean)) return error('저장소에서 등록된 두 파일을 확인할 수 없습니다.', 409);
        }
        const { error: publishError } = await db.from('medinsure_release_policies').insert({
          release_id: updateId, setup_release_id: setupId, minimum_version: updateId === null ? null : minimum,
        });
        if (publishError) throw publishError;
        return Response.json({ updated: true }, { headers: noReleaseCache });
      }
      default: return error('요청을 확인해 주세요.');
    }
  } catch {
    return error('설치 파일 처리에 실패했습니다. 저장소와 데이터베이스 설정을 확인해 주세요.', 503);
  }
}
