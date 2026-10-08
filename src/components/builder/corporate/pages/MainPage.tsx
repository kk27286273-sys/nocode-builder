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
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center text-white overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          {hero?.mediaUrl ? (
            <img src={hero.mediaUrl} alt="hero" className="w-full h-full object-cover brightness-50" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
          )}
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <motion.span 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
            className="inline-block px-4 py-1.5 rounded-full bg-blue-600 text-sm font-bold mb-8 uppercase tracking-wider"
          >
            {hero?.badge || 'Global Standard'}
          </motion.span>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} 
            className="text-5xl md:text-7xl font-black mb-8 leading-tight whitespace-pre-line tracking-tighter"
          >
            {hero?.title || '미래를 선도하는 기술력'}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} 
            className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed whitespace-pre-line font-light"
          >
            {hero?.subtitle || '최고의 솔루션으로 고객의 가치를 실현합니다.'}
          </motion.p>
        </div>
      </section>

      {/* Core Business Section */}
      <section className="py-32 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Core Business</h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {solutions?.map((sol: any, idx: number) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -15 }}
                onClick={() => navigateTo('sol_detail')}
                className="bg-slate-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-slate-100"
              >
                <div className="h-64 overflow-hidden bg-slate-200">
                  {sol.image ? (
                    <img src={sol.image} alt={sol.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                </div>
                <div className="p-10">
                  <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">{sol.category}</span>
                  <h3 className="text-2xl font-bold mt-3 mb-4 text-slate-900">{sol.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-light">{sol.description}</p>
                  <div className="mt-8 text-blue-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                    자세히 보기 <span className="text-xl">&rarr;</span>
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