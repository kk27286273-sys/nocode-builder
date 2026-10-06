'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { SHOWROOM_TEMPLATES } from '@/data/showroomTemplates';

export default function ShowroomSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 무한 루프처럼 보이도록 아이템 목록을 3벌 복제
  const loopedTemplates = [
    ...SHOWROOM_TEMPLATES,
    ...SHOWROOM_TEMPLATES,
    ...SHOWROOM_TEMPLATES,
  ];

  // 마운트 시 중앙 세트로 스크롤 위치 초기화
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const singleSetWidth = el.scrollWidth / 3;
    el.scrollLeft = singleSetWidth;
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const singleSetWidth = el.scrollWidth / 3;

    // 맨 왼쪽 끝에 도달하면 중앙 세트의 같은 위치로 순간 이동
    if (el.scrollLeft <= 0) {
      el.scrollLeft = singleSetWidth;
    }
    // 맨 오른쪽 끝에 도달하면 중앙 세트의 같은 위치로 순간 이동
    else if (el.scrollLeft >= singleSetWidth * 2) {
      el.scrollLeft = singleSetWidth;
    }
  };

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
        {loopedTemplates.map((template, index) => (
          <Link
            key={`${template.id}-${index}`}
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