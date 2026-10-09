'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface SolutionPageProps {
  corporateInfo: any;
}

export default function SolutionPage({ corporateInfo }: SolutionPageProps) {
  if (!corporateInfo) return <div className="py-32 text-center text-slate-500">사업 정보를 불러오는 중입니다...</div>;

  // 에디터의 solutions 데이터 배열 추출
  const solutions = corporateInfo.solutions || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter"
          >
            {corporateInfo.solutionIntro?.mainTitle || '혁신적인 기술로 비즈니스의 미래를 만듭니다'}
          </motion.h1>
          <p className="text-lg text-slate-400 font-light break-keep">
            {corporateInfo.solutionIntro?.subTitle || '우리는 고객의 성공을 위해 최적의 솔루션을 제공합니다.'}
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.length > 0 ? (
            solutions.map((sol: any, idx: number) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="p-10 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-xl mb-6 flex items-center justify-center text-white font-bold text-xl">
                  {idx + 1}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                  {sol.title || '솔루션 제목'}
                </h3>
                <p className="text-slate-600 leading-relaxed font-light break-keep">
                  {sol.description || '솔루션에 대한 상세 설명이 들어가는 자리입니다.'}
                </p>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-400">
              등록된 사업 소개 정보가 없습니다. 에디터에서 추가해 주세요.
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}