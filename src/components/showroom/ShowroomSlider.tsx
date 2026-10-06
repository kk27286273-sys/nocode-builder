'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { SHOWROOM_TEMPLATES, ShowroomTemplateItem } from '@/data/showroomTemplates';

export default function ShowroomSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // 스크롤 위치를 감지해 하단 인디케이터(Dot) 업데이트
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / offsetWidth);
      setActiveIndex(index);
    }
  };

  // 인디케이터 클릭 시 해당 슬라이드로 이동
  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const { offsetWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: offsetWidth * index,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative w-full py-12 overflow-hidden bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-2">업종별 최적화 템플릿</h2>
        <p className="text-center text-slate-500 text-sm">비즈니스 성격에 맞는 최적의 동선을 선택하세요</p>
      </div>

      {/* 슬라이더 컨테이너: CSS Scroll Snap 적용 */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6 px-[calc(50%-280px)] pb-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {SHOWROOM_TEMPLATES.map((item, idx) => (
          <Link 
            key={item.id} 
            href={`/showroom/${item.id}`}
            className="shrink-0 w-[560px] snap-center group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl border border-slate-200">
              {/* 이미지 영역 */}
              <div className="relative h-[320px] overflow-hidden">
                <img 
                  src={item.thumbnailImage} 
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-bold">{item.name}</h3>
                </div>
              </div>
              
              {/* 설명 영역 */}
              <div className="p-6">
                <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                  {item.tagline}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {item.features.slice(0, 2).map((f, i) => (
                      <span key={i} className="text-[10px] text-slate-400 border border-slate-200 px-2 py-0.5 rounded">
                        {f}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
                    상세보기 →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 인디케이터 (Dots) */}
      <div className="flex justify-center gap-2 mt-4">
        {SHOWROOM_TEMPLATES.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => scrollTo(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === idx ? 'w-8 bg-sky-600' : 'w-2 bg-slate-300'
            }`}
          />
        ))}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}