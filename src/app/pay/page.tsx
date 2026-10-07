'use client';

import React, { useEffect } from 'react';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';

export default function PayPage() {
  useEffect(() => {
    const init = async () => {
      try {
        // 클라이언트 키를 사용하여 위젯 로드
        const paymentWidget = await loadPaymentWidget('test_ck_Z61JOxRQVENyaaewWlDRrW0X9bAq');
        
        // [핵심] renderPaymentMethods는 우리 페이지 내에 결제 수단을 그려줍니다. (404 발생 안 함)
        await paymentWidget.renderPaymentMethods('#payment-method', { 
          value: 39000 
        });

        const button = document.getElementById('payment-button');
        if (button) {
          button.addEventListener('click', async () => {
            try {
              await paymentWidget.requestPayment({
                orderId: 'ORDER_' + Date.now(),
                orderName: 'TH소프트 이용권',
                successUrl: window.location.origin + '/checkout/success',
                failUrl: window.location.origin + '/checkout/fail',
              });
            } catch (e) {
              console.error('결제 요청 에러:', e);
              alert('결제 요청 중 오류가 발생했습니다.');
            }
          });
        }
      } catch (e) {
        console.error('초기화 에러:', e);
      }
    };
    init();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
        <h1 className="text-2xl font-bold text-center mb-6">결제하기</h1>
        {/* 토스 위젯이 그려질 영역 */}
        <div id="payment-method" className="mb-6"></div>
        <button id="payment-button" className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
          결제 요청하기
        </button>
      </div>
    </div>
  );
}