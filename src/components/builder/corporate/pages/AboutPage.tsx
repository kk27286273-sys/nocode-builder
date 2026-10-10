'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AboutPageProps {
  corporateInfo?: any;
  company?: any;
}

export default function AboutPage({
  corporateInfo = {},
  company = {},
}: AboutPageProps) {
  const about =
    corporateInfo.about ||
    corporateInfo.ceoGreeting?.title ||
    '';

  const vision =
    corporateInfo.vision ||
    corporateInfo.missionVision?.vision ||
    '';

  const ceoMessage =
    corporateInfo.ceoMessage ||
    corporateInfo.ceoGreeting?.content ||
    '';

  const representativeName =
    corporateInfo.representativeName ||
    corporateInfo.ceo?.title ||
    corporateInfo.ceoGreeting?.name ||
    '';

  const ceoImage = corporateInfo.ceoGreeting?.image || '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full bg-white"
    >
      <section className="relative border-b border-slate-100 bg-slate-50 px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl text-center">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-blue-600">
            Company Introduction
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 text-4xl font-bold tracking-tighter text-slate-900 md:text-6xl"
          >
            {about || '신뢰를 바탕으로 미래를 설계하는 기업'}
          </motion.h1>
        </div>
      </section>

      <section className="px-4 py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border-8 border-white bg-slate-200 shadow-2xl">
              {ceoImage ? (
                <img
                  src={ceoImage}
                  alt={`${representativeName || '대표이사'} 사진`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  대표이사 사진을 등록해 주세요.
                </div>
              )}
            </div>
            <div className="absolute -bottom-6 -right-6 hidden rounded-xl bg-blue-600 p-6 text-white shadow-xl md:block">
              <p className="text-sm font-medium opacity-80">Representative</p>
              <p className="text-xl font-bold">{representativeName || '대표이사'}</p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter text-slate-900 md:text-4xl">
              {vision || '최고의 기술력으로 고객의 가치를 실현하겠습니다.'}
            </h2>
            <p className="break-keep whitespace-pre-wrap text-lg font-light leading-relaxed text-slate-600">
              {ceoMessage || '회사의 철학과 비전을 담은 인사말이 들어가는 자리입니다.'}
            </p>
            <div className="pt-4">
              <div className="mb-4 h-1 w-12 bg-blue-600" />
              <p className="text-xl font-bold text-slate-900">
                주식회사 {company.name || '회사명'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0a192f] px-4 py-24 text-white md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tighter md:text-5xl">
              Mission &amp; Vision
            </h2>
            <p className="font-light text-slate-400">
              우리가 나아갈 방향과 지향하는 핵심 가치입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <motion.div
              whileHover={{ y: -10 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-12 backdrop-blur-sm"
            >
              <div className="mb-6 text-4xl font-black text-blue-400">01</div>
              <h3 className="mb-4 text-2xl font-bold">Mission</h3>
              <p className="break-keep whitespace-pre-wrap font-light leading-relaxed text-slate-300">
                {corporateInfo.missionVision?.mission ||
                  ceoMessage ||
                  '회사의 철학과 비전을 담은 인사말이 들어가는 자리입니다.'}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-12 backdrop-blur-sm"
            >
              <div className="mb-6 text-4xl font-black text-blue-400">02</div>
              <h3 className="mb-4 text-2xl font-bold">Vision</h3>
              <p className="break-keep whitespace-pre-wrap font-light leading-relaxed text-slate-300">
                {vision || '최고의 기술력으로 고객의 가치를 실현하겠습니다.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter text-slate-900 md:text-5xl">
            Company History
          </h2>
          {Array.isArray(corporateInfo.history) &&
          corporateInfo.history.length > 0 ? (
            <div className="space-y-6">
              {corporateInfo.history.map(
                (item: { year?: string; event?: string }, index: number) => (
                  <div
                    key={`${item.year || 'history'}-${index}`}
                    className="grid grid-cols-[90px_1fr] gap-4 border-b border-slate-100 pb-5"
                  >
                    <span className="font-black text-blue-600">
                      {item.year || ''}
                    </span>
                    <span className="text-slate-700">{item.event || ''}</span>
                  </div>
                ),
              )}
            </div>
          ) : corporateInfo.since ? (
            <div className="text-center text-slate-700">
              <span className="text-xl font-black text-blue-600">
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