'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AboutPageProps {
  corporateInfo: any;
  company: any;
}

export default function AboutPage({ corporateInfo = {}, company = {} }: AboutPageProps) {
  const about = corporateInfo.about || '';
  const vision = corporateInfo.vision || '';
  const ceoMessage = corporateInfo.ceoMessage || '';
  const representativeName =
    corporateInfo.representativeName || corporateInfo.ceo?.title || '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full bg-white"
    >
      <section className="relative py-24 md:py-32 px-4 bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-4 block">
            Company Introduction
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tighter"
          >
            {about || '신뢰를 바탕으로 미래를 설계하는 기업'}
          </motion.h1>
        </div>
      </section>

      <section className="py-24 md:py-32 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] bg-slate-200 rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={`${company.name || '회사'} 로고`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  회사 이미지를 등록해 주세요.
                </div>
              )}
            </div>
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-xl shadow-xl hidden md:block">
              <p className="text-sm font-medium opacity-80">Representative</p>
              <p className="text-xl font-bold">{representativeName || '대표이사'}</p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight tracking-tighter">
              {vision || '최고의 기술력으로 고객의 가치를 실현하겠습니다.'}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed font-light break-keep whitespace-pre-wrap">
              {ceoMessage || '회사의 철학과 비전을 담은 인사말이 들어가는 자리입니다.'}
            </p>
            <div className="pt-4">
              <div className="w-12 h-1 bg-blue-600 mb-4" />
              <p className="text-xl font-bold text-slate-900">
                주식회사 {company.name || '회사명'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-4 bg-[#0a192f] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tighter">
              Mission &amp; Vision
            </h2>
            <p className="text-slate-400 font-light">
              우리가 나아갈 방향과 지향하는 핵심 가치입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="p-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm"
            >
              <div className="text-blue-400 text-4xl font-black mb-6">01</div>
              <h3 className="text-2xl font-bold mb-4">Mission</h3>
              <p className="text-slate-300 leading-relaxed font-light break-keep whitespace-pre-wrap">
                {ceoMessage || '회사의 철학과 비전을 담은 인사말이 들어가는 자리입니다.'}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="p-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm"
            >
              <div className="text-blue-400 text-4xl font-black mb-6">02</div>
              <h3 className="text-2xl font-bold mb-4">Vision</h3>
              <p className="text-slate-300 leading-relaxed font-light break-keep whitespace-pre-wrap">
                {vision || '최고의 기술력으로 고객의 가치를 실현하겠습니다.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-slate-900 mb-12 tracking-tighter">
            Company History
          </h2>
          {corporateInfo.since ? (
            <div className="text-center text-slate-700">
              <span className="text-blue-600 font-black text-xl">
                {corporateInfo.since}
              </span>
            </div>
          ) : (
            <div className="text-center text-slate-400">
              등록된 연혁 정보가 없습니다.
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}