'use client';

import React from 'react';
import ShowroomSlider from '@/components/showroom/ShowroomSlider';
import Link from 'next/link';

export default function LandingPage() {
  const KAKAO_LINK = "http://pf.kakao.com/_qxmixiX/chat";
  const PHONE_NUMBER = "01029482728";

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Header / Nav */}
      <nav className="flex justify-between items-center px-6 py-5 max-w-6xl mx-auto">
        <div className="text-xl font-bold tracking-tight">TH SOFT</div>
        <a 
          href={KAKAO_LINK} 
          target="_blank" 
          className="text-sm font-semibold px-4 py-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-all"
        >
          문의하기
        </a>
      </nav>
<ShowroomSlider />

      {/* Hero Section */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
          비즈니스 성장을 위한 최적의 선택
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-8 tracking-tight">
          매출을 올리는 <span className="text-blue-600">고성능 웹사이트</span>,<br /> 
          가장 빠르게 구축해 드립니다.
        </h1>
        <p className="text-lg text-slate-600 mb-12 leading-relaxed">
          불필요한 기능은 빼고, 고객이 실제로 반응하는 <br className="hidden md:block" />
          핵심 디자인과 최적화된 동선만 담아 결과로 증명합니다.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href={KAKAO_LINK} 
            target="_blank" 
            className="px-8 py-4 bg-[#FEE500] text-[#3C1E1E] font-bold rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>💬 카카오톡 빠른 상담</span>
          </a>
          <a 
            href={`tel:${PHONE_NUMBER}`} 
            className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <span>📞 전화로 문의하기</span>
          </a>
        </div>
      </section>

      {/* Preview Section */}
      <section className="bg-slate-50 py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">실제 제작 사례 확인하기</h2>
          <p className="text-slate-600 mb-10">
            업종별로 최적화된 템플릿을 통해 <br /> 
            대표님의 사업이 어떻게 표현될지 바로 확인해 보세요.
          </p>
          <Link 
            href="/preview" 
            className="inline-flex items-center px-8 py-4 bg-white border-2 border-slate-900 font-bold rounded-2xl hover:bg-slate-900 hover:text-white transition-all group"
          >
            실시간 프리뷰 확인하기 
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6">⚡</div>
          <h3 className="text-xl font-bold mb-3">초고속 구축</h3>
          <p className="text-slate-600 leading-relaxed">기획부터 오픈까지 <br /> 불필요한 대기 시간 없이 빠르게 진행합니다.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6">📱</div>
          <h3 className="text-xl font-bold mb-3">모바일 최적화</h3>
          <p className="text-slate-600 leading-relaxed">PC는 물론 스마트폰에서도 <br /> 완벽하게 작동하는 반응형 웹을 제공합니다.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6">🛠️</div>
          <h3 className="text-xl font-bold mb-3">간편한 유지보수</h3>
          <p className="text-slate-600 leading-relaxed">운영 중 수정 사항이 생겨도 <br /> 복잡한 과정 없이 즉시 반영 가능합니다.</p>
        </div>
      </section>

      {/* Footer CTA & Business Info */}
      <footer className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          {/* 상담 유도 섹션 */}
          <h2 className="text-2xl md:text-3xl font-bold mb-8">지금 바로 상담을 시작하세요</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href={KAKAO_LINK} target="_blank" className="px-8 py-4 bg-[#FEE500] text-[#3C1E1E] font-bold rounded-2xl hover:scale-105 transition-all">
              카카오톡 상담하기
            </a>
            <a href={`tel:${PHONE_NUMBER}`} className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:scale-105 transition-all">
              전화 상담하기
            </a>
          </div>

          {/* 법적 사업자 정보 섹션 (심사 필수 항목) */}
          <div className="border-t border-slate-800 pt-12 text-slate-400 text-sm space-y-3 text-left max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <span className="font-bold text-slate-200 text-base">티에이치소프트</span>
              <div className="flex gap-4 text-xs">
                <a href="/terms" className="underline hover:text-white">이용약관</a>
                <a href="/privacy" className="underline hover:text-white">개인정보처리방침</a>
              </div>
            </div>
            <p>대표자명: 김태헌</p>
            <p>사업자등록번호: 599-18-02634</p>
            <p>사업장 주소: 경상북도 구미시 수출대로3길 130, (공단동 우림필유아파트) 108동 101호</p>
            <p>대표번호: 010-2948-2728</p>
            <p>통신판매업신고: 신고 진행 중</p>
            <p className="mt-8 text-center sm:text-left opacity-50 text-xs">
              © 2026 TH SOFT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>