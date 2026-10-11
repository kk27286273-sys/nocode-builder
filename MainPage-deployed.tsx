'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MainPageProps {
  hero: any;
  solutions: any[];
  navigateTo: (id: string, index?: number) => void;
}

export default function MainPage({
  hero,
  solutions,
  navigateTo,
}: MainPageProps) {
  return (
    <div className="w-full">
      <section className="relative flex h-[80vh] items-center justify-center overflow-hidden bg-slate-900 text-white">
        {hero?.mediaUrl && (
          <img
            src={hero.mediaUrl}
            alt={hero?.title || '?덉뼱濡?諛곌꼍'}
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/80" />

        <div className="relative z-20 px-4 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-block rounded-full bg-blue-600 px-4 py-1 text-xs font-bold"
          >
            {hero?.badge || 'BRAND NEW'}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 text-5xl font-black leading-tight tracking-tighter md:text-7xl"
          >
            {hero?.title || '湲곗뾽??誘몃옒瑜??ㅺ퀎?⑸땲??}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-slate-300 md:text-2xl"
          >
            {hero?.subtitle ||
              hero?.description ||
              '理쒓퀬??湲곗닠?κ낵 寃쏀뿕?쇰줈 理쒖쟻???붾（?섏쓣 ?쒓났?⑸땲??'}
          </motion.p>
        </div>
      </section>

      <section className="bg-white px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tighter text-slate-900">
              Our Solutions
            </h2>
            <div className="mx-auto h-1 w-16 bg-blue-600" />
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {(Array.isArray(solutions) ? solutions : []).map(
              (solution, index) => (
                <motion.div
                  key={solution.id ?? index}
                  whileHover={{ y: -15 }}
                  onClick={() => navigateTo('sol_detail', index)}
                  className="group cursor-pointer rounded-3xl border border-slate-100 bg-slate-50 p-10 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-xl"
                >
                  {solution.image ? (
                    <img
                      src={solution.image}
                      alt={solution.title || `?붾（??${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="mb-6 h-48 w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-blue-600 shadow-md transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  )}

                  <h3 className="mb-4 text-2xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                    {solution.title || `?붾（??${index + 1}`}
                  </h3>

                  <p className="line-clamp-3 font-light leading-relaxed text-slate-600">
                    {solution.description ||
                      '?붾（?섏뿉 ????곸꽭 ?ㅻ챸???ш린???쒖떆?⑸땲??'}
                  </p>

                  <div className="mt-8 flex items-center gap-2 text-sm font-bold text-blue-600 transition-all duration-300 group-hover:gap-3">
                    ?곸꽭蹂닿린 <span>??/span>
                  </div>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
