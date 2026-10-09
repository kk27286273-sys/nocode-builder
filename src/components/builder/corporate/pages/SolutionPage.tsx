'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface SolutionPageProps {
  solutionData: any; // 이제 단일 솔루션 객체를 받습니다.
}

export default function SolutionPage({ solutionData }: SolutionPageProps) {
  // 데이터가 아예 없으면 빈 객체로 처리하여 "불러오는 중" 메시지 방지
  const data = solutionData || { title: '', description: '', detailContent: '' };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="w-full bg-white"
    >
      {/* Hero Section: 솔루션 제목과 요약 */}
      <section className="relative py-24 md:py-32 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-blue-400 font-bold tracking-widest uppercase text-xs mb-4 block"
          >
            Solution Detail
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter"
          >
            {data.title || '솔루션 제목을 입력해주세요'}
          </motion.h1>
          <p className="text-lg text-slate-400 font-light break-keep max-w-3xl mx-auto">
            {data.description || '솔루션에 대한 요약 설명이 표시되는 영역입니다.'}
          </p>
        </div>
      </section>

      {/* Detail Content Section: 에디터의 detailContent 출력 */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 md:p-16 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
              상세 소개
            </h2>
            <div className="text-slate-600 leading-relaxed font-light break-keep whitespace-pre-wrap text-lg">
              {data.detailContent || '에디터에서 상세 내용을 입력하면 이곳에 출력됩니다.'}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}