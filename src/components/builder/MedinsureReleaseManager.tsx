'use client';

import { useRef, useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase/client';

type Release = { id: string; version: string; size_bytes: number; sha256: string; notes: string; created_at: string };

export default function MedinsureReleaseManager() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

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
      const { id, token } = await request('prepare', { name: file.name, size: file.size });
      const { error } = await supabase.storage.from('medinsure-installers')
        .uploadToSignedUrl(`staged/${id}.exe`, token, file, { contentType: 'application/octet-stream', upsert: false });
      if (error) throw error;
      await request('register', { id, version: form.get('version'), notes: form.get('notes') });
      await refresh();
      setMessage('비공개 버전으로 등록했습니다.');
    });
  }

  function publish(id: string | null) {
    if (!window.confirm(id ? '이 버전을 공개 다운로드 대상으로 바꿀까요?' : '현재 다운로드를 비공개로 전환할까요?')) return;
    void perform(async () => { await request('publish', { id }); await refresh(); setMessage('공개 상태를 변경했습니다.'); });
  }

  return <>
    <button type="button" className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-bold text-blue-800"
      onClick={() => { dialog.current?.showModal(); void perform(refresh); }}>EXE 관리</button>
    <dialog ref={dialog} aria-labelledby="release-manager-title" className="m-auto max-h-[85vh] w-[min(94vw,42rem)] overflow-auto rounded-xl bg-white p-6 text-slate-900 backdrop:bg-black/50">
      <div className="flex justify-between gap-3"><h2 id="release-manager-title" className="text-xl font-bold">MedinSure EXE 관리</h2>
        <button type="button" onClick={() => dialog.current?.close()} className="rounded border px-3 py-1">닫기</button></div>
      <form onSubmit={upload} className="my-4 space-y-3">
        <label className="block text-sm">EXE 파일<input className="mt-1 block w-full" type="file" accept=".exe" name="file" required /></label>
        <label className="block text-sm">버전<input className="mt-1 block rounded border p-2" name="version" placeholder="2.1.0" required pattern="[0-9]+\.[0-9]+\.[0-9]+" /></label>
        <label className="block text-sm">업데이트 설명<textarea className="mt-1 block w-full rounded border p-2" name="notes" maxLength={3000} /></label>
        <button disabled={busy} className="rounded bg-blue-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">업로드 및 등록</button>
      </form>
      {message && <p role="status" className="my-3 rounded bg-slate-100 p-3 text-sm">{message}</p>}
      <a className="text-sm text-blue-800 underline" href="/medinsure/download" target="_blank" rel="noreferrer">공개 다운로드 화면</a>
      <ul className="mt-3 divide-y">{releases.map((release) => <li key={release.id} className="space-y-1 py-3 text-sm">
        <p className="font-bold">{release.version} · {current === release.id ? '공개' : '비공개'} · {(release.size_bytes / 1048576).toFixed(1)} MB</p>
        <p>{new Date(release.created_at).toLocaleString('ko-KR')}</p>
        <p className="break-all font-mono text-xs">SHA-256 {release.sha256}</p>
        <p className="whitespace-pre-wrap">{release.notes}</p>
        <button type="button" className="rounded border px-3 py-1" disabled={busy} onClick={() => publish(current === release.id ? null : release.id)}>
          {current === release.id ? '비공개로 전환' : '이 버전 공개'}</button>
      </li>)}</ul>
    </dialog>
  </>;
}
