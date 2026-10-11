'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function FailContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const message = searchParams.get('message');

  return (
    <>
      <h1 className="mb-2 text-2xl font-bold text-rose-600">
        결제에 실패했습니다
      </h1>
      <p className="mb-8 text-slate-500">
        {message || '결제가 정상적으로 처리되지 않았습니다.'}
      </p>

      {code && (
        <div className="mb-8 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
          오류 코드: {code}
        </div>
      )}

      <div className="flex gap-3">
        <Link
          href="/pay"
          className="flex-1 rounded-xl bg-black py-3 font-bold text-white"
        >
          다시 시도
        </Link>
        <Link
          href="/"
          className="flex-1 rounded-xl border border-slate-300 py-3 font-bold text-slate-700"
        >
          홈으로
        </Link>
      </div>
    </>
  );
}

export default function CheckoutFailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <Suspense fallback={<p className="text-slate-500">불러오는 중...</p>}>
          <FailContent />
        </Suspense>
      </div>
    </div>
  );
}
