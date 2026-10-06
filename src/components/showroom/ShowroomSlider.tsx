'use client';

import React from 'react';
import Link from 'next/link';
import { SHOWROOM_TEMPLATES } from '@/data/showroomTemplates';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

export default function ShowroomSlider() {
  // 템플릿 개수가 적을 때 루프 경고를 방지하기 위해 배열을 2배로 복제합니다.
  const extendedTemplates = [...SHOWROOM_TEMPLATES, ...SHOWROOM_TEMPLATES];

  return (
    <div className="w-full py-6 bg-slate-50 border-y border-slate-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">업종별 추천 쇼룸</h2>
          <p className="text-xs text-slate-500 mt-1">자동으로 추천 템플릿이 넘어갑니다. 직접 밀어보세요.</p>
        </div>
        <span className="text-xs font-medium text-slate-400 hidden sm:block">자동 이동 중 ↔</span>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={'auto'} 
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          className="pb-12 !overflow-visible"
        >
          {extendedTemplates.map((template, index) => (
            <SwiperSlide key={`${template.id}-${index}`} style={{ width: '288px' }}>
              <Link
                href={`/showroom/${template.id}`}
                className="block w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group"
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
                    상세 구성 보기 <span className="ml-1 text-[10px] group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background: #2563eb !important;
          width: 12px !important;
          border-radius: 4px !important;
        }
      `}</style>
    </div>
  );
}