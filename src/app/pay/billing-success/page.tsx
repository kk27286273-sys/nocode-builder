'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function Content() {
  const sp = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const customerKey = sp.get('customerKey');
  const authKey = sp.get('authKey');
  const orderIdParam = sp.get('orderId');

  useEffect(() => {
    setOrderId(orderIdParam);

    if (!customerKey || !authKey || !orderIdParam) {
      setStatus('error');
      setMessage('결제 정보가 올바르지 않습니다.');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/billing/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerKey, authKey, orderId: orderIdParam }),
        });

        const result = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setStatus('error');
          setMessage(result.message || '결제 승인에 실패했습니다.');
          return;
        }

        setAmount(result.amount);
        setStatus('done');
      } catch (e) {
        if (!cancelled) {
          setStatus('error');
          setMessage('결제 승인 요청 중 오류가 발생했습니다.');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [customerKey, authKey, orderIdParam]);

  if (status === 'loading') {
    return <p className="text-slate-500">결제를 승인하는 중입니다...</p>;
  }

  if (status === 'error') {
    return (
      <>
        <h1 className="mb-2 text-2xl font-bold text-rose-600">결제 승인 실패</h1>
        <p className="mb-8 text-slate-500">{message}</p>
        <Link
          href="/pay"
          className="inline-block rounded-xl bg-black px-6 py-3 font-bold text-white"
        >
          다시 시도하기
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="mb-2 text-2xl font-bold">결제가 완료되었습니다</h1>
      <p className="mb-8 text-slate-500">담당자가 곧 연락드립니다.</p>
      <div className="mb-8 rounded-2xl bg-slate-100 p-6 text-left text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">주문번호</span>
          <span className="font-semibold">{orderId}</span>
        </div>
        <div className="mt-2 flex justify-between">
          <span className="text-slate-600">결제 금액</span>
          <span className="font-semibold">{amount?.toLocaleString()}원</span>
        </div>
      </div>
      <Link
        href="/"
        className="inline-block rounded-xl bg-black px-6 py-3 font-bold text-white"
      >
        홈으로 돌아가기
      </Link>
    </>
  );
}

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <Suspense fallback={<p className="text-slate-500">불러오는 중...</p>}>
          <Content />
        </Suspense>
      </div>
    </div>
  );
}