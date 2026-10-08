'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface SolutionPageProps {
  solutionData: any;
}

export default function SolutionPage({ solutionData }: SolutionPageProps) {
  if (!solutionData) return <div className="py-32 text-center">솔루션 정보를 불러오는 중입니다...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
      {/* 1. 솔루션 히어로 섹션: 강렬한 첫인상 */}
      <section className="py-32 px-4 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.span 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-6 block"
          >
            Our Solution
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter"
          >
            {solutionData.title || '솔루션 제목을 입력하세요'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl font-light"
          >
            {solutionData.description || '해당 솔루션이 제공하는 핵심 가치와 고객이 얻을 수 있는 이점을 상세히 기술합니다.'}
          </motion.p>
        </div>
      </section>

      {/* 2. 핵심 특징 섹션: 3단 그리드 레이아웃 */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tighter">Core Features</h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div 
                key={item}
                whileHover={{ y: -10 }}
                className="p-10 bg-slate-50 rounded-3xl border border-slate-100 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold mb-6 text-xl">
                  0{item}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">핵심 강점 {item}</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  솔루션의 구체적인 기능이나 장점을 설명합니다. 고객이 왜 이 서비스를 선택해야 하는지 설득력 있게 작성합니다.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 하단 CTA 섹션: 문의 유도 */}
      <section className="py-24 px-4 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">지금 바로 최적의 솔루션을 경험하세요</h2>
          <button 
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            className="px-10 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
          >
            문의하기
          </button>
        </div>
      </section>
    </motion.div>
  );
}