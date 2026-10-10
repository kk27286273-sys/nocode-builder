import React, { useState } from 'react';
import { SiteData } from '@/types/template';

export const RentalViewer = ({ data }: { data: SiteData }) => {
  const { company, style, specifics } = data;
  const rentalData = specifics as any;
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* GNB: 쇼핑몰 스타일 */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        {company?.logoUrl && !logoFailed ? (
          <img
            src={company.logoUrl}
            alt={`${company?.name || '회사'} 로고`}
            width={144}
            height={36}
            onError={() => setLogoFailed(true)}
            className="h-7 w-36 object-contain object-left"
          />
        ) : (
          <span className="max-w-36 truncate text-sm font-bold">
            {company?.name || '회사'}
          </span>
        )}

        <div className="flex gap-6 text-sm font-medium">
          {rentalData.categories?.map((cat: any, i: number) => (
            <a
              key={i}
              href="#"
              className="transition hover:text-sky-600"
            >
              {cat.name}
            </a>
          ))}
          <a href="#apply" className="font-bold text-sky-600">
            렌탈신청
          </a>
        </div>
      </nav>

      {/* 히어로: 혜택 강조형 */}
      <section className="border-b border-slate-100 bg-white px-6 py-16 text-center">
        <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">
          합리적인 {company.name} 렌탈 서비스
        </h1>
        <p className="mx-auto max-w-2xl text-slate-500">
          초기 비용 부담 없이 최고의 제품을 경험하세요.
          <br />
          최적의 맞춤 플랜을 제안해 드립니다.
        </p>
      </section>

      {/* 상품 리스트 */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {rentalData.products?.map((product: any, idx: number) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 flex gap-1">
                  {product.tags?.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5">
                <h3 className="mb-2 font-bold text-slate-900">
                  {product.name}
                </h3>
                <div className="mb-4 flex items-baseline gap-1">
                  <span className="text-lg font-extrabold text-sky-600">
                    {product.price}원
                  </span>
                  <span className="text-xs text-slate-400">
                    / {product.rentalPeriod}
                  </span>
                </div>
                <button className="w-full rounded-lg bg-slate-900 py-2 text-xs font-bold text-white transition hover:bg-slate-800">
                  상세보기 및 신청
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 렌탈 프로세스 */}
      <section className="border-t border-slate-100 bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-12 text-2xl font-bold">간편한 신청 절차</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {rentalData.rentalProcess?.map((step: any, idx: number) => (
              <div key={idx} className="relative flex flex-col items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-600">
                  {step.step}
                </div>
                <h4 className="mb-2 text-sm font-bold">{step.title}</h4>
                <p className="text-xs text-slate-500">{step.description}</p>
                {idx < 3 && (
                  <div className="absolute left-[60%] top-6 -z-10 hidden h-px w-full bg-slate-200 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 px-6 py-12 text-center text-xs text-slate-400">
        <p>
          © {new Date().getFullYear()} {company.name}. All rights reserved.
        </p>
      </footer>
    </div>
  );
};