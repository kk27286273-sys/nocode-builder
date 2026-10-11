'use client';

import React, { useCallback, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getPlan } from '@/lib/plans';

const SDK_URL = 'https://js.tosspayments.com/v2/standard';

function loadTossSdk(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (window.TossPayments) {
      resolve(window.TossPayments);
      return;
    }

    const existing = document.querySelector(`script[src="${SDK_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => {
        resolve(window.TossPayments);
      });
      existing.addEventListener('error', () => reject(new Error('SDK 로드 실패')));
      return;
    }

    const script = document.createElement('script');
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => {
      resolve(window.TossPayments);
    };
    script.onerror = () => reject(new Error('SDK 로드 실패'));
    document.body.appendChild(script);
  });
}

function PayContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', name: '', phone: '' });

  const plan = searchParams.get('plan') || 'pro';
  const { setupFee, monthlyFee, name } = getPlan(plan);
  const totalFirstPayment = setupFee + monthlyFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = useCallback(async () => {
    if (!formData.email || !formData.name || !formData.phone) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
    if (!clientKey) {
      alert('결제 설정이 완료되지 않았습니다.');
      return;
    }

    setIsLoading(true);

    try {
      // 1) 서버에 주문 먼저 기록 (금액 고정)
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, ...formData }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.message || '주문 생성에 실패했습니다.');
      }

      const { orderId, customerKey } = await orderRes.json();

      // 2) 빌링키 발급창 (카드 등록)
      const TossPayments = await loadTossSdk();
      const tossPayments = TossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey });

      await payment.requestBillingAuth({
        method: 'CARD',
        successUrl: `${window.location.origin}/pay/billing-success?orderId=${orderId}&customerKey=${customerKey}`,
        failUrl: `${window.location.origin}/checkout/fail`,
        customerEmail: formData.email,
        customerName: formData.name,
      });
    } catch (error: any) {
      console.error('결제 요청 오류:', error);
      if (error?.code !== 'USER_CANCEL') {
        alert(error?.message || '결제 요청 중 오류가 발생했습니다.');
      }
      setIsLoading(false);
    }
  }, [formData, plan]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <Link href="/" className="mb-6 inline-flex text-sm font-semibold text-slate-600 hover:text-slate-900">
          ← 돌아가기
        </Link>

        <h1 className="text-2xl font-bold">Nexia {name} 결제</h1>
        <p className="mt-2 text-sm text-slate-500">
          구축비 + 첫 달 구독료를 한 번에 결제합니다.
        </p>

        <div className="mt-8 space-y-4 rounded-2xl bg-slate-100 p-6">
          <div className="flex justify-between">
            <span className="text-slate-600">구축비</span>
            <span className="font-semibold">{setupFee.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">첫 달 구독료</span>
            <span className="font-semibold">{monthlyFee.toLocaleString()}원</span>
          </div>
          <div className="border-t border-slate-300 pt-4">
            <div className="flex justify-between">
              <span className="font-bold text-slate-900">첫 결제액</span>
              <span className="text-xl font-bold text-blue-600">
                {totalFirstPayment.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-900">이름</label>
            <input
              id="name" type="text" name="name"
              value={formData.name} onChange={handleInputChange}
              placeholder="예: 김태헌"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-900">이메일</label>
            <input
              id="email" type="email" name="email"
              value={formData.email} onChange={handleInputChange}
              placeholder="example@email.com"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-slate-900">전화번호</label>
            <input
              id="phone" type="tel" name="phone"
              value={formData.phone} onChange={handleInputChange}
              placeholder="010-0000-0000"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handlePayment}
          disabled={isLoading}
          className="mt-8 w-full rounded-xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? '결제창 여는 중...' : '결제하기'}
        </button>

        <p className="mt-4 text-center text-xs text-slate-500">
          카드 등록 후 첫 결제 {totalFirstPayment.toLocaleString()}원이 청구되며,
          <br />
          다음 달부터 매월 {monthlyFee.toLocaleString()}원이 자동 결제됩니다.
        </p>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-900">환불정책 확인</p>
          <p className="mt-2 text-xs text-amber-900">
            구축비는 작업 착수 시 50% 차감, 완성본 발송 후 환불 불가입니다.
            <Link href="/terms" className="ml-1 font-bold underline">자세히</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">로딩 중...</div>}>
      <PayContent />
    </Suspense>
  );
}