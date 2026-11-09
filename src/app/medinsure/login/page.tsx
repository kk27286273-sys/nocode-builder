'use client';

import { useState, type FormEvent } from 'react';
import { getMedinsureAuthClient } from '@/lib/supabase/medinsure';

export default function MedinsureLogin() {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function checkAccess(token: string) {
    const response = await fetch('/api/medinsure/entitlement', {
      headers: { Authorization: 'Bearer ' + token },
      cache: 'no-store',
      redirect: 'error',
    });
    const result = await response.json();
    if (!response.ok || typeof result.allowed !== 'boolean') {
      setMessage('로그인했습니다. 분석 권한을 확인할 수 없습니다.');
      return;
    }
    setMessage(result.allowed ? '로그인했습니다. MedinSure 분석 이용이 허용됩니다.' : '로그인했습니다. MedinSure 분석 이용이 제한된 계정입니다.');
  }

  async function recheck() {
    setBusy(true);
    setMessage('');
    try {
      const { data, error } = await getMedinsureAuthClient().auth.getSession();
      if (error || !data.session) {
        setMessage('다시 로그인해 주세요.');
        return;
      }
      await checkAccess(data.session.access_token);
    } catch {
      setMessage('분석 권한을 확인하지 못했습니다. 다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const email = String(fields.get('email') ?? '').trim();
    const password = String(fields.get('password') ?? '');
    setBusy(true);
    setMessage('');
    try {
      const { data, error } = await getMedinsureAuthClient().auth.signInWithPassword({ email, password });
      if (error || !data.session) {
        setMessage('로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.');
        return;
      }
      form.reset();
      await checkAccess(data.session.access_token);
    } catch {
      setMessage('로그인 또는 분석 권한을 확인하지 못했습니다. 다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-20">
      <form onSubmit={signIn} className="mx-auto grid max-w-md gap-4 rounded-xl border bg-white p-8">
        <h1 className="text-xl font-bold">MedinSure 회원 로그인</h1>
        <p className="text-sm text-gray-600">기존 MedinSure 프로그램 계정으로 로그인하세요.</p>
        <label className="grid gap-1 text-sm">이메일
          <input name="email" type="email" autoComplete="username" required className="rounded border p-2" />
        </label>
        <label className="grid gap-1 text-sm">비밀번호
          <input name="password" type="password" autoComplete="current-password" required className="rounded border p-2" />
        </label>
        <button disabled={busy} type="submit" className="rounded bg-blue-700 p-2 text-white">
          {busy ? '확인 중...' : '로그인'}
        </button>
        <button disabled={busy} type="button" onClick={recheck} className="rounded border p-2 text-sm">
          분석 권한 다시 확인
        </button>
        <p role="status" className="text-sm">{message}</p>
      </form>
    </main>
  );
}
