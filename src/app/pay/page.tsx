'use client';

import React from 'react';

export default function PayPage() {
  const handlePayment = async () => {
    try {
      // 라이브러리 임포트 없이 토스 결제창 스크립트를 직접 로드하여 호출합니다.
      const script = document.createElement('script');
      script.src = 'https://js.tosspayments.com/v1/payment';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        // @ts-ignore
        const tossPayments = window.TossPayments('test_ck_Z61JOxRQVENyaaewWlDRrW0X9bAq');
        
        // @ts-ignore
        tossPayments.requestPayment('카드', {
          amount: 39000,
          orderId: `ORDER_${Date.now()}`,
          orderName: 'TH소프트 이용권',
          successUrl: `${window.location.origin}/checkout/success`,
          failUrl: `${window.location.origin}/checkout/fail`,
        });
      };
    } catch (e) {
      console.error('결제 요청 실패:', e);
      alert('결제창을 띄우는 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-slate-200 text-center">
        <h1 className="text-2xl font-bold mb-2">결제하기</h1>
        <p className="text-slate-500 mb-8">표준 결제창 방식으로 진행합니다.</p>
        
        <div className="p-6 bg-slate-100 rounded-2xl mb-8 text-left">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">상품명</span>
            <span className="font-bold">TH소프트 이용권</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-slate-600">결제 금액</span>
            <span className="font-bold text-xl">39,000원</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95"
        >
          결제하기
        </button>
      </div>
    </div>
  );
}