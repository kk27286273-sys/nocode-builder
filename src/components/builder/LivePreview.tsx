'use client';

import React, { useState } from 'react';
import { B2BTemplateData } from '@/data/templates';

interface LivePreviewProps {
  data: B2BTemplateData;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}

export default function LivePreview({ data, zoom, setZoom }: LivePreviewProps) {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro'>('basic');
  const supportPhone = data?.supportPhone || '010-0000-0000';
  const themeColor = data?.themeColor || '#2563EB';

  const handlePlanSelect = (plan: 'basic' | 'pro') => {
    setSelectedPlan(plan);
    const formElement = document.getElementById('preview-contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden relative">
      {/* 상단 줌 컨트롤 바 */}
      <div className="h-12 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
        <span className="text-xs font-semibold text-slate-500 tracking-wider">
          미리보기 캔버스 ({zoom}%)
        </span>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setZoom((prev) => Math.max(prev - 10, 50))}
            className="p-1 px-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300"
          >
            -
          </button>
          <span className="text-xs font-medium text-slate-600 w-10 sm:w-12 text-center">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((prev) => Math.min(prev + 10, 150))}
            className="p-1 px-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300"
          >
            +
          </button>
          <button
            onClick={() => setZoom(100)}
            className="ml-1 sm:ml-2 text-xs text-slate-500 hover:text-slate-800 underline"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 실시간 프리뷰 영역 */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-2 sm:p-4 md:p-8 flex justify-center items-start relative">
        <div
          style={{
            width: '1200px',
            maxWidth: '100%',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            marginBottom: `${(1200 * (zoom / 100) - 1200) / 2}px`,
          }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden shrink-0 transition-transform duration-75 text-slate-900 mx-auto relative"
        >
          {/* 1. GNB 헤더 */}
          <header className="h-16 sm:h-20 border-b border-slate-100 px-4 sm:px-8 flex items-center justify-between bg-white/95 backdrop-blur sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {data?.company?.name || 'TH소프트'}
              </span>
              <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                정찰제 웹 에이전시
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
              <a href="#preview-features" className="hover:text-blue-600 transition">특장점</a>
              <a href="#preview-pricing" className="hover:text-blue-600 transition">정찰제 가격</a>
              <a href="#preview-contact-form" className="hover:text-blue-600 transition">견적 문의</a>
            </nav>

            <div>
              <a
                href={`tel:${supportPhone}`}
                style={{ backgroundColor: themeColor }}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shadow hover:opacity-95 transition"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1v3.5a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z" />
                </svg>
                <span>전화 상담</span>
              </a>
            </div>
          </header>

          {/* 2. 메인 히어로 */}
          <section className="relative py-20 sm:py-28 bg-slate-950 text-white overflow-hidden text-center px-4">
            <div className="max-w-4xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs sm:text-sm font-bold mb-6">
                {data?.hero?.badge || '거품 없는 B2B 정찰제 제작 솔루션'}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-6 whitespace-pre-line">
                {data?.hero?.title || '고객을 부르는 웹사이트,\n투명한 정찰제로 완성합니다'}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto mb-10">
                {data?.hero?.subtitle || '기획부터 검색엔진 등록까지 한번에. 전환율 높은 인바운드 접수 시스템과 반응형 구조를 완벽 제공합니다.'}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#preview-pricing"
                  style={{ backgroundColor: themeColor }}
                  className="w-full sm:w-auto px-8 py-3.5 text-white font-bold rounded-xl shadow-lg hover:opacity-95 transition text-center"
                >
                  정찰제 가격 플랜 보기
                </a>
                <a
                  href="#preview-contact-form"
                  className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition border border-slate-700 text-center"
                >
                  빠른 온라인 견적 신청
                </a>
              </div>
            </div>
          </section>

          {/* 3. 기술 인증 뱃지 바 */}
          <section className="py-6 border-y border-slate-100 bg-slate-50/60 px-4">
            <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-6 sm:gap-12 text-xs sm:text-sm font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">⚡</span>
                <span>초고속 Next.js 로딩</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">📱</span>
                <span>모바일 100% 반응형 최적화</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">🔍</span>
                <span>네이버/구글 검색엔진(SEO) 무료 등록</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">🔒</span>
                <span>Vercel 글로벌 CDN & SSL 보안</span>
              </div>
            </div>
          </section>

          {/* 4. 핵심 특장점 그리드 */}
          <section id="preview-features" className="py-20 px-6 sm:px-8 bg-white">
            <div className="max-w-5xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-14">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                  TH소프트가 제공하는 확실한 차이
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  추가금 요구 없는 정직한 개발과 빠른 유지관리 체계를 보장합니다.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black mb-6">
                    01
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">전화·카카오톡 즉시 연결</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    방문 고객이 망설임 없이 대표번호 연결 및 1:1 카톡 상담으로 진입할 수 있는 최적 동선을 설계합니다.
                  </p>
                </div>
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black mb-6">
                    02
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">인바운드 접수 폼 & DB 연동</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    홈페이지에서 인입되는 견적 및 상담 요청 데이터를 누락 없이 안전하게 관리자 DB로 수집합니다.
                  </p>
                </div>
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black mb-6">
                    03
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">검색엔진 SEO 대행 무료</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    네이버 서치어드바이저 및 구글 서치콘솔에 사이트맵과 소유확인을 무료로 대행하여 노출 기반을 다집니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. 2단 가격 안내 섹션 */}
          <section id="preview-pricing" className="py-20 px-6 sm:px-8 bg-slate-50 border-t border-slate-200">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <span className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2 block">
                  Pricing Plan
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                  합리적인 정찰제 제작 플랜
                </h2>
                <p className="text-slate-600 text-sm">
                  불필요한 거품을 걷어내고 필수 고효율 기능만 엄선하여 제공합니다.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                {/* 플랜 1: 베이직 */}
                <div className="bg-white rounded-3xl p-8 border-2 border-blue-600 shadow-xl flex flex-col justify-between relative">
                  <div className="absolute -top-3.5 left-8 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                    가장 많은 선택 · 추천
                  </div>

                  <div>
                    <div className="flex justify-between items-start mb-4 mt-2">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900">베이직</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">실속형 원페이지 스크롤</p>
                      </div>
                      <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md font-bold">
                        단기 납기
                      </span>
                    </div>

                    <div className="my-5 pb-5 border-b border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-slate-400 line-through">700,000원</span>
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">30% 할인</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-slate-900">490,000</span>
                        <span className="text-base font-bold text-slate-800">원</span>
                        <span className="text-xs text-slate-400 ml-1">(부가세 별도)</span>
                      </div>
                      <div className="mt-2 text-xs font-semibold text-blue-600">
                        월 관리비: 59,900원
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8 text-sm text-slate-600">
                      <li className="flex items-start gap-2.5">
                        <span className="text-blue-600 font-bold shrink-0">✓</span>
                        <span>모바일 100% 최적화 단일 원페이지 스크롤</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-blue-600 font-bold shrink-0">✓</span>
                        <span>카카오톡 1:1 상담 및 다이렉트 전화 연결</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-blue-600 font-bold shrink-0">✓</span>
                        <span>인바운드 견적 접수 폼 & 관리자 DB 연동</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-blue-600 font-bold shrink-0">✓</span>
                        <span>네이버/구글 검색엔진(SEO) 등록 무료 대행</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-blue-600 font-bold shrink-0">✓</span>
                        <span className="font-semibold text-slate-900">제작 기간: 필수 자료 전달 후 3~4일 소요</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handlePlanSelect('basic')}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition text-sm cursor-pointer"
                  >
                    베이직 상담 신청하기
                  </button>
                </div>

                {/* 플랜 2: 프로 */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between relative hover:border-slate-300 transition">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900">프로</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">기업형 독립 멀티페이지</p>
                      </div>
                      <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-bold">
                        고도화형
                      </span>
                    </div>

                    <div className="my-5 pb-5 border-b border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-slate-400 line-through">1,200,000원</span>
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">25% 할인</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-slate-900">890,000</span>
                        <span className="text-base font-bold text-slate-800">원</span>
                        <span className="text-xs text-slate-400 ml-1">(부가세 별도)</span>
                      </div>
                      <div className="mt-2 text-xs font-semibold text-slate-600">
                        월 관리비: 89,900원
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8 text-sm text-slate-600">
                      <li className="flex items-start gap-2.5">
                        <span className="text-slate-800 font-bold shrink-0">✓</span>
                        <span>3~5개 독립 멀티페이지 (홈/회사소개/시공실적/서비스/문의)</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-slate-800 font-bold shrink-0">✓</span>
                        <span>고해상도 시공 실적 갤러리/게시판 구성</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-slate-800 font-bold shrink-0">✓</span>
                        <span>카테고리별 맞춤 견적 신청 폼 & 관리자 DB 연동</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-slate-800 font-bold shrink-0">✓</span>
                        <span>네이버/구글 검색엔진(SEO) 및 사이트맵 등록 대행</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-slate-800 font-bold shrink-0">✓</span>
                        <span className="font-semibold text-slate-900">제작 기간: 필수 자료 전달 후 7~10일 소요</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handlePlanSelect('pro')}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition text-sm cursor-pointer shadow"
                  >
                    프로 상담 신청하기
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 6. 견적 상담 접수 폼 */}
          <section id="preview-contact-form" className="py-20 px-6 sm:px-8 bg-white border-t border-slate-100">
            <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm">
              <div className="text-center mb-8">
                <span className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2 block">
                  Online Inquiry
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                  빠른 제작 견적 신청
                </h2>
                <p className="text-sm text-slate-600">
                  상담 내용을 남겨주시면 담당 개발자가 검토 후 1시간 이내 연락드립니다.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(
                    `선택 플랜: [${selectedPlan === 'basic' ? '베이직 원페이지 (49만원)' : '프로 멀티페이지 (89만원)'}]\n상담 신청이 접수되었습니다.`
                  );
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    희망 플랜 선택 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        selectedPlan === 'basic'
                          ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preview_plan"
                        value="basic"
                        checked={selectedPlan === 'basic'}
                        onChange={() => setSelectedPlan('basic')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">베이직 원페이지</div>
                        <div className="text-xs text-blue-600 font-semibold">490,000원</div>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        selectedPlan === 'pro'
                          ? 'border-slate-900 bg-slate-100 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preview_plan"
                        value="pro"
                        checked={selectedPlan === 'pro'}
                        onChange={() => setSelectedPlan('pro')}
                        className="w-4 h-4 text-slate-900 focus:ring-slate-900"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">프로 멀티페이지</div>
                        <div className="text-xs text-slate-700 font-semibold">890,000원</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    기업명 / 신청자명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="홍길동 / (주)기업명"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="010-0000-0000"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    제작 요구사항 / 참고 사이트 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="원하시는 업종, 참고 사이트 URL, 필요 기능 등을 편하게 남겨주세요."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  />
                </div>

                <div className="pt-2 pb-1">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-500 leading-relaxed mb-2 max-h-24 overflow-y-auto">
                    <strong>[개인정보 수집 및 이용 동의]</strong><br />
                    1. 수집 항목: 신청자명, 연락처, 희망 플랜, 문의 내용<br />
                    2. 수집 목적: 견적 산출 및 개발 상담 안내<br />
                    3. 보유 기간: 상담 접수 후 1년간 보관 후 지체 없이 파기
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      required
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>
                      <span className="text-red-500">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  style={{ backgroundColor: themeColor }}
                  className="w-full py-3.5 text-white font-bold text-sm rounded-xl shadow-md hover:opacity-95 transition mt-2 cursor-pointer"
                >
                  제작 견적 신청 완료
                </button>
              </form>
            </div>
          </section>

          {/* 7. 푸터 */}
          <footer className="bg-slate-900 text-slate-400 py-10 px-8 border-t border-slate-800 text-xs">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
              <div>
                <span className="text-lg font-bold text-white tracking-tight">
                  {data?.company?.name || 'TH소프트'}
                </span>
                <p className="mt-2 text-slate-400">
                  기업 가치를 극대화하는 B2B 전문 웹 에이전시
                </p>
                <div className="mt-4 text-slate-500 space-y-1 leading-relaxed">
                  <p>상호명: {data?.footer?.companyName || 'TH소프트'} | 대표자: {data?.footer?.ownerName || '대표자명'} | 사업자등록번호: {data?.footer?.businessNumber || '000-00-00000'}</p>
                  <p>주소: {data?.footer?.address || '서울특별시 강남구 테헤란로'} | 통신판매업신고: 제2026-서울-0000호</p>
                </div>
              </div>
              <div className="text-left md:text-right">
                <span className="text-sm font-semibold text-white">직통 유선 문의</span>
                <div className="text-xl font-black text-blue-400 mt-1 mb-2">
                  {supportPhone}
                </div>
                <p className="text-slate-500">© {data?.company?.name || 'TH소프트'}. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>

        {/* 우측 하단 전화 상담 플로팅 버튼 */}
        <a
          href={`tel:${supportPhone}`}
          style={{ backgroundColor: themeColor }}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 text-white rounded-full shadow-2xl transition duration-300 hover:scale-110 active:scale-95"
          title="전화 바로 연결"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1v3.5a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z" />
          </svg>
        </a>
      </div>
    </main>
  );
}