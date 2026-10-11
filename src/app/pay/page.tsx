'use client';

import React, { useCallback, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const SDK_URL = 'https://js.tosspayments.com/v2/standard';

function loadTossSdk(): Promise<any> {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    if (window.TossPayments) {
      // @ts-ignore
      resolve(window.TossPayments);
      return;
    }

    const existing = document.querySelector(`script[src="${SDK_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => {
        // @ts-ignore
        resolve(window.TossPayments);
      });
      existing.addEventListener('error', () => reject(new Error('SDK 로드 실패')));
      return;
    }

    const script = document.createElement('script');
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => {
      // @ts-ignore
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
  const setupFee = Number(searchParams.get('setupFee')) || 1000000;
  const monthlyFee = Number(searchParams.get('monthlyFee')) || 79000;
  const totalFirstPayment = setupFee + monthlyFee;

  const planNames: Record<string, string> = {
    basic: 'Basic',
    pro: 'Pro',
    premium: 'Premium',
  };

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
    console.log('로드된 키:', clientKey);

    setIsLoading(true);

    try {
      const TossPayments = await loadTossSdk();
      const tossPayments = TossPayments(clientKey);

      // 비회원 결제창 방식
      const payment = tossPayments.payment({
        customerKey: TossPayments.ANONYMOUS,
      });

      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: totalFirstPayment },
        orderId: `ORDER_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        orderName: `Nexia ${planNames[plan]} 구축비 + 첫 달 구독`,
        successUrl: `${window.location.origin}/pay/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
        customerEmail: formData.email,
        customerName: formData.name,
        card: {
          useEscrow: false,
          flowMode: 'DEFAULT',
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
    } catch (error: any) {
      console.error('결제 요청 오류:', error);
      if (error?.code !== 'USER_CANCEL') {
        alert(error?.message || '결제 요청 중 오류가 발생했습니다.');
      }
      setIsLoading(false);
    }
  }, [formData, plan, totalFirstPayment]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <Link href="/" className="mb-6 inline-flex text-sm font-semibold text-slate-600 hover:text-slate-900">
          ← 돌아가기
        </Link>

        <h1 className="text-2xl font-bold">Nexia {planNames[plan]} 결제</h1>
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
              <span className="font-bold text-slate-900">총 결제액</span>
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
          결제 후 매월 {monthlyFee.toLocaleString()}원이 청구됩니다.
          <br />
          언제든지 구독을 취소할 수 있습니다.
        </p>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-900">환불정책 확인</p>
          <p className="mt-2 text-xs text-amber-900">
            구축비는 작업 착수 시 50% 차감, 완성본 발송 후 환불 불가입니다.
            <Link href="/refund" className="ml-1 font-bold underline">자세히</Link>
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