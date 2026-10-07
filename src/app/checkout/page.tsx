'use client';

import React, { useEffect } from 'react';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';

export default function CheckoutPage() {
  useEffect(() => {
    const initializePayment = async () => {
      try {
        const paymentWidget = await loadPaymentWidget('test'); 
        await paymentWidget.renderPaymentMethods('#payment-method', { value: 39000 });

        const paymentButton = document.getElementById('payment-button');
        if (paymentButton) {
          paymentButton.addEventListener('click', async () => {
            await paymentWidget.requestPayment({
              orderId: `ORDER_${new Date().getTime()}`,
              orderName: 'TH소프트 노코드 빌더 이용권',
              successUrl: `${window.location.origin}/checkout/success`,
              failUrl: `${window.location.origin}/checkout/fail`,
            });
          });
        }
      } catch (error) {
        console.error('결제 위젯 초기화 실패:', error);
      }
    };
    initializePayment();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 text-center border-b border-slate-100">
          <h1 className="text-2xl font-extrabold text-slate-900">결제하기</h1>
          <p className="text-slate-500 mt-2">서비스 이용을 위해 결제를 진행해주세요.</p>
        </div>
        <div className="p-8">
          <div id="payment-method" className="mb-8"></div>
          <button id="payment-button" className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95">
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