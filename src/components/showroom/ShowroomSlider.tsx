'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { SHOWROOM_TEMPLATES } from '@/data/showroomTemplates';

export default function ShowroomSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    console.log("🚀 쇼룸 슬라이더 타이머 시작됨");

    const timer = setInterval(() => {
      const el = scrollRef.current;
      if (!el) {
        console.log("❌ 엘리먼트를 찾을 수 없음");
        return;
      }

      const { scrollLeft, scrollWidth, clientWidth } = el;
      const itemWidth = 288 + 16; 

      console.log(`현재 위치: ${scrollLeft}, 전체너비: ${scrollWidth}, 화면너비: ${clientWidth}`);

      // 조건 없이 일단 밀어보고, 끝에 도달했는지만 체크
      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        console.log("🔄 끝 도달 -> 처음으로 이동");
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        console.log("➡️ 다음 카드로 이동");
        el.scrollTo({ 
          left: scrollLeft + itemWidth, 
          behavior: 'smooth' 
        });
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [isMounted]);

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

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch' 
        }}
      >
        {SHOWROOM_TEMPLATES.map((template) => (
          <Link
            key={template.id}
            href={`/showroom/${template.id}`}
            className="flex-shrink-0 w-72 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group"
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