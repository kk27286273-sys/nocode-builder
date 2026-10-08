'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface ESGPageProps {
  esgData?: {
    environmental?: { title: string; content: string; image: string };
    social?: { title: string; content: string; image: string };
    governance?: { title: string; content: string; image: string };
  };
}

export default function ESGPage({ esgData }: ESGPageProps) {
  const data = esgData || {};
  
  const sections = [
    {
      key: 'environmental',
      tag: 'Environment',
      title: data.environmental?.title || '친환경 경영 및 탄소 중립 실천',
      desc: data.environmental?.content || '에너지 절감 공정과 친환경 부품 적용을 통해 지속 가능한 환경 가치를 창출합니다.',
      image: data.environmental?.image || 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80',
    },
    {
      key: 'social',
      tag: 'Social',
      title: data.social?.title || '사회적 가치 창출과 상생 협력',
      desc: data.social?.content || '지역사회 발전 기여 및 협력사와의 동반 성장을 위한 실질적 상생 프로그램을 운영합니다.',
      image: data.social?.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      key: 'governance',
      tag: 'Governance',
      title: data.governance?.title || '투명하고 건전한 기업 지배구조',
      desc: data.governance?.content || '원칙과 투명성을 바탕으로 한 지배구조를 확립하여 기업의 신뢰도를 높입니다.',
      image: data.governance?.image || 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full bg-white">
      {/* Hero Section */}
      <section className="py-24 px-4 bg-slate-900 text-white text-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="text-blue-400 font-bold tracking-widest uppercase text-xs mb-4 block"
        >
          Sustainability
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold tracking-tighter mb-6"
        >
          지속가능한 미래를 위한 약속
        </motion.h1>
        <p className="text-slate-400 max-w-2xl mx-auto font-light break-keep">
          우리는 환경, 사회, 지배구조의 조화를 통해 사회적 가치를 창출하고 지속 가능한 성장을 추구합니다.
        </p>
      </section>

      {/* ESG Content Section */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto space-y-32">
          {sections.map((sec, idx) => (
            <motion.div 
              key={sec.key}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center gap-16 ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
            >
              <div className="w-full md:w-1/2 aspect-video bg-slate-200 rounded-3xl overflow-hidden shadow-xl">
                <img src={sec.image} className="w-full h-full object-cover hover:scale-105 transition duration-700" alt={sec.tag} />
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <span className={`text-sm font-black uppercase tracking-widest ${sec.key === 'environmental' ? 'text-emerald-600' : sec.key === 'social' ? 'text-blue-600' : 'text-indigo-600'}`}>
                  {sec.tag}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tighter break-keep">
                  {sec.title}
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed font-light break-keep">
                  {sec.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}