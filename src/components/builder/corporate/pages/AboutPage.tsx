'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface AboutPageProps {
  corporateInfo: any;
  company: any; 
}

export default function AboutPage({ corporateInfo, company }: AboutPageProps) {
  // 데이터가 없을 때의 처리
  if (!corporateInfo) return <div className="py-32 text-center text-slate-500">회사 정보를 불러오는 중입니다...</div>;

  // [에디터 EditorSidebar.tsx 구조와 1:1 매칭]
  // 에디터 저장 경로: corporateInfo.about, corporateInfo.vision, corporateInfo.since
  const { about, vision, since } = corporateInfo;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full bg-white">
      {/* 1. Hero Section: 에디터의 about(소개글)을 메인 타이틀로 활용 */}
      <section className="relative py-24 md:py-32 px-4 bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-4 block"
          >
            Company Introduction
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tighter"
          >
            {about || '신뢰를 바탕으로 미래를 설계하는 기업'}
          </motion.h1>
        </div>
      </section>

      {/* 2. CEO Greeting: 에디터의 about(소개글)을 다시 한번 상세 내용으로 매칭 */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-slate-200 rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
              <img src={company?.logoUrl || 'https://via.placeholder.com/600x800'} alt="CEO" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-xl shadow-xl hidden md:block">
              <p className="text-sm font-medium opacity-80">Representative</p>
              <p className="text-xl font-bold">대표이사</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight tracking-tighter">
              {about || '최고의 기술력으로 고객의 가치를 실현하겠습니다.'}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed font-light break-keep">
              {about || '회사의 철학과 비전을 담은 인사말이 들어가는 자리입니다.'}
            </p>
            <div className="pt-4">
              <div className="w-12 h-1 bg-blue-600 mb-4"></div>
              <p className="text-xl font-bold text-slate-900">
                주식회사 {company?.name || '회사명'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Mission & Vision: 에디터의 vision 매칭 */}
      <section className="py-32 px-4 bg-[#0a192f] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tighter">Mission & Vision</h2>
            <p className="text-slate-400 font-light">우리가 나아갈 방향과 지향하는 핵심 가치입니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm"
            >
              <div className="text-blue-400 text-4xl font-black mb-6">01</div>
              <h3 className="text-2xl font-bold mb-4">Mission</h3>
              <p className="text-slate-300 leading-relaxed font-light break-keep">
                {vision || '기업의 존재 이유와 사회적 역할을 정의하는 미션 문구가 들어갑니다.'}
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm"
            >
              <div className="text-blue-400 text-4xl font-black mb-6">02</div>
              <h3 className="text-2xl font-bold mb-4">Vision</h3>
              <p className="text-slate-300 leading-relaxed font-light break-keep">
                {vision || '미래에 도달하고자 하는 목표와 지향점을 정의하는 비전 문구가 들어갑니다.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. History: 에디터에 history 배열이 없으므로 since(설립연도)를 기반으로 표시 */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-slate-900 mb-20 tracking-tighter">Company History</h2>
          {since ? (
            <div className="space-y-12 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-slate-200 md:before:left-1/2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="flex flex-col md:flex-row items-center gap-8 md:flex-row-reverse"
              >
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-sm z-10" />
                <div className="w-full md:w-1/2 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-blue-600 font-black text-xl">{since}</span>
                  <p className="text-slate-700 mt-2 font-medium">회사가 설립되었습니다.</p>
                </div>
                <div className="w-full md:w-1/2 hidden md:block"></div>
              </motion.div>
            </div>
          ) : (
            <div className="text-center text-slate-400">등록된 연혁 정보가 없습니다.</div>
          )}
        </div>
      </section>
    </motion.div>
  );
}