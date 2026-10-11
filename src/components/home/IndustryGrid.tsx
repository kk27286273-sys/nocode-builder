// src/components/home/IndustryGrid.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

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

// 미리보기 iframe 내부를 실제 데스크톱 폭으로 렌더링한 뒤 축소
const FRAME_WIDTH = 1440;
const FRAME_HEIGHT = 1000;

function IndustryCard({ item, index }: { item: Industry; index: number }) {
  const cardRef = useRef<HTMLElement | null>(null);
  const frameBoxRef = useRef<HTMLDivElement | null>(null);

  const [shown, setShown] = useState(false);
  const [loadFrame, setLoadFrame] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const [scale, setScale] = useState(0.3);
  const [hover, setHover] = useState(false);

  // 카드가 화면에 들어오면 등장 + iframe 로드 시작
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      setLoadFrame(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          setLoadFrame(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 미리보기 박스 폭에 맞춰 축소 비율 계산
  useEffect(() => {
    const box = frameBoxRef.current;
    if (!box) return;

    const update = () => {
      const width = box.clientWidth;
      if (width > 0) setScale(width / FRAME_WIDTH);
    };

    update();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }

    const ro = new ResizeObserver(update);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  return (
    <article
      ref={cardRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{ transitionDelay: `${index * 80}ms` }}
      className={`group relative overflow-hidden rounded-3xl border bg-white transition-all duration-500 ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${
        hover
          ? '-translate-y-1 border-slate-900 shadow-2xl'
          : 'border-slate-200 shadow-sm'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0 top-0 z-10 h-1 w-full origin-left transition-transform duration-500 ${
          hover ? 'scale-x-100' : 'scale-x-0'
        }`}
        style={{ backgroundColor: item.accent }}
      />

      <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
        {/* 좌측: 설명 */}
        <div className="flex flex-col justify-center p-7 md:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                {item.en}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
                {item.ko}
              </h3>
            </div>
            <span className="text-4xl font-black leading-none text-slate-100 transition-colors duration-500 group-hover:text-slate-200">
              {item.no}
            </span>
          </div>

          <p className="mt-4 leading-7 text-slate-600">{item.summary}</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {item.points.map((point) => (
              <li
                key={point}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 transition-colors duration-500 group-hover:bg-slate-900 group-hover:text-white"
              >
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={`/showroom/${item.templateId}`}
              className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              자세히 보기
            </Link>
            <Link
              href={`/preview?templateId=${item.templateId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-slate-900"
            >
              새 창으로 보기 <span className="ml-2" aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        {/* 우측: 미리보기 */}
        <div className="relative border-t border-slate-200 bg-slate-100 p-5 lg:border-l lg:border-t-0 lg:p-6">
          <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-inner">
            {/* 브라우저 바 */}
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 truncate text-[11px] text-slate-400">
                nexia.preview / {item.templateId}
              </span>
            </div>

            {/* 축소 렌더링 영역 */}
            <div
              ref={frameBoxRef}
              className="relative w-full overflow-hidden bg-white"
              style={{ height: FRAME_HEIGHT * scale }}
            >
              {!frameReady && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 via-white to-slate-100" />
              )}

              {loadFrame && (
                <iframe
                  src={`/preview?templateId=${item.templateId}`}
                  title={`${item.ko} 템플릿 미리보기`}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                  scrolling="no"
                  onLoad={() => setFrameReady(true)}
                  className={`pointer-events-none absolute left-0 top-0 origin-top-left border-0 transition-opacity duration-700 ${
                    frameReady ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    width: FRAME_WIDTH,
                    height: FRAME_HEIGHT,
                    transform: `scale(${scale})`,
                  }}
                />
              )}

              {/* 호버 시 덮이는 바로가기 */}
              <Link
                href={`/preview?templateId=${item.templateId}`}
                target="_blank"
                rel="noreferrer"
                className={`absolute inset-0 flex items-center justify-center bg-slate-900/60 transition-opacity duration-500 ${
                  hover ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span className="rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg">
                  전체 화면으로 보기 ↗
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function IndustryGrid() {
  return (
    <div className="flex flex-col gap-6">
      {INDUSTRIES.map((item, index) => (
        <IndustryCard key={item.templateId} item={item} index={index} />
      ))}
    </div>
  );
}