'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface ESGPageProps {
  esgData: any;
}

export default function ESGPage({ esgData }: ESGPageProps) {
  // 데이터가 없어도 null 에러가 나지 않도록 기본값 설정
  const data = esgData || { mainTitle: '', mainDesc: '', environmental: '', social: '', governance: '' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full bg-white">
      <section className="py-24 md:py-32 px-4 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
            {data.mainTitle || '지속가능경영'}
          </h1>
          <p className="text-lg text-slate-400 font-light break-keep">
            {data.mainDesc || '우리는 환경, 사회, 지배구조의 조화를 통해 지속 가능한 가치를 창출합니다.'}
          </p>
        </div>
      </section>

      <section className="py-24 px-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { key: 'environmental', label: 'Environmental', color: 'text-green-600', desc: '환경 경영' },
          { key: 'social', label: 'Social', color: 'text-blue-600', desc: '사회적 책임' },
          { key: 'governance', label: 'Governance', color: 'text-purple-600', desc: '투명 경영' },
        ].map((item) => (
          <div key={item.key} className="p-10 bg-slate-50 rounded-3xl border border-slate-100">
            <h3 className={`text-2xl font-bold mb-4 ${item.color}`}>{item.label}</h3>
            <p className="text-slate-500 font-medium mb-4">{item.desc}</p>
            <div className="text-slate-600 leading-relaxed font-light break-keep whitespace-pre-wrap">
              {data[item.key] || '내용을 입력해 주세요.'}
            </div>
          </div>
        ))}
      </section>
    </motion.div>
  );
}