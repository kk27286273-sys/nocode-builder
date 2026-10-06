'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('가입 확인 이메일이 발송되었습니다. 메일함을 확인하세요.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setMessage(err.message || '인증 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
          {isSignUp ? '기업 회원가입' : 'B2B 웹 빌더 로그인'}
        </h2>
        <p className="text-xs text-center text-gray-500 mb-6">
          사이트 제작 및 리드 관리를 위한 계정입니다.
        </p>

        {message && (
          <div className="p-3 mb-4 text-xs rounded bg-blue-50 text-blue-700 border border-blue-200">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">이메일</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm border-gray-300 focus:outline-none focus:border-blue-600"
              placeholder="admin@company.com"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">비밀번호</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm border-gray-300 focus:outline-none focus:border-blue-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
          >
            {loading ? '처리 중...' : isSignUp ? '회원가입' : '로그인'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-blue-600 hover:underline"
          >
            {isSignUp ? '이미 계정이 있으신가요? 로그인' : '새 계정이 필요하신가요? 회원가입'}
          </button>
        </div>
      </div>
    </div>
  );
}