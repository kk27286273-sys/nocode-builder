'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface ESGPageProps {
  corporateInfo: any;
}

export default function ESGPage({ corporateInfo }: ESGPageProps) {
  if (!corporateInfo) return <div className="py-32 text-center text-slate-500">ESG 정보를 불러오는 중입니다...</div>;

  // 에디터의 esgItems 데이터 배열 추출
  const esgItems = corporateInfo.esgItems || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tighter"
          >
            {corporateInfo.esgIntro?.mainTitle || '지속가능한 미래를 위한 약속'}
          </motion.h1>
          <p className="text-lg text-slate-600 font-light break-keep">
            {corporateInfo.esgIntro?.subTitle || '환경, 사회, 지배구조의 가치를 실현하여 함께 성장하는 기업이 되겠습니다.'}
          </p>
        </div>
      </section>

      {/* ESG Content Grid */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {esgItems.length > 0 ? (
            esgItems.map((item: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-12 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 text-5xl font-black mb-8 opacity-20">{idx + 1}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">
                  {item.title || 'ESG 항목 제목'}
                </h3>
                <p className="text-slate-600 leading-relaxed font-light break-keep">
                  {item.content || '항목에 대한 상세 설명이 들어가는 자리입니다.'}
                </p>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-400">
              등록된 ESG 정보가 없습니다. 에디터에서 추가해 주세요.
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}