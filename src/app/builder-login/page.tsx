'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BuilderLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || '로그인에 실패했습니다.');
        return;
      }

      router.push('/builder');
      router.refresh();
    } catch {
      setMessage('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl bg-white p-8 shadow"
      >
        <h1 className="mb-2 text-xl font-bold text-gray-900">
          Nexia 빌더 관리자
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          관리자 비밀번호를 입력하세요.
        </p>

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="관리자 비밀번호"
          required
          className="mb-3 w-full rounded-lg border p-3"
        />

        {message && (
          <p className="mb-3 rounded bg-red-50 p-3 text-sm text-red-600">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:opacity-50"
        >
{loading ? '확인 중...' : '빌더 입장'}
        </button>
      </form>
    </main>
  );
}