'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const KAKAO_CHAT_URL = 'http://pf.kakao.com/_qxmixiX/chat';

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('상담 신청이 확인되었습니다. 카카오톡 1:1 상담 채팅방으로 즉시 연결합니다.');
    window.location.href = KAKAO_CHAT_URL;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-sky-500 selection:text-white relative">
      {/* 1. 상단 GNB 네비게이션 */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
              TH소프트 <span className="text-sky-600 text-xs sm:text-sm font-bold">TH SOFT</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#strengths" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition">
              핵심 강점
            </a>
            <a href="#solutions" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition">
              제작 사례
            </a>
            <a href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition">
              정찰 단가
            </a>
            <a href="#contact" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition">
              상담 신청
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={KAKAO_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-300 hover:bg-amber-400 text-amber-950 text-xs sm:text-sm font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition shadow-sm flex items-center gap-1.5"
            >
              <span>💬 카톡 상담</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. 메인 히어로 영역 */}
      <section className="py-16 sm:py-28 px-4 sm:px-6 text-center bg-gradient-to-b from-slate-50 via-white to-slate-50/50 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-700 font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full mb-6 sm:mb-8">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
          모바일 100% 최적화 · 3~4일 신속 구축 전문
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight sm:leading-snug tracking-tight max-w-4xl mb-6">
          명함 대신 링크 하나로 계약 따는<br className="hidden sm:block" />
          <span className="text-sky-600"> 모바일 최적화 실속형 홈페이지</span> 제작
        </h1>

        {/* 1px 축소(text-[15px]) 및 줄바꿈 최적화 처리 */}
        <p className="text-slate-600 text-[13px] sm:text-[15px] sm:leading-relaxed max-w-2xl mb-10 px-2 tracking-tight break-keep">
          기업 회사소개부터 매장 홍보, 시공 포트폴리오까지. 불필요한 기능은 빼고 고객의 전화와 견적 문의로 직결되는 실속형 사이트를 3~4일 만에 합리적인 정찰제로 구축해 드립니다.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <a
            href="#contact"
            className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-8 py-4 rounded-xl text-base shadow-lg shadow-sky-600/20 transition transform active:scale-95"
          >
            1:1 맞춤 견적 문의하기
          </a>
          <a
            href={KAKAO_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-amber-300 hover:bg-amber-400 text-amber-950 font-extrabold px-6 py-4 rounded-xl text-base transition flex items-center justify-center gap-2 shadow"
          >
            카톡으로 빠른 상담
          </a>
        </div>
      </section>

      {/* 3. 주요 실적 지표 섹션 (핵심 강점) */}
      <section id="strengths" className="py-12 sm:py-16 px-4 sm:px-6 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-8 rounded-2xl bg-slate-50/80 border border-slate-100 text-center">
            <div className="text-3xl sm:text-4xl font-black text-sky-600 mb-2">100%</div>
            <div className="text-sm font-bold text-slate-800">모바일 반응형 화면 최적화</div>
            <p className="text-xs text-slate-500 mt-1">스마트폰 터치 동선과 가독성을 1순위로 설계</p>
          </div>
          <div className="p-8 rounded-2xl bg-slate-50/80 border border-slate-100 text-center">
            <div className="text-3xl sm:text-4xl font-black text-sky-600 mb-2">3~4일</div>
            <div className="text-sm font-bold text-slate-800">필수 자료 전달 후 초안 완성</div>
            <p className="text-xs text-slate-500 mt-1">기획과 개발 일정 지연 없는 신속 맞춤 셋업</p>
          </div>
          <div className="p-8 rounded-2xl bg-slate-50/80 border border-slate-100 text-center">
            <div className="text-3xl sm:text-4xl font-black text-sky-600 mb-2">0원</div>
            <div className="text-sm font-bold text-slate-800">숨겨진 추가 비용 일절 없음 (정찰제)</div>
            <p className="text-xs text-slate-500 mt-1">호스팅 강매, 유지보수 꼼수 없는 투명 정찰가</p>
          </div>
        </div>
      </section>

      {/* 4. 핵심 솔루션 / 제작 분야 (제작 사례) */}
      <section id="solutions" className="py-20 px-4 sm:px-6 bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-sky-600 tracking-wider uppercase mb-2 block">
              Core Solutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              핵심 솔루션 & 제작 분야
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              업종의 목적에 맞춰 견적 전환율을 극대화하는 3대 대표 구성
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-md mb-4">
                  Case 01
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  B2B 기업·제조업 전용 웹
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  거래처 미팅 전 회사소개서 대신 전달하는 신뢰도 높은 모바일 반응형 웹사이트.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-md mb-4">
                  Case 02
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  매장 홍보 & 시공 포트폴리오 웹
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  인테리어, 설비, 학원 등 고객이 시공 실적과 후기를 보고 바로 견적을 요청하는 구조.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-md mb-4">
                  Case 03
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  전문직 & 1인 기업 랜딩페이지
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  복잡한 메뉴 없이 스크롤 한 번으로 프로필 확인부터 상담 예약까지 1분 컷 연결.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1번 수정: 투명한 실속형 정찰 단가 안내 섹션 (700,000 -> 490,000원 30% 할인) */}
      <section id="pricing" className="py-20 px-4 sm:px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="text-xs font-bold text-sky-600 tracking-wider uppercase mb-2 block">
            Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            투명한 실속형 정찰 단가
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            숨겨진 옵션 비용 없이 기획부터 도메인 연결까지 완벽하게 원스톱 제공합니다.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-slate-50 border-2 border-sky-600 rounded-3xl p-8 sm:p-10 shadow-lg text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-sky-600 text-white text-[11px] font-bold px-4 py-1.5 rounded-bl-xl">
            선착순 5개 업체 한정 (30% 할인)
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">모바일 반응형 B2B 원페이지 패키지</h3>
          <p className="text-xs text-slate-500 mb-6">기획 + 모바일 최적화 디자인 + 문의 CRM 연동 일체</p>
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="text-sm line-through text-slate-400">정상가 700,000원</span>
            <span className="text-3xl sm:text-4xl font-black text-sky-600">490,000원</span>
            <span className="text-xs font-medium text-slate-600">(부가세 별도)</span>
          </div>
          <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 text-left mb-8 max-w-sm mx-auto">
            <li className="flex items-center gap-2">✔ 스마트폰 터치 중심 모바일 반응형 캔버스</li>
            <li className="flex items-center gap-2">✔ 즉시 접수 인바운드 견적 폼 & 관리자 CRM 기본 장착</li>
            <li className="flex items-center gap-2">✔ 카카오톡 및 다이렉트 전화 상담 버튼 연동</li>
            <li className="flex items-center gap-2">✔ SSL 보안 인증서 및 대표 도메인 무료 연결 지원</li>
          </ul>
          <a
            href="#contact"
            className="block w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3.5 rounded-xl transition shadow"
          >
            선착순 할인가로 상담 신청하기
          </a>
        </div>
      </section>

      {/* 5. 자주 묻는 질문 (FAQ) */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              자주 묻는 질문 (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              궁금하신 사항을 사전에 명확하게 안내해 드립니다.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
                <span className="text-sky-600 font-black">Q1.</span>
                컴맹이고 웹을 전혀 모르는데 제작이 가능한가요?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                A. 네, 대표님은 업체 소개와 사진 몇 장만 편하게 던져주시면 됩니다. 기획, 모바일 최적화, 도메인 연결까지 TH소프트가 알아서 세팅해 드립니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
                <span className="text-sky-600 font-black">Q2.</span>
                오픈 기념 30% 할인은 언제까지인가요?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                A. 완성도 높은 1:1 맞춤 퀄리티 유지를 위해 선착순 5개 업체 한정으로 진행되며, 마감 즉시 정상가로 전환됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 상담 신청 폼 영역 */}
      <section id="contact" className="py-20 px-4 sm:px-6 bg-white border-t border-slate-100">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-sky-600 tracking-wider uppercase mb-2 block">
              Contact Us
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              1:1 맞춤 상담 신청
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              신청을 완료하시면 카카오톡 1:1 상담 채팅방으로 즉시 연결됩니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/80">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                업체명 / 담당자명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: TH기업 / 홍길동 대표"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="010-0000-0000"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                제작 희망 내용 / 문의 사항
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="희망하시는 업종, 참고 사이트 등을 자유롭게 적어주세요."
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-extrabold py-3.5 rounded-xl transition shadow text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>💬 카카오톡 1:1 상담 시작하기</span>
            </button>
          </form>
        </div>
      </section>

      {/* 우측 하단 카카오톡 플로팅 상담 버튼 */}
      <a
        href={KAKAO_CHAT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#FEE500] hover:bg-[#FDD800] text-[#191919] font-bold p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2 border border-black/5 transition transform hover:scale-105 active:scale-95"
      >
        <span className="text-lg">💬</span>
        <span className="text-xs sm:text-sm">카톡 상담</span>
      </a>

      {/* 3번 수정: 상담 및 기술 지원 전화번호 010-0000-0000 반영 */}
      <footer className="py-12 px-4 sm:px-6 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="text-base font-bold text-white mb-2">
              TH소프트 (TH SOFT)
            </div>
            <p className="leading-relaxed">
              대표자: 태현 | 대표 도메인: thsoft.co.kr
              <br />
              이메일: contact@thsoft.co.kr
              <br />
              고객센터: 010-0000-0000
            </p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-sm font-semibold text-white mb-1">상담 및 기술 지원</div>
            <div className="text-xl font-black text-sky-400 mb-2">
              010-0000-0000
            </div>
            <p className="text-slate-500">© TH소프트 (TH SOFT). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}