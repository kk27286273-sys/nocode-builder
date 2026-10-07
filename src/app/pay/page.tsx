'use client';

import React, { useEffect, useRef } from 'react';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';

export default function CheckoutPage() {
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const clientKey = 'test_ck_Z61JOxRQVENyaaewWlDRrW0X9bAq';
        const customerKey = 'GUEST_' + Math.random().toString(36).substring(2, 11);

        const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
        widgetRef.current = paymentWidget;

        // renderPaymentMethods 대신 renderPaymentWidget 사용 (가장 기본형)
        // 이 메서드는 variantKey를 참조하지 않고 기본 위젯을 띄웁니다.
        await paymentWidget.renderPaymentWidget('#payment-method', {
          value: 39000,
        });

        console.log('결제 위젯 렌더링 완료 (Basic Mode)');
      } catch (error) {
        console.error('결제 위젯 초기화 실패:', error);
      }
    };

    initializePayment();
  }, []);

  const handlePaymentRequest = async () => {
    if (!widgetRef.current) {
      alert('결제 위젯이 준비되지 않았습니다.');
      return;
    }

    try {
      await widgetRef.current.requestPayment({
        orderId: `ORDER_${Date.now()}`,
        orderName: 'TH소프트 노코드 빌더 이용권',
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
      });
    } catch (error) {
      console.error('결제 요청 실패:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 text-center border-b border-slate-100">
          <h1 className="text-2xl font-extrabold text-slate-900">결제하기</h1>
          <p className="text-slate-500 mt-2">서비스 이용을 위해 결제를 진행해주세요.</p>
        </div>
        <div className="p-8">
          <div id="payment-method" className="mb-8"></div>
          <button
            onClick={handlePaymentRequest}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
          >
            결제 요청하기
          </button>
        </div>
        <div className="p-6 bg-slate-50 text-center">
          <p className="text-xs text-slate-400">결제 시 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다.</p>
        </div>
      </div>
    </div>
  );
}