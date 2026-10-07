'use client';

import { useEffect, useRef, useState } from 'react';
import { loadPaymentWidget, PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk';

// 토스페이먼츠 공식 테스트용 클라이언트 키
const clientKey = 'test_ck_D5GePWvyJqK4WBaVoBa3rg07nO5N';
const customerKey = 'THSOFT_TEST_CUSTOMER'; // 비회원 또는 테스트용 고객 고유 식별자

export default function CheckoutPage() {
  const [paymentWidget, setPaymentWidget] = useState<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<PaymentWidgetInstance['renderPaymentMethods']> | null>(null);
  
  // 심사용 기본 상품 금액 (예: 베이직 플랜 월 39,000원)
  const [price] = useState<number>(39000);

  useEffect(() => {
    (async () => {
      try {
        const widget = await loadPaymentWidget(clientKey, customerKey);
        
        // 결제 UI 렌더링
        const methodsWidget = widget.renderPaymentMethods(
          '#payment-widget',
          { value: price },
          { variantKey: 'DEFAULT' }
        );

        // 이용약관 UI 렌더링
        widget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' });

        paymentWidgetRef(widget);
        paymentMethodsWidgetRef.current = methodsWidget;
        setPaymentWidget(widget);
      } catch (error) {
        console.error('결제위젯 로드 실패:', error);
      }
    })();
  }, [price]);

  const handlePaymentRequest = async () => {
    if (!paymentWidget) return;

    try {
      await paymentWidget.requestPayment({
        orderId: `ORD-${Date.now()}`,
        orderName: 'TH소프트 노코드 빌더 베이직 플랜 (1개월)',
        customerEmail: 'customer@example.com',
        customerName: '홍길동',
        customerMobilePhone: '01012345678',
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
      });
    } catch (error) {
      console.error('결제 요청 에러:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-6 font-sans">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">주문 / 정기 결제</h1>
      
      {/* 상품 정보 요약 (심사용 명시) */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6 space-y-2">
        <div className="flex justify-between font-medium">
          <span>상품명</span>
          <span className="text-slate-800">TH소프트 노코드 빌더 베이직 플랜</span>
        </div>
        <div className="flex justify-between text-sm text-slate-500">
          <span>제공 기간</span>
          <span>결제일로부터 1개월</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200">
          <span>결제 금액</span>
          <span className="text-blue-600">{price.toLocaleString()}원 / 월</span>
        </div>
      </div>

      {/* 결제 UI 및 약관 UI 영역 */}
      <div id="payment-widget" />
      <div id="agreement" />

      {/* 결제 실행 버튼 */}
      <button
        onClick={handlePaymentRequest}
        className="w-full mt-6 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
      >
        {price.toLocaleString()}원 정기결제 신청하기
      </button>
    </div>
  );
}

function paymentWidgetRef(widget: PaymentWidgetInstance) {
  // 인스턴스 보존용 헬퍼
}