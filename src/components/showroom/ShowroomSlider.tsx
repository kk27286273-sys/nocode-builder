'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { SHOWROOM_TEMPLATES } from '@/data/showroomTemplates';

export default function ShowroomSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. 자동 이동 로직 (1초마다 다음 템플릿으로)
  useEffect(() => {
    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;

      const { scrollLeft, scrollWidth, clientWidth } = el;
      const itemWidth = 288 + 16; // 카드너비(w-72=288px) + gap(16px)

      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        // 끝에 도달하면 처음으로 부드럽게 이동
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // 다음 아이템으로 이동
        el.scrollBy({ left: itemWidth, behavior: 'smooth' });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-6 bg-slate-50 border-y border-slate-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            업종별 추천 쇼룸
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            자동으로 추천 템플릿이 넘어갑니다. 직접 밀어서 확인해 보세요.
          </p>
        </div>
        <span className="text-xs font-medium text-slate-400">
          자동 이동 중 ↔
        </span>
      </div>

      {/* 
        - snap-x snap-mandatory: 스크롤 시 자석처럼 착 붙음
        - overflow-x-auto: 마우스/터치 스크롤 허용
        - justify-center: 아이템이 적을 때 중앙 정렬 (단, overflow-x-auto와 함께 쓰려면 내부 wrapper 필요)
      */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-[calc((100vw-1152px)/2)] md:px-6 pb-4 no-scrollbar snap-x snap-mandatory"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch' // iOS 터치 최적화
        }}
      >
        {SHOWROOM_TEMPLATES.map((template) => (
          <Link
            key={template.id}
            href={`/showroom/${template.id}`}
            className="flex-shrink-0 w-72 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all snap-center group"
          >
            <div className="h-40 bg-slate-100 overflow-hidden relative">
              <img
                src={template.thumbnailImage}
                alt={template.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span
                className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white shadow-sm"
                style={{ backgroundColor: template.primaryColor }}
              >
                {template.category}
              </span>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                {template.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                {template.tagline}
              </p>
              <div className="flex items-center text-xs font-semibold text-slate-700">
                상세 구성 보기
                <span className="ml-1 text-[10px] group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}