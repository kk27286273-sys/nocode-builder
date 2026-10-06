'use client';

import React from 'react';
import * as PortOne from '@portone/browser-sdk/v2';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  if (!isOpen) return null;

  const handlePayment = async () => {
    try {
      const paymentId = `pay_${Date.now()}`;
      const response = await PortOne.requestPayment({
        storeId: 'store-e866650b-8015-4ba8-bbec-9d6614138676',
        channelKey: 'channel-key-b8f1bb82-624c-4e78-95d6-c2ba7f09f070',
        paymentId: paymentId,
        orderName: '프로 플랜 첫 달 100원 체험권',
        totalAmount: 100,
        currency: 'CURRENCY_KRW',
        payMethod: 'CARD',
      });

      if (response && response.code != null) {
        alert(`결제 실패: ${response.message}`);
        return;
      }

      alert('🎉 결제가 성공적으로 완료되었습니다! 프로 기능이 활성화됩니다.');
      onClose();
    } catch (error: any) {
      alert('결제창 호출 중 오류: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150 font-sans">
        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
          👑
        </div>
        
        <div className="space-y-1.5">
          <h3 className="text-lg font-extrabold text-slate-900">프로 플랜으로 업그레이드</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            복잡한 외주 개발비 150만 원을 아끼세요.<br/>
            첫 달 단 <b>100원</b>으로 모든 프로 기능이 해제됩니다.
          </p>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl text-left text-xs space-y-2 border border-slate-100">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <span className="text-emerald-500 font-bold">✓</span> 하단 워터마크 완전 제거
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <span className="text-emerald-500 font-bold">✓</span> 고객 예약/상담 DB 무제한 수집
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <span className="text-emerald-500 font-bold">✓</span> 토스페이 · 카카오페이 · 삼성페이 지원
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={handlePayment}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-lg transition transform active:scale-95 cursor-pointer"
          >
            첫 달 100원으로 시작하기
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
          >
            다음에 하기
          </button>
        </div>
      </div>
    </div>
  );
}