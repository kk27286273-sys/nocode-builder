'use client';

import React from 'react';

interface LegalModalProps {
  type: 'terms' | 'privacy';
  onClose: () => void;
}

export default function LegalModal({ type, onClose }: LegalModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-900 text-lg">
            {type === 'terms' ? '이용약관' : '개인정보 처리방침'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-sm leading-relaxed text-slate-600 space-y-4">
          {type === 'terms' ? (
            <div className="space-y-3">
              <p className="font-bold text-slate-900">제 1조 (목적)</p>
              <p>본 약관은 TH소프트가 제공하는 웹사이트 구축 및 관리 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
              <p className="font-bold text-slate-900">제 2조 (서비스 제공)</p>
              <p>회사는 고객의 요구사항에 맞춘 고성능 웹사이트 구축, 유지보수 및 도메인 관리 서비스를 제공합니다.</p>
              <p className="font-bold text-slate-900">제 3조 (이용료 및 환불)</p>
              <p>서비스 이용료는 선택하신 요금제에 따르며, 구축 완료 후 발행된 사이트에 대해서는 단순 변심으로 인한 환불이 제한될 수 있습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-bold text-slate-900">1. 수집하는 개인정보 항목</p>
              <p>이용자가 상담 신청 시 입력하는 성함, 연락처, 문의 내용 등을 수집합니다.</p>
              <p className="font-bold text-slate-900">2. 개인정보의 수집 및 이용 목적</p>
              <p>수집된 정보는 견적 상담 응대 및 서비스 제공을 위한 연락 목적으로만 사용됩니다.</p>
              <p className="font-bold text-slate-900">3. 보유 및 이용 기간</p>
              <p>수집된 정보는 목적 달성 후 또는 이용자의 삭제 요청 시 즉시 파기합니다. (단, 법령에 따라 보존이 필요한 경우 해당 기간까지 보관)</p>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50">
          <button onClick={onClose} className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition">확인</button>
        </div>
      </div>
    </div>
  );
}