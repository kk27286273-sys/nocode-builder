'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface MainPageProps {
  hero: any;
  solutions: any[];
  navigateTo: (id: string, index?: number) => void; // index 인자 추가
}

export default function MainPage({ hero, solutions, navigateTo }: MainPageProps) {
  return (
    <div className="w-full">
      {/* 히어로 섹션 */}
      <section className="relative h-[80vh] flex items-center justify-center bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50 z-10" />
        <div className="relative z-20 text-center px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full bg-blue-600 text-xs font-bold mb-6"
          >
            {hero?.badge || 'BRAND NEW'}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight"
          >
            {hero?.title || '기업의 미래를 설계합니다'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed"
          >
            {hero?.subtitle || '최고의 기술력과 경험으로 최적의 솔루션을 제공합니다.'}
          </motion.p>
        </div>
      </section>

      {/* 솔루션 리스트 섹션 */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Our Solutions</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {solutions?.map((sol, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -15 }}
                onClick={() => navigateTo('sol_detail', index)} // ⬅️ 여기서 index를 정확히 전달해야 함
                className="group cursor-pointer p-10 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-xl"
              >
                <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center text-blue-600 font-bold text-xl mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  0{index + 1}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {sol.title || `솔루션 ${index + 1}`}
                </h3>
                <p className="text-slate-600 leading-relaxed font-light line-clamp-3">
                  {sol.description || '솔루션에 대한 상세 설명이 여기에 표시됩니다.'}
                </p>
                <div className="mt-8 flex items-center text-blue-600 font-bold text-sm group-hover:gap-3 transition-all duration-300 gap-2">
                  상세보기 <span>→</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}