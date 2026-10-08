'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface MainPageProps {
  hero: any;
  solutions: any[];
  navigateTo: (id: string) => void;
}

export default function MainPage({ hero, solutions, navigateTo }: MainPageProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
      {/* Hero Section: 에이텍 특유의 압도적 스케일 */}
      <section className="relative h-[90vh] flex items-center justify-center text-white overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          {hero?.mediaUrl ? (
            <img src={hero.mediaUrl} alt="hero" className="w-full h-full object-cover brightness-[0.4]" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
          )}
        </div>
        <div className="relative z-10 text-center px-4 max-w-6xl">
          <motion.span 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
            className="inline-block px-5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold mb-8 uppercase tracking-[0.2em] shadow-lg"
          >
            {hero?.badge || 'Global Standard'}
          </motion.span>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} 
            className="text-6xl md:text-8xl font-black mb-10 leading-[1.1] whitespace-pre-line tracking-tighter"
          >
            {hero?.title || '미래를 선도하는\n기술력의 정점'}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} 
            className="text-xl md:text-3xl text-slate-200 max-w-4xl mx-auto leading-relaxed whitespace-pre-line font-extralight opacity-90"
          >
            {hero?.subtitle || '최고의 솔루션으로 고객의 가치를 실현하는 기업'}
          </motion.p>
        </div>
      </section>

      {/* Core Business Section: 갤러리 형태의 전문 배치 */}
      <section className="py-40 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-24">
            <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">Core Business</h2>
            <div className="w-20 h-1.5 bg-blue-600"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {solutions?.map((sol: any, idx: number) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -20 }}
                onClick={() => navigateTo('sol_detail')}
                className="group cursor-pointer"
              >
                <div className="relative h-80 overflow-hidden rounded-2xl shadow-xl mb-8 bg-slate-200">
                  {sol.image ? (
                    <img src={sol.image} alt={sol.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="px-2">
                  <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">{sol.category}</span>
                  <h3 className="text-3xl font-bold mt-3 mb-4 text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{sol.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-light text-lg">{sol.description}</p>
                  <div className="mt-8 flex items-center gap-2 text-slate-900 font-bold group-hover:gap-4 transition-all duration-300">
                    <span>자세히 보기</span> <span className="text-2xl">&rarr;</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}