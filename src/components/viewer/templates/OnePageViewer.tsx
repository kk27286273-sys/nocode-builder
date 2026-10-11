'use client';

import React from 'react';

interface Props {
  data: any;
  setData?: React.Dispatch<React.SetStateAction<any>>;
  editable?: boolean;
}

export default function OnePageViewer({ data, setData, editable = false }: Props) {
  const hero = data?.hero || {};
  const cards = Array.isArray(data?.solutions) ? data.solutions : [];
  const projects = Array.isArray(data?.projects) ? data.projects : [];

  const addCard = () => {
    if (!setData) return;
    setData((prev: any) => ({
      ...prev,
      solutions: [
        ...(prev.solutions || []),
        { title: '새 카드', category: '카테고리', description: '설명을 입력하세요.', image: '' },
      ],
    }));
  };

  const removeCard = (idx: number) => {
    if (!setData) return;
    setData((prev: any) => ({
      ...prev,
      solutions: (prev.solutions || []).filter((_: any, i: number) => i !== idx),
    }));
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      {/* ===== HERO ===== */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-24 pb-16">
        <div className="max-w-4xl">
          {/* availability pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs font-medium text-slate-600">
              {hero.badge || '11월부터 새로운 작업을 받고 있습니다'}
            </span>
          </div>

          {/* headline */}
          <h1 className="mt-8 text-5xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
            {hero.title || '브랜드의 가치를'}
            <br />
            <span className="text-slate-400">{hero.titleSub || '한 페이지에 담습니다'}</span>
          </h1>

          {/* paragraph */}
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            {hero.subtitle || '웹사이트, 브랜드 아이덴티티, 디지털 프로덕트를 만듭니다. 스타트업부터 중견기업까지 함께 작업했습니다.'}
          </p>

          {/* CTA row */}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="#work"
              className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              {hero.ctaLabel || '작업 보기'}
            </a>
            <a
              href={`mailto:${data?.csCenter?.contactInfo?.email || 'hello@example.com'}`}
              className="text-sm font-medium text-slate-600 underline underline-offset-4 hover:text-slate-900"
            >
              {data?.csCenter?.contactInfo?.email || 'hello@example.com'}
            </a>
          </div>
        </div>
      </section>

      {/* ===== PROJECT STRIP (가로 스크롤) ===== */}
      <section id="work" className="w-full pb-20">
        <div
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            maskImage:
              'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
          }}
        >
          {(projects.length > 0
            ? projects
            : [
                { name: '프로젝트 A', client: 'Client A', year: '2025', tags: ['Web', 'Brand'] },
                { name: '프로젝트 B', client: 'Client B', year: '2025', tags: ['App', 'UI'] },
                { name: '프로젝트 C', client: 'Client C', year: '2024', tags: ['Web', 'SEO'] },
                { name: '프로젝트 D', client: 'Client D', year: '2024', tags: ['Brand', 'Print'] },
                { name: '프로젝트 E', client: 'Client E', year: '2023', tags: ['Web', 'CMS'] },
              ]
          ).map((p: any, i: number) => (
            <article
              key={i}
              className="w-[320px] shrink-0 snap-start overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <div className="relative h-44 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100">
                {p.image && (
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                )}
                <span className="absolute bottom-3 right-3 font-mono text-xs text-slate-500">
                  {p.year}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{p.client}</p>
                <div className="mt-4 flex gap-2">
                  {(p.tags || []).map((t: string, ti: number) => (
                    <span
                      key={ti}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-3 px-6 text-xs text-slate-400 md:hidden">
          옆으로 밀어서 더 보기 →
        </p>
      </section>

      {/* ===== CARD GRID (4개 기본 + 추가/삭제) ===== */}
      <section id="services" className="border-t border-slate-100 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">서비스</h2>
            {editable && (
              <button
                onClick={addCard}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
              >
                + 카드 추가
              </button>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(cards.length > 0
              ? cards
              : [
                  { title: '서비스 1', category: '카테고리', description: '설명을 입력하세요.' },
                  { title: '서비스 2', category: '카테고리', description: '설명을 입력하세요.' },
                  { title: '서비스 3', category: '카테고리', description: '설명을 입력하세요.' },
                  { title: '서비스 4', category: '카테고리', description: '설명을 입력하세요.' },
                ]
            ).map((c: any, i: number) => (
              <div
                key={i}
                className="group relative rounded-xl border border-slate-200 bg-white p-6 transition hover:shadow-md"
              >
                {editable && cards.length > 0 && (
                  <button
                    onClick={() => removeCard(i)}
                    className="absolute right-3 top-3 hidden h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white group-hover:flex"
                    aria-label="카드 삭제"
                  >
                    ×
                  </button>
                )}
                {c.image && (
                  <img src={c.image} alt={c.title} className="mb-4 h-32 w-full rounded-lg object-cover" />
                )}
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {c.category}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-semibold tracking-tight">함께 일해요</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Email</p>
              <p className="mt-2 font-medium">{data?.csCenter?.contactInfo?.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Phone</p>
              <p className="mt-2 font-medium">{data?.csCenter?.contactInfo?.phone}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Address</p>
              <p className="mt-2 text-sm font-medium">{data?.csCenter?.contactInfo?.address}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 text-slate-400">
        <div className="mx-auto max-w-6xl px-6 text-xs">
          <p className="font-semibold text-white">{data?.footer?.companyName}</p>
          <p className="mt-2">{data?.footer?.address}</p>
          <p className="mt-1">사업자등록번호: {data?.footer?.businessNumber}</p>
          <p className="mt-4 text-slate-600">
            © {new Date().getFullYear()} {data?.footer?.companyName}
          </p>
        </div>
      </footer>
    </div>
  );
}