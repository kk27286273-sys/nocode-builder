'use client';

import React from 'react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
  companyName?: string;
  contactEmail?: string;
}

export default function LegalModal({
  isOpen,
  type,
  onClose,
  companyName = 'TH소프트',
  contactEmail = 'contact@thsoft.kr'
}: LegalModalProps) {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 text-sm">
            {type === 'terms' ? '서비스 이용약관' : '개인정보 처리방침'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
          >
            닫기
          </button>
        </div>

        <div className="p-4 overflow-y-auto text-xs text-slate-600 space-y-3 leading-relaxed">
          {type === 'terms' ? (
            <>
              <p className="font-semibold text-slate-800">제1조 (목적)</p>
              <p>본 약관은 {companyName}(이하 "회사")이 제공하는 제반 서비스의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
              <p className="font-semibold text-slate-800">제2조 (이용자의 의무)</p>
              <p>이용자는 서비스 이용 시 허위 정보를 제공해서는 안 되며, 타인의 권리를 침해하거나 업무를 방해하는 행위를 하여서는 안 됩니다.</p>
              <p className="font-semibold text-slate-800">제3조 (문의 및 안내)</p>
              <p>서비스 이용 관련 문의는 {contactEmail}을 통해 접수하실 수 있습니다.</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-slate-800">1. 수집하는 개인정보 항목</p>
              <p>회사는 상담 및 서비스 예약 제공을 위해 성명, 연락처, 이메일 등의 기본 정보를 수집합니다.</p>
              <p className="font-semibold text-slate-800">2. 개인정보의 수집 및 이용 목적</p>
              <p>수집된 개인정보는 고객 문의 처리, 상담 일정 조율, 서비스 관련 공지 전달 외 목적으로는 사용되지 않습니다.</p>
              <p className="font-semibold text-slate-800">3. 개인정보 보유 및 파기</p>
              <p>목적 달성 후 관계 법령에 따른 보존 의무가 없는 한 즉시 파기합니다.</p>
              <p className="font-semibold text-slate-800">4. 개인정보 보호책임자</p>
              <p>문의 접수: {contactEmail}</p>
            </>
          )}
        </div>

        <div className="p-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}