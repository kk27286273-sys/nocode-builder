import React, { useState } from 'react';
import { SiteData } from '@/types/template';

export const PortfolioViewer = ({ data }: { data: SiteData }) => {
  const { company, style, specifics } = data;
  const portData = specifics as any;
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* GNB: 미니멀 스타일 */}
      <nav className="flex items-center justify-between px-6 py-6">
        {company?.logoUrl && !logoFailed ? (
          <img
            src={company.logoUrl}
            alt={`${company?.name || '회사'} 로고`}
            width={144}
            height={32}
            onError={() => setLogoFailed(true)}
            className="h-6 w-36 object-contain object-left"
          />
        ) : (
          <span className="max-w-36 truncate text-sm font-bold">
            {company?.name || '회사'}
          </span>
        )}

        <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
          <a href="#" className="text-sky-600">
            Work
          </a>
          <a href="#" className="transition hover:text-sky-600">
            About
          </a>
          <a href="#" className="transition hover:text-sky-600">
            Contact
          </a>
        </div>
      </nav>

      {/* 히어로: 예술적 감성 */}
      <section className="px-6 py-24 text-center">
        <h1 className="mb-8 text-5xl font-black leading-none tracking-tighter md:text-7xl">
          CREATIVE <br /> <span className="text-sky-600">PORTFOLIO</span>
        </h1>
        <p className="mx-auto max-w-xl text-sm uppercase tracking-widest text-slate-400">
          {company.name} - 우리는 가치를 시각화하여 경험을 설계합니다.
        </p>
      </section>

      {/* 필터 태그 */}
      <section className="mb-12 flex justify-center gap-3 px-6">
        <button className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-bold text-white">
          All
        </button>
        {portData.filterTags?.map((tag: string, i: number) => (
          <button
            key={i}
            className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
          >
            {tag}
          </button>
        ))}
      </section>

      {/* 포트폴리오 그리드 */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {portData.gallery?.map((item: any, idx: number) => (
            <div key={idx} className="group cursor-pointer">
              <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-sky-600/80 text-lg font-bold text-white opacity-0 transition duration-300 group-hover:opacity-100">
                  View Project
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-sm text-slate-400">
                    {item.category} · {item.date}
                  </p>
                </div>
                <span className="font-mono text-xs text-slate-300">
                  0{idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-slate-50 px-6 py-20 text-center">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} {company.name}. All rights reserved.
        </p>
      </footer>
    </div>
  );
};