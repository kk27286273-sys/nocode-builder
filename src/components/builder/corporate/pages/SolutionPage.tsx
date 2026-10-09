'use client';
import React from 'react';
import { motion } from 'framer-motion';

// Props 타입을 명확히 정의: 전체 데이터를 받아야 상단(Main)과 하단(List)을 모두 그릴 수 있음
interface SolutionPageProps {
  data: any; 
}

export default function SolutionPage({ data }: SolutionPageProps) {
  // data가 없을 경우를 대비한 방어 코드
  if (!data) return <div className="p-10 text-center">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* [상단 대표 영역] - 단일 객체 solutionMain 사용 */}
      <section className="py-20 px-6 text-center bg-slate-50 border-b">
        <div className="max-w-4xl mx-auto space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-slate-900 tracking-tight"
          >
            {data.solutionMain?.title || '상단 제목을 입력하세요'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-bold text-blue-600"
          >
            {data.solutionMain?.description || '메인화면 요약 내용'}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 leading-relaxed max-w-2xl mx-auto"
          >
            {data.solutionMain?.detailContent || '상세페이지 대표 내용을 입력하세요.'}
          </motion.p>
        </div>
      </section>

      {/* [하단 상세 소개 영역] - 배열 solutions 사용 */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-black text-center mb-12 text-slate-800">상세 소개</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(data.solutions || []).map((sol: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 border-t-4 border-t-blue-600"
            >
              <div className="text-xs font-bold text-blue-500 uppercase">Solution 0{idx + 1}</div>
              <h3 className="text-xl font-bold text-slate-900">{sol.title || '솔루션 제목'}</h3>
              <p className="text-sm font-semibold text-slate-700">{sol.description || '요약 내용'}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{sol.detailContent || '상세 내용'}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}