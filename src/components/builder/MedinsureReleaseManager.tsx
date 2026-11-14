'use client';

import { useRef, useState, type FormEvent } from 'react';
import { releaseUploadLimit } from '@/lib/medinsure/release-upload';

type Release = { artifact_kind: 'legacy' | 'setup' | 'update'; id: string; version: string; size_bytes: number; sha256: string; notes: string; created_at: string };
type Policy = { id: number; release_id: string | null; setup_release_id: string | null; minimum_version: string | null; created_at: string };

export default function MedinsureReleaseManager() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [forced, setForced] = useState(false);
  const [minimum, setMinimum] = useState('');

  async function request(action: string, fields: Record<string, unknown> = {}) {
    const response = await fetch('/api/medinsure/releases', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...fields }),
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error);
    return body;
  }

  async function refresh() {
    const result = await request('list');
    setReleases(result.releases);
    setCurrent(result.current);
    setPolicies(result.policies);
  }

  async function perform(task: () => Promise<void>) {
    setBusy(true); setMessage('');
    try { await task(); }
    catch (error) { setMessage(error instanceof Error ? error.message : '처리하지 못했습니다.'); }
    finally { setBusy(false); }
  }

  function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get('file');
    if (!(file instanceof File)) return;
    void perform(async () => {
      if (file.size > releaseUploadLimit) throw new Error('256MiB 이하의 EXE 또는 ZIP 파일을 선택해 주세요.');
      const { id, extension, upload } = await request('prepare', { name: file.name, size: file.size });
      const response = await fetch(upload.url, { method: 'PUT', headers: upload.headers, body: file, redirect: 'error' });
      if (!response.ok) throw new Error('파일 업로드에 실패했습니다. 다시 시도해 주세요.');
      await request('register', { id, extension, version: form.get('version'), notes: form.get('notes') });
      await refresh();
      setMessage('비공개 버전으로 등록했습니다.');
    });
  }

  function publish(id: string | null, setupId: string | null = null) {
    if (id && forced && !minimum.trim()) { setMessage('최소 허용 버전을 입력해 주세요.'); return; }
    if (!window.confirm(id ? (forced ? '강제 업데이트 정책으로 공개할까요?' : '일반 업데이트로 공개할까요?') : '현재 다운로드를 비공개로 전환할까요?')) return;
    void perform(async () => { await request('publish', { id, setupId, minimum: id && forced ? minimum : null }); await refresh(); setMessage('공개 상태를 변경했습니다.'); });
  }

  return <>
    <button type="button" className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-bold text-blue-800"
      onClick={() => { dialog.current?.showModal(); void perform(refresh); }}>EXE 관리</button>
    <dialog ref={dialog} aria-labelledby="release-manager-title" className="m-auto max-h-[85vh] w-[min(94vw,42rem)] overflow-auto rounded-xl bg-white p-6 text-slate-900 backdrop:bg-black/50">
      <div className="flex justify-between gap-3"><h2 id="release-manager-title" className="text-xl font-bold">MedinSure 배포 관리</h2>
        <button type="button" onClick={() => dialog.current?.close()} className="rounded border px-3 py-1">닫기</button></div>
      <form onSubmit={upload} className="my-4 space-y-3">
        <label className="block text-sm">신규 설치용 Setup.exe 또는 고객 업데이트 ZIP (256MiB 이하)<input className="mt-1 block w-full" type="file" accept=".exe,.zip" name="file" required /></label>
        <label className="block text-sm">버전<input className="mt-1 block rounded border p-2" name="version" placeholder="2.1.0" required pattern="[0-9]+\.[0-9]+\.[0-9]+" /></label>
        <label className="block text-sm">업데이트 설명<textarea className="mt-1 block w-full rounded border p-2" name="notes" maxLength={3000} /></label>
        <button disabled={busy} className="rounded bg-blue-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">업로드 및 등록</button>
      </form>
      {message && <p role="status" className="my-3 rounded bg-slate-100 p-3 text-sm">{message}</p>}
      <a className="text-sm text-blue-800 underline" href="/medinsure/download" target="_blank" rel="noreferrer">공개 다운로드 화면</a>
      <button type="button" className="ml-3 rounded border px-2 py-1 text-sm" onClick={() =>
        void perform(async () => { await navigator.clipboard.writeText('https://medinsure.co.kr/api/medinsure/setup'); setMessage('공개 다운로드 주소를 복사했습니다.'); })}>다운로드 주소 복사</button>
      <div className="mt-3 flex flex-wrap items-center gap-3 rounded border p-2 text-sm">
        <label>배포 방식 <select value={forced ? 'forced' : 'normal'} onChange={(event) => setForced(event.target.value === 'forced')}><option value="normal">일반 업데이트</option><option value="forced">강제 업데이트</option></select></label>
        {forced && <label>최소 허용 버전 <input className="w-24 rounded border" value={minimum} onChange={(event) => setMinimum(event.target.value)} placeholder="2.1.0" /></label>}
        {policies[0]?.minimum_version && <span>현재 최소 허용 버전 {policies[0].minimum_version}</span>}
      </div>
      <ul className="mt-3 divide-y">{[...new Set(releases.map((file) => file.version))].map((version) => {
        const files = releases.filter((file) => file.version === version);
        const setup = files.find((file) => file.artifact_kind === 'setup');
        const update = files.find((file) => file.artifact_kind === 'update');
        const published = !!setup && !!update && policies[0]?.setup_release_id === setup.id && current === update.id;
        return <li key={version} className="space-y-2 py-3 text-sm">
          <p className="font-bold">{version} · {published ? '공개' : setup && update ? '공개 승인 대기' : '파일 준비 필요'}</p>
          {!setup && <p>신규 설치용 Setup.exe · 미등록</p>}
          {!update && <p>기존 고객용 업데이트 ZIP · 미등록</p>}
          {files.map((file) => <section key={file.id}>
            <p>{file.artifact_kind === 'setup' ? '신규 설치용 Setup.exe' : file.artifact_kind === 'update' ? '기존 고객용 업데이트 ZIP' : '이전 방식으로 등록된 파일'}
              {' · '}{file.version} · {file.artifact_kind === 'legacy' ? '쌍 검증 대상 아님' : '빌드 버전·SHA-256 검증 완료'}
              {file.id === current || file.id === policies[0]?.setup_release_id ? ' · 현재 공개' : ' · 현재 공개본 아님'}</p>
            <p className="break-all font-mono text-xs">SHA-256 {file.sha256}</p>
            <p className="whitespace-pre-wrap">{file.notes}</p>
          </section>)}
          {setup && update && <button type="button" className="rounded border px-3 py-1" disabled={busy}
            onClick={() => publish(update.id, setup.id)}>{published ? '현재 버전 정책 변경' : '두 파일 공개 승인'}</button>}
          {published && <button type="button" className="ml-2 rounded border px-3 py-1" disabled={busy}
            onClick={() => publish(null)}>두 파일 비공개 전환</button>}
        </li>;
      })}</ul>
      {policies.length > 1 && <details className="mt-4 text-sm"><summary>배포 정책 이력</summary><ul>
        {policies.slice(1).map((policy) => <li key={policy.id} className="my-2 flex flex-wrap items-center gap-2">
          <span>{new Date(policy.created_at).toLocaleString('ko-KR')} · {policy.release_id ? releases.find((release) => release.id === policy.release_id)?.version || '이전 버전' : '비공개'} · {policy.minimum_version ? `최소 ${policy.minimum_version}` : '일반'}</span>
          <button type="button" className="rounded border px-2 py-1" disabled={busy || (!!policy.release_id && !policy.setup_release_id)} onClick={() => {
            if (window.confirm('선택한 이전 배포 정책으로 복구할까요?'))
              void perform(async () => { await request('publish', { policyId: policy.id }); await refresh(); setMessage('이전 배포 정책으로 복구했습니다.'); });
          }}>정책 복구</button>
        </li>)}
      </ul></details>}
    </dialog>
  </>;
}
