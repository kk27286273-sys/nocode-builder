'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface SolutionPageProps {
  solutionData: any;
}

export default function SolutionPage({ solutionData }: SolutionPageProps) {
  // 데이터가 아예 없을 때의 렌더링 방지
  if (!solutionData) return <div className="py-32 text-center text-slate-500 font-light">데이터를 불러오는 중입니다...</div>;

  // 에디터에서 추가/삭제한 features 배열을 그대로 사용, 없으면 기본값
  const features = solutionData.features || [
    { title: '효율적인 프로세스', description: '업무 최적화를 통해 비용을 절감하고 생산성을 극대화합니다.' },
    { title: '강력한 보안성', description: '엔터프라이즈급 보안 표준을 적용하여 데이터를 안전하게 보호합니다.' },
    { title: '유연한 확장성', description: '비즈니스 성장에 맞춰 자유롭게 기능을 확장하고 통합할 수 있습니다.' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="w-full bg-white"
    >
      {/* 1. Hero Section */}
      <section className="relative py-32 md:py-48 px-4 bg-[#0a192f] text-white overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[70%] bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] bg-indigo-900/30 blur-[100px] rounded-full" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-blue-400 font-medium tracking-[0.2em] uppercase text-xs mb-6">
              Enterprise Solution
            </span>
            <h1 className="text-4xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tighter">
              {solutionData.title || '솔루션 제목을 입력하세요'}
            </h1>
            <p className="text-lg md:text-2xl text-slate-400 leading-relaxed max-w-3xl font-light break-keep">
              {solutionData.description || '해당 솔루션이 제공하는 핵심 가치와 고객이 얻을 수 있는 이점을 상세히 기술합니다.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Core Features */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tighter">
                핵심 역량과 <span className="text-blue-600">차별점</span>
              </h2>
              <p className="text-slate-500 text-lg font-light break-keep">
                단순한 기능을 넘어 비즈니스의 본질적인 문제를 해결하는 최적의 메커니즘을 제공합니다.
              </p>
            </div>
            <div className="hidden md:block w-24 h-[2px] bg-slate-200 mb-4" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="group p-12 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-slate-200 group-hover:bg-blue-600 rounded-lg flex items-center justify-center text-slate-600 group-hover:text-white font-bold mb-8 transition-colors duration-300 text-sm">
                  0{idx + 1}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed font-light break-keep">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Bottom CTA */}
      <section className="py-32 px-4 bg-[#f8fafc] border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-10 tracking-tighter break-keep">
              비즈니스의 새로운 기준,<br className="hidden md:block" /> 지금 바로 경험하십시오.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="px-12 py-5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 text-lg"
              >
                무료 컨설팅 신청하기
              </button>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-12 py-5 bg-white text-slate-600 font-bold rounded-full border border-slate-200 hover:bg-slate-50 transition-all text-lg"
              >
                홈으로 돌아가기
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}