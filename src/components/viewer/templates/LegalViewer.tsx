// src/components/viewer/templates/LegalViewer.tsx

'use client';

import React, { useState } from 'react';

interface Props {
  data: any;
  setData?: React.Dispatch<React.SetStateAction<any>>;
  editable?: boolean;
}

export default function LegalViewer({ data, setData, editable = false }: Props) {
  const [selectedCase, setSelectedCase] = useState<number | null>(null);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      {/* ===== HERO ===== */}
      <section className="border-b border-slate-800 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Law & Tax
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
              {data?.hero?.title || '신뢰할 수 있는 법률 파트너'}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              {data?.hero?.subtitle || '의뢰인의 권리를 지키는 전문적인 법률 서비스'}
            </p>
            <button className="mt-8 rounded-lg bg-blue-600 px-8 py-3 font-bold text-white transition hover:bg-blue-700">
              상담 신청하기 →
            </button>
          </div>
        </div>
      </section>

      {/* ===== 서비스 ===== */}
      <section className="border-b border-slate-800 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">전문성으로 신뢰를 쌓습니다</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {(data?.services || []).map((s: any, idx: number) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <div className="text-4xl">{s.icon}</div>
                <h3 className="mt-4 font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 성공 사례 ===== */}
      <section className="border-b border-slate-800 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">최근 성공 사례</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {(data?.successCases || []).map((c: any, idx: number) => (
              <div
                key={idx}
                onClick={() => setSelectedCase(idx)}
                className="group cursor-pointer rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 transition hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/20"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                      {c.category}
                    </p>
                    <h3 className="mt-2 text-lg font-bold">{c.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500">{c.year}</p>
                </div>
                <p className="mt-4 rounded-lg bg-blue-600/10 px-3 py-2 text-sm font-semibold text-blue-300">
                  ✓ {c.result}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 상담 폼 ===== */}
      <section className="border-b border-slate-800 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold">비밀 보장 1:1 상담</h2>
          <p className="mt-4 text-slate-400">
            변호사 비밀유지 특권으로 완벽하게 보호됩니다.
          </p>
          <form className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-semibold">이름</label>
              <input
                type="text"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">연락처</label>
              <input
                type="tel"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">상담 내용</label>
              <textarea
                rows={4}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-bold transition hover:bg-blue-700"
            >
              상담 신청하기
            </button>
          </form>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="px-6 py-12">
        <div className="mx-auto max-w-6xl border-t border-slate-800 pt-8">
          <p className="font-bold">{data?.footer?.companyName || 'Law & Tax'}</p>
          <p className="mt-2 text-sm text-slate-500">
            신뢰를 기반으로 한 법률·세무·노무 자문
          </p>
          <div className="mt-6 flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white">이용약관</a>
            <a href="#" className="hover:text-white">개인정보 처리방침</a>
            <a href="#" className="hover:text-white">카톡 실시간 상담</a>
          </div>
          <p className="mt-8 text-xs text-slate-600">
            © 2026 {data?.footer?.companyName || 'Law & Tax'}. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ===== 사례 상세 모달 ===== */}
      {selectedCase !== null && (data?.successCases || []).length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className="max-w-md rounded-xl bg-slate-900 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCase(null)}
              className="float-right text-2xl text-slate-400 hover:text-white"
            >
              ×
            </button>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
              {data?.successCases?.[selectedCase]?.category}
            </p>
            <h3 className="mt-3 text-2xl font-bold">{data?.successCases?.[selectedCase]?.title}</h3>
            <p className="mt-4 rounded-lg bg-blue-600/10 px-3 py-2 text-sm font-semibold text-blue-300">
              ✓ {data?.successCases?.[selectedCase]?.result}
            </p>
            <p className="mt-4 text-slate-400">{data?.successCases?.[selectedCase]?.description}</p>
            <p className="mt-6 text-xs text-slate-500">{data?.successCases?.[selectedCase]?.year}</p>
          </div>
        </div>
      )}
    </div>
  );
}