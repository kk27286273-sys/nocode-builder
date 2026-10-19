'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MainPageProps {
  hero: any;
  solutions: any[];
  navigateTo: (id: string, index?: number) => void;
  onHeroOverlayChange?: (opacity: number) => void;
}

export default function MainPage({
  hero,
  solutions,
  navigateTo,
  onHeroOverlayChange,
}: MainPageProps) {
  const [overlayOpacity, setOverlayOpacity] = React.useState(0.6);

  const handleOverlayChange = (value: number) => {
    setOverlayOpacity(value);
    onHeroOverlayChange?.(value);
  };

  const getGradientOpacity = () => {
    const start = Math.round(overlayOpacity * 0.4 * 100) / 100;
    const mid = overlayOpacity;
    const end = Math.round(overlayOpacity * 1.33 * 100) / 100;
    return { start, mid, end };
  };

  const opacity = getGradientOpacity();

  return (
    <div className="w-full">
      <section className="relative flex h-[80vh] items-center justify-center overflow-hidden bg-slate-900 text-white">
        {hero?.mediaUrl && (
          <img
            src={hero.mediaUrl}
            srcSet={hero.mediaSrcSet || undefined}
            sizes="100vw"
            alt={hero?.title || '히어로 배경'}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full bg-slate-900 object-contain"
          />
        )}

        <div
          className="absolute inset-0 z-10 bg-gradient-to-b transition-opacity duration-300"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, ${opacity.start}), rgba(15, 23, 42, ${opacity.mid}), rgba(15, 23, 42, ${opacity.end}))`,
          }}
        />

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
            transition={{ delay: 0, duration: 0.3, ease: 'easeOut' }}
            className="mb-6 text-5xl font-black leading-tight tracking-tighter md:text-7xl"
          >
            {hero?.title || '기업의 미래를 설계합니다'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-slate-300 md:text-2xl"
          >
            {hero?.subtitle ||
              hero?.description ||
              '최고의 기술력과 경험으로 최적의 솔루션을 제공합니다.'}
          </motion.p>
        </div>

        {/* 오버레이 조절 슬라이더 (빌더 모드에서만 표시) */}
        {onHeroOverlayChange && (
          <div className="absolute bottom-6 left-6 right-6 z-30 flex items-center gap-4 rounded-lg bg-slate-800/90 px-4 py-3 backdrop-blur md:bottom-8 md:left-8 md:right-8">
            <label className="whitespace-nowrap text-xs font-semibold text-slate-300 md:text-sm">
              오버레이
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={overlayOpacity}
              onChange={(e) => handleOverlayChange(parseFloat(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-600 accent-blue-600"
            />
            <span className="w-12 text-right text-xs font-bold text-blue-400 md:text-sm">
              {Math.round(overlayOpacity * 100)}%
            </span>
          </div>
        )}
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
                      alt={solution.title || `솔루션 ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="mb-6 h-48 w-full rounded-2xl bg-slate-100 object-contain"
                    />
                  ) : (
                    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-blue-600 shadow-md transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  )}

                  <h3 className="mb-4 text-2xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                    {solution.title || `솔루션 ${index + 1}`}
                  </h3>

                  <p className="line-clamp-3 font-light leading-relaxed text-slate-600">
                    {solution.description ||
                      '솔루션에 대한 상세 설명이 여기에 표시됩니다.'}
                  </p>

                  <div className="mt-8 flex items-center gap-2 text-sm font-bold text-blue-600 transition-all duration-300 group-hover:gap-3">
                    자세히 보기 <span aria-hidden="true">→</span>
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