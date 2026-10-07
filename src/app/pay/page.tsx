'use client';

import React, { useEffect, useRef } from 'react';
import { loadPaymentWidget, ANONYMOUS } from '@tosspayments/payment-widget-sdk';

export default function PayPage() {
  const paymentWidgetRef = useRef<any>(null);

  useEffect(() => {
    const initWidget = async () => {
      try {
        const clientKey = 'test_ck_Z61JOxRQVENyaaewWlDRrW0X9bAq';
        
        // ANONYMOUS(비회원 키)를 함께 넘겨야 SDK가 정상 초기화됩니다.
        const paymentWidget = await loadPaymentWidget(clientKey, ANONYMOUS);
        paymentWidgetRef.current = paymentWidget;

        // 결제 수단 영역 렌더링
        await paymentWidget.renderPaymentMethods(
          '#payment-method',
          { value: 39000 },
          { variantKey: 'DEFAULT' }
        );
      } catch (e) {
        console.error('초기화 에러:', e);
      }
    };

    initWidget();
  }, []);

  const handlePayment = async () => {
    const paymentWidget = paymentWidgetRef.current;
    if (!paymentWidget) {
      alert('결제 위젯이 아직 준비되지 않았습니다.');
      return;
    }

    try {
      await paymentWidget.requestPayment({
        orderId: `ORDER_${Date.now()}`,
        orderName: 'TH소프트 이용권',
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
      });
    } catch (e) {
      console.error('결제 요청 에러:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
        <h1 className="text-2xl font-bold text-center mb-6">결제하기</h1>
        <div id="payment-method" className="mb-6"></div>
        <button
          onClick={handlePayment}
          className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
        >
          결제 요청하기
        </button>
      </div>
    </div>
  );
}