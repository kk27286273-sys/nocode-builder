'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SHOWROOM_TEMPLATES } from '@/data/showroomTemplates';

export default function ShowroomSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = SHOWROOM_TEMPLATES.length;

  // 1. 타이머를 통한 자동 이동 (2초마다 다음 카드로)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, 2000);

    return () => clearInterval(timer);
  }, [totalItems]);

  return (
    <div className="w-full py-6 bg-slate-50 border-y border-slate-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">업종별 추천 쇼룸</h2>
          <p className="text-xs text-slate-500 mt-1">자동으로 추천 템플릿이 넘어갑니다.</p>
        </div>
        <div className="flex gap-1.5 items-center">
          {SHOWROOM_TEMPLATES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300'
              }`}
              aria-label={`슬라이드 ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 overflow-hidden">
        {/* 2. transform translate 방식을 사용해 너비 계산 오류 완전 배제 */}
        <div
          className="flex gap-4 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (288 + 16)}px)`,
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
                <p className="text-xs text-slate-500 line-clamp-1 mb-3">{template.tagline}</p>
                <div className="flex items-center text-xs font-semibold text-slate-700">
                  상세 구성 보기{' '}
                  <span className="ml-1 text-[10px] group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}