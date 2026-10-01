'use client';

import React, { useState } from 'react';
import { B2BTemplateData } from '@/data/templates';

interface ViewerClientProps {
  data: B2BTemplateData;
}

export default function ViewerClient({ data }: ViewerClientProps) {
  const fs = data?.fontSizes || {};
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAgreed) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }
    setIsSubmitting(true);
    // 상담 신청 완료 처리
    setTimeout(() => {
      alert('상담 및 견적 문의가 정상적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
      setFormData({ name: '', phone: '', message: '' });
      setPrivacyAgreed(false);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* 상단 네비게이션 바 (GNB) */}
      <header className="h-20 border-b border-slate-100 px-6 md:px-12 flex items-center justify-between bg-white/90 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {data?.company?.logoUrl && (
            <img
              src={data.company.logoUrl}
              alt="Logo"
              className="h-10 w-auto object-contain"
            />
          )}
          <span
            style={{ fontSize: `${fs.companyName || 20}px` }}
            className="font-extrabold tracking-tight text-slate-900"
          >
            {data?.company?.name || '기업명'}
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {data?.navigation?.navLinks?.map((nav, idx) => (
            <a
              key={idx}
              href={`#${nav.targetId}`}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              {nav.label}
            </a>
          ))}
          <a
            href={`tel:${data?.supportPhone}`}
            style={{ backgroundColor: data?.themeColor || '#0284C7' }}
            className="text-white text-sm font-bold px-5 py-2.5 rounded-full shadow hover:opacity-95 transition"
          >
            전화 상담 문의
          </a>
        </nav>
      </header>

      {/* 메인 히어로 섹션 */}
      <section className="py-20 md:py-28 px-6 text-center bg-gradient-to-b from-slate-50 to-white flex flex-col items-center">
        {data?.hero?.badge && (
          <span
            style={{
              fontSize: `${fs.heroBadge || 14}px`,
              color: data.themeColor || '#0284C7',
              backgroundColor: `${data.themeColor || '#0284C7'}15`,
            }}
            className="font-bold px-4 py-1.5 rounded-full mb-6 inline-block"
          >
            {data.hero.badge}
          </span>
        )}
        <h1
          style={{ fontSize: `${fs.heroTitle || 36}px` }}
          className="font-extrabold text-slate-900 leading-tight mb-6 whitespace-pre-line tracking-tight max-w-4xl"
        >
          {data?.hero?.title}
        </h1>
        <p
          style={{ fontSize: `${fs.heroSubtitle || 18}px` }}
          className="text-slate-600 max-w-2xl leading-relaxed mb-10"
        >
          {data?.hero?.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#contact-form"
            style={{ backgroundColor: data?.themeColor || '#0284C7' }}
            className="w-full sm:w-auto text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:opacity-95 transition text-base"
          >
            무료 견적 신청하기
          </a>
          <a
            href={`tel:${data?.supportPhone}`}
            className="w-full sm:w-auto bg-white border border-slate-300 text-slate-700 font-bold px-8 py-4 rounded-xl shadow-sm hover:bg-slate-50 transition text-base"
          >
            전화 바로걸기
          </a>
        </div>
      </section>

      {/* 파트너사 및 인증 보증 섹션 */}
      {data?.partnersSection?.enabled && (
        <section className="py-12 border-y border-slate-100 bg-slate-50/60 px-6 text-center">
          <h2
            style={{ fontSize: `${fs.partnersTitle || 16}px` }}
            className="font-semibold text-slate-500 mb-6"
          >
            {data.partnersSection.title}
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 max-w-5xl mx-auto">
            {data.partnersSection.partners.map((partner, idx) => (
              <span
                key={idx}
                className="px-5 py-2.5 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm"
              >
                {partner}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 주요 실적 지표 섹션 */}
      <section id="stats" className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {data?.stats?.map((stat, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <div
                style={{
                  fontSize: `${fs.statsValue || 32}px`,
                  color: data.themeColor || '#0284C7',
                }}
                className="font-black mb-2"
              >
                {stat.value}
              </div>
              <div
                style={{ fontSize: `${fs.statsLabel || 14}px` }}
                className="font-medium text-slate-600"
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 핵심 솔루션 / 시공 분야 섹션 */}
      <section id="solutions" className="py-24 px-6 bg-slate-50/40">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2
            style={{ fontSize: `${fs.sectionTitle || 28}px` }}
            className="font-bold text-slate-900 mb-4"
          >
            {data?.solutionsSection?.title || '핵심 전문 분야'}
          </h2>
          <p
            style={{ fontSize: `${fs.sectionSubtitle || 16}px` }}
            className="text-slate-600"
          >
            {data?.solutionsSection?.subtitle}
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {data?.solutions?.map((sol, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition"
            >
              <div
                style={{ backgroundColor: `${data?.themeColor || '#0284C7'}20` }}
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 font-bold text-lg"
              >
                0{idx + 1}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{sol.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{sol.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 고객 후기 섹션 */}
      <section id="reviews" className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2
            style={{ fontSize: `${fs.sectionTitle || 28}px` }}
            className="font-bold text-slate-900 mb-4"
          >
            {data?.reviewsSection?.title || '실제 고객 만족 후기'}
          </h2>
          <p
            style={{ fontSize: `${fs.sectionSubtitle || 16}px` }}
            className="text-slate-600"
          >
            {data?.reviewsSection?.subtitle}
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {data?.reviews?.map((rev, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between"
            >
              <p className="text-slate-700 leading-relaxed mb-6 italic">"{rev.content}"</p>
              <div>
                <div className="font-bold text-slate-900">{rev.author}</div>
                <div className="text-xs text-slate-500">{rev.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 자주 묻는 질문 (FAQ) 섹션 */}
      <section id="faqs" className="py-24 px-6 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2
            style={{ fontSize: `${fs.sectionTitle || 28}px` }}
            className="font-bold text-slate-900 text-center mb-12"
          >
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            {data?.faqs?.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
              >
                <h3
                  style={{ fontSize: `${fs.faqQuestion || 18}px` }}
                  className="font-bold text-slate-900 mb-2 flex items-center gap-2"
                >
                  <span style={{ color: data?.themeColor || '#0284C7' }}>Q.</span>
                  {faq.question}
                </h3>
                <p
                  style={{ fontSize: `${fs.faqAnswer || 15}px` }}
                  className="text-slate-600 leading-relaxed pl-6"
                >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 빠른 견적 상담 신청 폼 (개인정보 수집 동의 포함) */}
      <section id="contact-form" className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-8 md:p-10 shadow-sm">
          <div className="text-center mb-8">
            <span
              style={{ color: data?.themeColor || '#0284C7' }}
              className="text-xs font-bold tracking-wider uppercase mb-2 block"
            >
              Online Inquiry
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
              빠른 견적 및 현장 실측 신청
            </h2>
            <p className="text-sm text-slate-600">
              문의 내용을 남겨주시면 확인 후 담당자가 신속히 연락드립니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                성함 / 담당자명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="홍길동"
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
                placeholder="010-1234-5678"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                시공 및 견적 문의 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="시공 장소(지역), 평수, 희망 일정 등 상세 내용을 적어주세요."
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              />
            </div>

            {/* 필수 개인정보 수집 및 이용 동의 */}
            <div className="pt-2 pb-1">
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-500 leading-relaxed mb-2.5 max-h-24 overflow-y-auto">
                <strong>[개인정보 수집 및 이용 안내]</strong><br />
                1. 수집 항목: 성함, 연락처, 문의 내용<br />
                2. 수집 목적: 견적 상담 응대 및 현장 방문 일정 안내<br />
                3. 보유 기간: 문의 처리 완료 후 1년간 보관 후 파기
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  required
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <span>
                  <span className="text-red-500">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: data?.themeColor || '#0284C7' }}
              className="w-full py-3.5 text-white font-bold text-sm rounded-xl shadow-md hover:opacity-95 disabled:opacity-50 transition mt-2 cursor-pointer"
            >
              {isSubmitting ? '접수 중...' : '무료 견적 상담 신청하기'}
            </button>
          </form>
        </div>
      </section>

      {/* 푸터 영역 */}
      <footer id="contact" className="py-12 px-6 md:px-12 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="text-base font-bold text-white mb-2">
              {data?.footer?.companyName || data?.company?.name}
            </div>
            <p className="leading-relaxed">
              대표자: {data?.footer?.ownerName} | 사업자등록번호: {data?.footer?.businessNumber}
              <br />
              주소: {data?.footer?.address}
              <br />
              이메일: {data?.footer?.contactEmail}
            </p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-sm font-semibold text-white mb-1">상담 및 문의</div>
            <div
              style={{ color: data?.themeColor || '#38BDF8' }}
              className="text-xl font-black mb-2"
            >
              {data?.supportPhone}
            </div>
            <p className="text-slate-500">© {data?.footer?.companyName || data?.company?.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}