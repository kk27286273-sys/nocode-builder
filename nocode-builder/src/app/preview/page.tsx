'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { defaultB2BTemplate, B2BTemplateData } from '@/data/templates';

function PreviewContent() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get('siteId');
  const [data, setData] = useState<B2BTemplateData>(defaultB2BTemplate);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });

  useEffect(() => {
    async function loadSiteData() {
      try {
        if (siteId) {
          // 서버 API를 통해 데이터를 가져옵니다. (보안 및 401 에러 해결)
          const response = await fetch(`/api/site-data?siteId=${siteId}`);
          if (response.ok) {
            const dbData = await response.json();
            setData(dbData);
            return;
          }
        }
        setData(defaultB2BTemplate);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
        setData(defaultB2BTemplate);
      }
    }
    loadSiteData();
  }, [siteId]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const targetSiteId = siteId || 'thsoft-default';
      const response = await fetch('/api/sites/publish', {
        method: 'POST',
        body: JSON.stringify({ 
          id: targetSiteId, 
          name: formData.name, 
          phone: formData.phone, 
          message: formData.message 
        }),
      });
      if (!response.ok) throw new Error('접수 실패');
      alert('견적 상담 신청이 정상 접수되었습니다.');
      setFormData({ name: '', phone: '', message: '' });
    } catch (err) {
      alert('접수 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const supportPhone = data?.supportPhone || '010-0000-0000';
  const themeColor = data?.themeColor || '#0284C7';
  const fs = data?.fontSizes || {};

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans relative selection:bg-sky-600 selection:text-white">
      <header className="h-16 sm:h-20 border-b border-slate-100 px-4 sm:px-8 flex items-center justify-between bg-white/95 backdrop-blur sticky top-0 z-40">
        <div className="flex items-center justify-center md:justify-start min-w-0 overflow-hidden">
          {data?.company?.logoUrl ? (
            <div className="w-[120px] sm:w-[150px] shrink-0 flex items-center justify-start">
              <img src={data.company.logoUrl} alt="Logo" className="h-8 sm:h-10 w-auto max-w-full object-contain" />
            </div>
          ) : (
            <span style={{ fontSize: `${fs.companyName || 22}px` }} className="font-extrabold tracking-tight text-slate-900 truncate">
              {data?.company?.name || ''}
            </span>
          )}
        </div>
        <nav className="hidden md:flex items-center gap-6 shrink-0">
          {data?.navigation?.navLinks?.map((nav, idx) => (
            <a key={idx} href={`#${nav.targetId}`} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap">{nav.label}</a>
          ))}
          <a href={`tel:${supportPhone}`} style={{ backgroundColor: themeColor }} className="text-white text-sm font-bold px-5 py-2.5 rounded-full shadow hover:opacity-95 transition whitespace-nowrap flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1v3.5a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z" /></svg>
            상담 문의
          </a>
        </nav>
      </header>
      <section className="relative py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 -z-10" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            {data?.hero?.badge && (
              <div style={{ color: themeColor, backgroundColor: `${themeColor}20`, borderColor: `${themeColor}40` }} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-bold">
                <span style={{ backgroundColor: themeColor }} className="w-2 h-2 rounded-full animate-pulse" />
                {data.hero.badge}
              </div>
            )}
            <h1 style={{ fontSize: `${fs.heroTitle || 38}px` }} className="font-black tracking-tight leading-[1.25] text-white whitespace-pre-line">{data?.hero?.title}</h1>
            <p style={{ fontSize: `${fs.heroSubtitle || 17}px` }} className="text-slate-300 font-normal leading-relaxed max-w-xl">{data?.hero?.subtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-300 font-semibold">
              <div className="flex items-center gap-2"><span style={{ color: themeColor }} className="font-bold">✓</span><span>100% 본사 직영 정밀 시공 체계</span></div>
              <div className="flex items-center gap-2"><span style={{ color: themeColor }} className="font-bold">✓</span><span>공기 준수율 99.8% 달성</span></div>
              <div className="flex items-center gap-2"><span style={{ color: themeColor }} className="font-bold">✓</span><span>현장 정밀 실측 및 다이렉트 견적</span></div>
              <div className="flex items-center gap-2"><span style={{ color: themeColor }} className="font-bold">✓</span><span>사후 무상 A/S 책임 보증제</span></div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <a href="#contact-form" style={{ backgroundColor: themeColor }} className="w-full sm:w-auto px-8 py-4 text-white font-bold rounded-xl shadow-lg hover:opacity-95 transition text-center text-sm sm:text-base cursor-pointer">도면 검토 & 빠른 견적 신청</a>
              <a href={`tel:${supportPhone}`} className="w-full sm:w-auto px-6 py-4 bg-slate-800/90 hover:bg-slate-700 text-white font-bold rounded-xl transition border border-slate-700 text-center flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1v3.5a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z" /></svg>
                <span>엔지니어 직통 전화 연결</span>
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-800 aspect-[4/3] lg:aspect-[4/4]">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80" alt="현장" className="w-full h-full object-cover brightness-90 hover:scale-105 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur border border-slate-700 px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-white">최신 정밀 설비 가동 중</span>
              </div>
              <div className="absolute bottom-4 right-4 left-4 bg-slate-900/95 backdrop-blur-md border border-slate-700/90 p-4 rounded-2xl shadow-xl flex items-center justify-between">
                <div><div className="text-[11px] text-slate-400 font-semibold">누적 시공·개발 실적</div><div className="text-xl font-black text-white mt-0.5">2,850건+</div></div>
                <div className="h-8 w-px bg-slate-700" />
                <div><div className="text-[11px] text-slate-400 font-semibold">평균 납기 준수율</div><div style={{ color: themeColor }} className="text-xl font-black mt-0.5">99.8%</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {data?.partnersSection?.enabled && (
        <section className="py-10 border-y border-slate-100 bg-slate-50/50 px-8 text-center">
          <h2 style={{ fontSize: `${fs.partnersTitle || 15}px` }} className="font-semibold text-slate-500 mb-6">{data.partnersSection.title}</h2>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {data.partnersSection.partners.map((partner, idx) => (
              <span key={idx} className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">{partner}</span>
            ))}
          </div>
        </section>
      )}
      {data?.stats && (
        <section id="stats" className="py-20 px-8 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {data.stats.map((stat, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <div style={{ color: themeColor, fontSize: `${fs.statsValue || 36}px` }} className="font-black mb-2">{stat.value}</div>
                <div style={{ fontSize: `${fs.statsLabel || 14}px` }} className="font-medium text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}
      {data?.solutions && (
        <section id="solutions" className="py-24 px-8 bg-slate-50/30">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <h2 style={{ fontSize: `${fs.sectionTitle || 30}px` }} className="font-bold text-slate-900 mb-4">{data.solutionsSection?.title || ''}</h2>
            <p style={{ fontSize: `${fs.sectionSubtitle || 16}px` }} className="text-slate-600">{data.solutionsSection?.subtitle}</p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.solutions.map((sol, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition">
                <div style={{ backgroundColor: `${themeColor}20` }} className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 font-bold text-lg">0{idx + 1}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{sol.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{sol.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {data?.reviews && (
        <section id="reviews" className="py-24 px-8 bg-white border-t border-slate-100">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <h2 style={{ fontSize: `${fs.sectionTitle || 30}px` }} className="font-bold text-slate-900 mb-4">{data.reviewsSection?.title || ''}</h2>
            <p style={{ fontSize: `${fs.sectionSubtitle || 16}px` }} className="text-slate-600">{data.reviewsSection?.subtitle}</p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.reviews.map((rev, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
                <p className="text-slate-700 leading-relaxed mb-6 italic">"{rev.content}"</p>
                <div className="flex justify-between items-center">
                  <div className="font-bold text-slate-900">{rev.author}</div>
                  <div className="text-xs text-slate-500">{rev.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {data?.faqs && (
        <section className="py-24 px-8 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-3xl mx-auto">
            <h2 style={{ fontSize: `${fs.sectionTitle || 30}px` }} className="font-bold text-slate-900 text-center mb-12">자주 묻는 질문 (FAQ)</h2>
            <div className="space-y-4">
              {data.faqs.map((faq, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 style={{ fontSize: `${fs.faqQuestion || 18}px` }} className="font-bold text-slate-900 mb-2 flex items-center gap-2"><span style={{ color: themeColor }}>Q.</span>{faq.question}</h3>
                  <p style={{ fontSize: `${fs.faqAnswer || 15}px` }} className="text-slate-600 leading-relaxed pl-6">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <section id="contact-form" className="py-24 px-8 bg-white border-t border-slate-100">
        <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200/80 rounded-2xl p-8 md:p-10 shadow-sm">
          <div className="text-center mb-8">
            <span style={{ color: themeColor }} className="text-xs font-bold tracking-wider uppercase mb-2 block">Online Inquiry</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">빠른 견적 및 현장 실측 신청</h2>
            <p className="text-sm text-slate-600">문의 내용을 남겨주시면 확인 후 담당자가 신속히 연락드립니다.</p>
          </div>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div><label className="block text-xs font-bold text-slate-700 mb-1.5">성함 / 담당자명 <span className="text-red-500">*</span></label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="홍길동" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div><label className="block text-xs font-bold text-slate-700 mb-1.5">연락처 <span className="text-red-500">*</span></label>
              <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="010-1234-5678" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div><label className="block text-xs font-bold text-slate-700 mb-1.5">시공 및 견적 문의 내용 <span className="text-red-500">*</span></label>
              <textarea rows={4} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="시공 장소, 희망 일정, 면적 등 상세 내용을 입력하세요." className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-s-500 resize-none" />
            </div>
            <div className="pt-2 pb-1">
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-500 leading-relaxed mb-2.5 max-h-24 overflow-y-auto">
                <strong>[개인정보 수집 및 이용 안내]</strong><br />1. 수집 항목: 성함, 연락처, 문의 내용<br />2. 수집 목적: 견적 상담 응대 및 현장 방문 일정 안내<br />3. 보유 기간: 문의 처리 완료 후 1년간 보관 후 파기
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input type="checkbox" required className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer" />
                <span><span className="text-red-500">[필수]</span> 개인정보 수집 및 이용에 동의합니다.</span>
              </label>
            </div>
            <button type="submit" disabled={isSubmitting} style={{ backgroundColor: themeColor }} className="w-full py-3.5 text-white font-bold text-sm rounded-xl shadow-md hover:opacity-95 transition mt-2 cursor-pointer disabled:opacity-50">
              {isSubmitting ? '견적 신청 등록 중...' : '무료 견적 상담 신청하기'}
            </button>
          </form>
        </div>
      </section>
      <footer className="py-12 px-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="text-base font-bold text-white mb-2">{data?.footer?.companyName || ''}</div>
            <p className="leading-relaxed">대표자: {data?.footer?.ownerName || ''} | 사업자등록번호: {data?.footer?.businessNumber || ''}<br />주소: {data?.footer?.address || ''}<br />이메일: {data?.footer?.contactEmail || ''}</p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-sm font-semibold text-white mb-1">상담 및 문의</div>
            <div style={{ color: themeColor }} className="text-xl font-black mb-2">{supportPhone}</div>
            <p className="text-slate-500">© {data?.footer?.companyName || ''}. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <a href={`tel:${supportPhone}`} style={{ backgroundColor: themeColor }} className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 text-white rounded-full shadow-2xl transition duration-300 hover:scale-110 active:scale-95" title="전화 바로 연결">
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1v3.5a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z" /></svg>
      </a>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-sm font-bold text-slate-500">페이지 로딩 중...</div>}>
      <PreviewContent />
    </Suspense>
  );
}