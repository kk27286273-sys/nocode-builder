'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { B2BTemplateData } from '@/data/templates';

export default function ViewerClient({ siteId }: { siteId: string }) {
  const [data, setData] = useState<B2BTemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from('sites')
      .select('content')
      .eq('id', siteId)
      .single()
      .then(({ data: record, error }) => {
        if (!error && record?.content) {
          setData(record.content);
        }
        setLoading(false);
      });
  }, [siteId]);

  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setIsSidebarOpen(false);
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('성함과 연락처를 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, name, phone, message }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      alert('상담 문의가 성공적으로 접수되었습니다. 곧 연락드리겠습니다.');
      setName('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      alert(err.message || '접수 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-sm text-slate-500 font-medium">
        페이지를 불러오는 중입니다...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-sm text-slate-500 font-medium">
        존재하지 않거나 비공개된 사이트입니다.
      </div>
    );
  }

  const themeColor = data.themeColor || '#2563EB';
  const supportPhone = data.supportPhone || '1588-0000';
  const navLinks = data.navigation?.navLinks || [
    { label: '실적 지표', targetId: 'stats' },
    { label: '솔루션 라인업', targetId: 'solutions' },
    { label: '고객 후기', targetId: 'reviews' },
    { label: '자주 묻는 질문', targetId: 'faqs' },
  ];

  return (
    <div id="top" className="min-h-screen bg-white text-slate-900 font-sans scroll-smooth relative selection:bg-blue-500 selection:text-white">
      {/* 1. GNB */}
      <header className="h-16 md:h-20 border-b border-slate-100 flex items-center justify-between px-6 md:px-12 bg-white/90 backdrop-blur-md sticky top-0 z-40 transition-all">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="카테고리 열기"
            className="md:hidden p-2 -ml-2 text-slate-700 hover:text-black focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <a
            href="#top"
            onClick={(e) => scrollToSection(e, 'top')}
            className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 hover:opacity-85 transition flex items-center gap-2"
          >
            {data.company?.logoUrl && (
              <img src={data.company.logoUrl} alt="logo" className="h-8 w-auto object-contain" />
            )}
            <span>{data.company?.name || '기업명'}</span>
          </a>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={`#${link.targetId}`}
              onClick={(e) => scrollToSection(e, link.targetId)}
              className="hover:text-slate-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${supportPhone}`}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>고객센터 {supportPhone}</span>
          </a>

          <button
            onClick={(e) => scrollToSection(e, 'contact')}
            style={{ backgroundColor: themeColor }}
            className="px-5 py-2.5 text-white rounded-xl text-xs md:text-sm font-bold transition-all shadow-md shadow-blue-500/20 hover:opacity-95 hover:shadow-lg cursor-pointer"
          >
            상담 신청
          </button>
        </div>
      </header>

      {/* 2. 모바일 카테고리 드로어 */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[80%] bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
                <span className="font-bold text-base text-slate-900">{data.company?.name || '카테고리'}</span>
                <button onClick={() => setIsSidebarOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col space-y-3 text-sm font-semibold text-slate-700">
                {navLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={`#${link.targetId}`}
                    onClick={(e) => scrollToSection(e, link.targetId)}
                    className="p-2.5 rounded-xl hover:bg-slate-50 transition"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={(e) => scrollToSection(e, 'contact')}
                  className="p-2.5 rounded-xl hover:bg-blue-50 transition text-blue-600 font-bold"
                >
                  📝 프로젝트 상담 신청
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <a
                href={`tel:${supportPhone}`}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-800 transition"
              >
                📞 고객센터 바로 연결
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 메인 히어로 영역 */}
      <section className="relative py-24 md:py-36 bg-gradient-to-b from-slate-50 via-white to-slate-50 text-center px-6 overflow-hidden">
        {/* 애니메이션 1: 배경 앰비언트 글로우 오브 */}
        <div
          style={{ backgroundColor: themeColor }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 md:w-96 h-80 md:h-96 rounded-full blur-[120px] opacity-15 pointer-events-none animate-pulse"
        />

        {/* 은은한 격자 배경 */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* 애니메이션 2: 펄싱 배지 캡슐 */}
          <span
            style={{ color: themeColor, borderColor: `${themeColor}33`, backgroundColor: `${themeColor}10` }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider mb-6 border shadow-sm transition-transform hover:scale-105 duration-300"
          >
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: themeColor }} />
            {data.hero?.badge || 'Enterprise Solution'}
          </span>

          <h1 className="text-3xl md:text-6xl font-black text-slate-900 mb-6 whitespace-pre-line tracking-tight leading-[1.15]">
            {data.hero?.title}
          </h1>
          <p className="text-base md:text-xl text-slate-600 mb-10 whitespace-pre-line max-w-2xl mx-auto leading-relaxed font-normal">
            {data.hero?.subtitle}
          </p>

          {/* [2번 개선] 엠보싱 쉐도우 & 호버 인터랙션 CTA 버튼 */}
          <div className="flex flex-wrap justify-center gap-4 mb-14">
            <button
              onClick={(e) => scrollToSection(e, 'contact')}
              style={{
                backgroundColor: themeColor,
                boxShadow: `0 10px 25px -5px ${themeColor}55, 0 8px 10px -6px ${themeColor}33`,
              }}
              className="px-8 py-4 text-white font-extrabold rounded-xl text-sm md:text-base transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 cursor-pointer inline-flex items-center gap-2"
            >
              무료 컨설팅 신청하기
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button
              onClick={(e) => scrollToSection(e, 'solutions')}
              className="px-8 py-4 bg-white/90 backdrop-blur border border-slate-300 text-slate-800 font-extrabold rounded-xl text-sm md:text-base hover:bg-slate-50 hover:border-slate-400 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:translate-y-0 cursor-pointer"
            >
              솔루션 살펴보기
            </button>
          </div>

          {/* 애니메이션 4: 부유하는 그래픽 배너 */}
          {data.hero?.mediaUrl && (
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-100 transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
              <img src={data.hero.mediaUrl} alt="Hero Banner" className="w-full h-auto max-h-[500px] object-cover" />
            </div>
          )}
        </div>
      </section>

      {/* 파트너사 */}
      {data.partnersSection?.enabled && (data.partnersSection?.partners || []).length > 0 && (
        <section className="py-12 bg-white border-b border-slate-100 text-center px-4">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">
            {data.partnersSection.title}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-slate-500 font-bold text-sm tracking-tight">
            {data.partnersSection.partners.map((partner, i) => (
              <span key={i} className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors">
                {partner}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 실적 지표 섹션 */}
      {data.stats && data.stats.length > 0 && (
        <section id="stats" className="py-20 bg-slate-50/60 border-b border-slate-100 px-6">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-center max-w-5xl mx-auto">
            {data.stats.map((st, i) => (
              <div key={i} className="flex-1 min-w-[220px] p-8 bg-white rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow">
                <div style={{ color: themeColor }} className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
                  {st.value}
                </div>
                <div className="text-xs md:text-sm text-slate-500 font-bold">{st.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 솔루션 섹션 */}
      {data.solutions && data.solutions.length > 0 && (
        <section id="solutions" className="py-28 px-6 bg-white border-b border-slate-100">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
              {data.solutionsSection?.title || '신뢰할 수 있는 전용 솔루션 라인업'}
            </h2>
            <p className="text-sm md:text-base text-slate-500 font-normal">
              {data.solutionsSection?.subtitle || '기업 비즈니스 성장에 최적화된 서비스'}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
            {data.solutions.map((item, idx) => (
              <div
                key={idx}
                className="w-full sm:w-84 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                {item.image ? (
                  <div className="h-48 bg-slate-100 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-300">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                )}
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 후기 */}
      {data.reviews && data.reviews.length > 0 && (
        <section id="reviews" className="py-28 px-6 bg-slate-50/60 border-b border-slate-100">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
              {data.reviewsSection?.title || '고객사 성공 후기'}
            </h2>
            <p className="text-sm md:text-base text-slate-500 font-normal">
              {data.reviewsSection?.subtitle || '실제 서비스를 도입한 기업들의 평가입니다.'}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
            {data.reviews.map((rev, idx) => (
              <div
                key={idx}
                className="w-full sm:w-84 bg-white p-8 rounded-2xl border border-slate-200/80 flex flex-col justify-between shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <p className="text-sm text-slate-700 italic mb-8 leading-relaxed font-normal">
                  "{rev.content}"
                </p>
                <div className="pt-4 border-t border-slate-100">
                  <p className="font-bold text-slate-900 text-sm">{rev.author}</p>
                  <p className="text-xs text-slate-400 font-semibold">{rev.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {data.faqs && data.faqs.length > 0 && (
        <section id="faqs" className="py-28 px-6 bg-white border-b border-slate-100">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">자주 묻는 질문</h2>
              <p className="text-sm md:text-base text-slate-500">도입 전 궁금하신 점을 확인하세요.</p>
            </div>
            <div className="space-y-4">
              {data.faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-50 p-7 rounded-2xl border border-slate-200/70">
                  <h3 className="font-bold text-base text-slate-900 mb-2">{faq.question}</h3>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 상담 신청 리드 폼 */}
      <section id="contact" className="py-28 px-6 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-lg mx-auto text-center bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight">프로젝트 상담 신청</h2>
          <p className="text-xs md:text-sm text-slate-500 mb-8">담당 컨설턴트가 24시간 이내 연락드립니다.</p>
          <form onSubmit={handleSubmitLead} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">성함 / 직함 *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동 팀장"
                className="w-full p-3.5 border rounded-xl text-sm border-slate-300 focus:outline-none focus:border-blue-600 transition"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">연락처 *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678"
                className="w-full p-3.5 border rounded-xl text-sm border-slate-300 focus:outline-none focus:border-blue-600 transition"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">문의 내용</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="문의 사항이나 도입 희망 일정을 적어주세요."
                className="w-full p-3.5 border rounded-xl text-sm border-slate-300 focus:outline-none focus:border-blue-600 transition"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: themeColor,
                boxShadow: `0 10px 25px -5px ${themeColor}55, 0 8px 10px -6px ${themeColor}33`,
              }}
              className="w-full py-4 text-white font-extrabold rounded-xl text-sm md:text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? '신청 접수 중...' : '상담 신청 완료하기'}
            </button>
          </form>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-6 md:px-12 text-xs">
        <div className="max-w-6xl mx-auto">
          <span className="text-white font-bold text-base block mb-4 tracking-tight">
            {data.footer?.companyName || data.company?.name}
          </span>
          <div className="border-t border-slate-800/80 pt-6 space-y-2 leading-relaxed font-normal">
            <p>대표자: {data.footer?.ownerName} | 사업자등록번호: {data.footer?.businessNumber}</p>
            <p>주소: {data.footer?.address}</p>
            <p>이메일: {data.footer?.contactEmail} | 고객센터: {data.supportPhone}</p>
            <p className="pt-4 text-slate-500">
              © {new Date().getFullYear()} {data.footer?.companyName || data.company?.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* 우측 하단 플로팅 고객센터 버튼 */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href={`tel:${supportPhone}`}
          style={{ backgroundColor: themeColor }}
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-full text-white shadow-2xl hover:scale-105 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="text-xs font-bold hidden sm:inline">고객센터 {supportPhone}</span>
        </a>
      </div>
    </div>
  );
}