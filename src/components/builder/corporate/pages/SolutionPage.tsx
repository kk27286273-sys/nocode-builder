'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SolutionPageProps {
  data: any;
}

export default function SolutionPage({ data }: SolutionPageProps) {
  if (!data) {
    return <div className="p-10 text-center">데이터를 불러오는 중입니다...</div>;
  }

  const solutionMain = data.solutionMain || {};
  const solutions = Array.isArray(data.solutions)
    ? data.solutions
    : Array.isArray(data.solutions?.list)
      ? data.solutions.list
      : [];

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 px-6 text-center bg-slate-50 border-b">
        <div className="max-w-4xl mx-auto space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-slate-900 tracking-tight"
          >
            {solutionMain.title || '상단 제목을 입력하세요'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-bold text-blue-600"
          >
            {solutionMain.description || '메인화면 요약 내용'}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 leading-relaxed max-w-2xl mx-auto whitespace-pre-wrap"
          >
            {solutionMain.detailContent || '상세페이지 대표 내용을 입력하세요.'}
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-black text-center mb-12 text-slate-800">
          상세 소개
        </h2>

        {solutions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution: any, index: number) => (
              <motion.div
                key={solution.id ?? index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 border-t-4 border-t-blue-600"
              >
                {solution.image && (
                  <img
                    src={solution.image}
                    alt={solution.title || `솔루션 ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="h-48 w-full rounded-xl object-cover"
                  />
                )}
<div className="text-xs font-bold text-blue-500 uppercase">
  Solution {String(index + 1).padStart(2, '0')}
</div>
                <h3 className="text-xl font-bold text-slate-900">
                  {solution.title || `솔루션 ${index + 1}`}
                </h3>
                <p className="text-sm font-semibold text-slate-700 whitespace-pre-wrap">
                  {solution.description || '요약 내용'}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">
                  {solution.detailContent || '상세 내용'}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400">
            등록된 사업 소개 카드가 없습니다.
          </p>
        )}
      </section>
    </div>
  );
}