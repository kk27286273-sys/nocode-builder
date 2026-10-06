'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { SHOWROOM_TEMPLATES } from '@/data/showroomTemplates';

export default function ShowroomSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    // 1. 오른쪽 끝에 도달했을 때 -> 맨 왼쪽(0)으로 순간이동
    if (scrollLeft + clientWidth >= scrollWidth - 1) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } 
    // 2. 맨 왼쪽 끝에 도달했을 때 -> 맨 오른쪽 끝으로 순간이동
    else if (scrollLeft <= 0) {
      // 사용자가 의도적으로 왼쪽으로 밀었을 때만 작동하도록 처리
      // (단, 처음 로드 시 0이므로 자연스럽게 동작함)
    }
  };

  // 왼쪽 끝에서 다시 오른쪽으로 보내는 기능은 
  // 사용자가 '왼쪽으로 밀기'를 했을 때만 작동해야 하므로 
  // 단순 scroll 이벤트보다는 휠/터치 감지가 필요하지만, 
  // 우선 가장 깔끔하게 '오른쪽 끝 -> 왼쪽 처음' 루프를 구현했습니다.

  return (
    <div className="w-full py-6 bg-slate-50 border-y border-slate-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            업종별 추천 쇼룸
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            좌우로 밀어서 최적화된 템플릿 구성을 확인해 보세요.
          </p>
        </div>
        <span className="text-xs font-medium text-slate-400">
          좌우 드래그 가능 ↔
        </span>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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