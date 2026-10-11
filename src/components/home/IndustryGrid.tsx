// src/components/home/IndustryGrid.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useReveal } from '@/hooks/useReveal';

type Industry = {
  no: string;
  en: string;
  ko: string;
  summary: string;
  points: string[];
  templateId: string;
  accent: string;
};

const INDUSTRIES: Industry[] = [
  {
    no: '01',
    en: 'Corporate',
    ko: '기업·회사소개',
    summary: '신뢰감 있는 구성으로 회사의 역량과 사업 영역을 전달합니다.',
    points: ['회사 소개·연혁', '사업 영역 정리', '문의 전환 동선'],
    templateId: 'corporate',
    accent: '#2563EB',
  },
  {
    no: '02',
    en: 'Legal & Tax',
    ko: '법률·세무',
    summary: '전문성과 안정감을 강조한 다크 네이비 기반 구성입니다.',
    points: ['전문 분야 안내', '상담 신청 강조', '약력·자격 정리'],
    templateId: 'legal-tax',
    accent: '#0F172A',
  },
  {
    no: '03',
    en: 'Counseling',
    ko: '상담·교육',
    summary: '편안한 색감으로 접근 장벽을 낮추고 상담을 유도합니다.',
    points: ['프로그램 소개', '상담 절차 안내', '후기·FAQ 구성'],
    templateId: 'counseling',
    accent: '#065F46',
  },
  {
    no: '04',
    en: 'Fitness',
    ko: '피트니스·레슨',
    summary: '활동적인 톤으로 수업과 이용권 정보를 빠르게 보여줍니다.',
    points: ['수업·클래스 안내', '이용권 비교', '위치·시간표'],
    templateId: 'fitness-lesson',
    accent: '#EA580C',
  },
];

export default function IndustryGrid() {
  const [active, setActive] = useState<number | null>(null);
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="grid gap-4 md:grid-cols-2">
      {INDUSTRIES.map((item, index) => {
        const isActive = active === index;

        return (
          <article
            key={item.templateId}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
            style={{ transitionDelay: `${index * 70}ms` }}
            className={`group relative overflow-hidden rounded-3xl border bg-white p-7 transition-all duration-500 md:p-8 ${
              shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            } ${
              isActive
                ? '-translate-y-1 border-slate-900 shadow-xl'
                : 'border-slate-200 hover:border-slate-400'
            }`}
          >
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-1 w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 group-focus-within:scale-x-100"
              style={{ backgroundColor: item.accent }}
            />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  {item.en}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {item.ko}
                </h3>
              </div>
              <span className="text-4xl font-black leading-none text-slate-100 transition-colors duration-500 group-hover:text-slate-200">
                {item.no}
              </span>
            </div>

            <p className="mt-4 leading-7 text-slate-600">{item.summary}</p>

            <div
              className={`grid transition-all duration-500 ${
                isActive
                  ? 'mt-5 grid-rows-[1fr] opacity-100'
                  : 'mt-0 grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <ul className="flex flex-wrap gap-2">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/showroom/${item.templateId}`}
                className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                자세히 보기
              </Link>
              <Link
                href={`/preview?templateId=${item.templateId}`}
                className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-slate-900"
              >
                미리보기 <span className="ml-2" aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}