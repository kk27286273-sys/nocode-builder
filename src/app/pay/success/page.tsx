'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SuccessPage({ searchParams }: { searchParams: { paymentKey: string; orderId: string; amount: string } }) {
  const [status, setStatus] = useState('processing'); // processing | success | fail
  const router = useRouter();

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const response = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentKey: searchParams.paymentKey,
            orderId: searchParams.orderId,
            amount: searchParams.amount,
          }),
        });

        if (response.ok) setStatus('success');
        else setStatus('fail');
      } catch (e) {
        setStatus('fail');
      }
    };
    confirmPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center border border-slate-200">
        {status === 'processing' && (
          <div className="space-y-4">
            <div className="animate-spin w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full mx-auto"></div>
            <p className="text-slate-600 font-medium">결제 승인 처리 중입니다...</p>
          </div>
        )}
        {status === 'success' && (
          <div className="space-y-6">
            <div className="text-5xl">✅</div>
            <h1 className="text-2xl font-extrabold text-slate-900">결제가 완료되었습니다!</h1>
            <p className="text-slate-500">이제 모든 기능을 이용하실 수 있습니다.</p>
            <button onClick={() => router.push('/')} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl">홈으로 돌아가기</button>
          </div>
        )}
        {status === 'fail' && (
          <div className="space-y-6">
            <div className="text-5xl">❌</div>
            <h1 className="text-2xl font-extrabold text-slate-900">결제 승인 실패</h1>
            <p className="text-slate-500">결제 처리 중 오류가 발생했습니다. 고객센터로 문의해주세요.</p>
            <button onClick={() => router.push('/checkout')} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl">다시 결제하기</button>
          </div>
        )}
      </div>
    </div>
  );
}