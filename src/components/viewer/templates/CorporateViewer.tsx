'use client';

import React, { useState } from 'react';
import { SiteData } from '@/types/template';
import { motion, AnimatePresence } from 'framer-motion';

export const CorporateViewer = ({ data }: { data: SiteData }) => {
  const { company, specifics } = data;
  const corpData = specifics as any;
  
  const [selectedArea, setSelectedArea] = useState<any>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // [전략적 CSS] 가변 폰트 및 반응형 스타일 상수
  const styles = {
    title: "text-[clamp(1.75rem,5vw,3rem)] font-extrabold leading-tight tracking-tight mb-6 break-keep",
    subtitle: "text-[clamp(1rem,2vw,1.25rem)] leading-relaxed break-keep",
    body: "text-[clamp(0.9rem,1.5vw,1.1rem)] leading-relaxed text-slate-600 break-keep",
    sectionTitle: "text-[clamp(1.5rem,4vw,2.25rem)] font-bold text-center mb-16",
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 scroll-smooth overflow-x-hidden">
      {/* GNB: 블러 효과 및 모바일 최적화 */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-5 md:px-10 py-4 flex justify-between items-center">
        <img src={company.logoUrl} alt="logo" className="h-7 md:h-8 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <button onClick={() => scrollToSection('about')} className="hover:text-sky-600 transition">회사소개</button>
          <button onClick={() => scrollToSection('business')} className="hover:text-sky-600 transition">사업영역</button>
          <button onClick={() => scrollToSection('history')} className="hover:text-sky-600 transition">연혁</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-sky-600 transition">문의하기</button>
        </div>
      </nav>

      {/* 히어로 섹션: 텍스트 밀림 방지 및 가독성 강화 */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
        <img src={corpData.hero?.mediaUrl} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="hero" />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 bg-sky-600 text-xs font-bold rounded-full mb-4"
          >
            {corpData.hero?.badge}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className={`${styles.title} text-white`}
          >
            {corpData.hero?.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className={`${styles.subtitle} text-slate-300 max-w-2xl mx-auto`}
          >
            {corpData.hero?.subtitle}
          </motion.p>
        </div>
      </section>

      {/* 회사 소개 섹션 */}
      <section id="about" className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className={styles.sectionTitle}>About Us</h2>
        <p className={`${styles.body} whitespace-pre-wrap`}>{corpData.about?.greeting}</p>
      </section>

      {/* 사업 영역 섹션: 호버 인터랙션 및 그리드 최적화 */}
      <section id="business" className="py-20 bg-slate-50 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className={styles.sectionTitle}>Our Business</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {corpData.businessAreas?.map((area: any, idx: number) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -5 }}
                onClick={() => setSelectedArea(area)}
                className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-200 flex flex-col md:flex-row cursor-pointer hover:border-sky-500 transition-all group"
              >
                <img src={area.image} className="w-full md:w-1/3 h-56 md:h-auto object-cover group-hover:scale-105 transition duration-500" alt={area.title} />
                <div className="p-8 flex-1">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-sky-600 transition">{area.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">{area.description}</p>
                  <span className="text-xs font-bold text-sky-600 inline-flex items-center gap-1">자세히 보기 <span className="group-hover:translate-x-1 transition-transform">→</span></span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 상세 내용 오버레이 뷰어: 쫀득한 애니메이션 추가 */}
      <AnimatePresence>
        {selectedArea && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedArea(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-3xl rounded-[2rem] overflow-hidden shadow-2xl" 
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-64 md:h-80">
                <img src={selectedArea.image} className="w-full h-full object-cover" alt={selectedArea.title} />
                <button onClick={() => setSelectedArea(null)} className="absolute top-5 right-5 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full flex items-center justify-center text-xl font-bold transition">✕</button>
              </div>
              <div className="p-8 md:p-12">
                <h3 className={`${styles.title} mb-4`}>{selectedArea.title}</h3>
                <p className={`${styles.body} mb-8`}>{selectedArea.fullDescription || selectedArea.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedArea.details?.map((d: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-sky-600 font-bold">✓</span>
                      <span className="text-sm text-slate-700 break-keep">{d}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setSelectedArea(null)} className="w-full mt-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95">닫기</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 연혁 섹션: 모바일 여백 및 포인트 디자인 최적화 */}
      <section id="history" className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className={styles.sectionTitle}>History</h2>
        <div className="space-y-12 border-l-2 border-slate-200 pl-8 ml-2 md:ml-4">
          {corpData.history?.map((item: any, idx: number) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[41px] top-1 w-4 h-4 bg-sky-600 rounded-full border-4 border-white shadow-sm"></div>
              <span className="text-sm font-bold text-sky-600">{item.year}</span>
              <h4 className="text-lg font-bold mt-1">{item.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 문의 섹션 */}
      <section id="contact" className="py-24 bg-slate-900 text-white px-6 text-center">
        <h2 className={styles.sectionTitle + " text-white"}>Contact Us</h2>
        <p className={`${styles.subtitle} text-slate-400 mb-12 max-w-xl mx-auto`}>전문가와 상담하여 최적의 솔루션을 찾아보세요.</p>
        <button className="px-10 py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-full transition-all shadow-xl hover:scale-105 active:scale-95">문의하기 신청</button>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center text-xs border-t border-slate-800">
        <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
      </footer>
    </div>
  );
};