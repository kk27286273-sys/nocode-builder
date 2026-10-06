'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 서버 API를 통해 비밀번호를 검증합니다.
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        // 로그인 성공 시 세션 저장을 위해 로컬스토리지 사용 (간이 방식)
        localStorage.setItem('admin_auth', 'true');
      } else {
        setError('비밀번호가 틀렸습니다.');
      }
    } catch (err) {
      setError('인증 서버 오류가 발생했습니다.');
    }
  };

  // 로그인 화면
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">TH소프트 관리자 로그인</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              type="submit" 
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 로그인 성공 후 보여줄 어드민 메인 화면
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">관리자 대시보드</h1>
        <button 
          onClick={() => {
            localStorage.removeItem('admin_auth');
            setIsAuthenticated(false);
          }}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          로그아웃
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 여기에 기존에 만드셨던 어드민 기능(사이트 관리, 문의 확인 등)을 넣으시면 됩니다 */}
        <div className="p-6 bg-white shadow rounded-xl border">사이트 관리</div>
        <div className="p-6 bg-white shadow rounded-xl border">문의 내역</div>
        <div className="p-6 bg-white shadow rounded-xl border">시스템 설정</div>
      </div>
    </div>
  );
}