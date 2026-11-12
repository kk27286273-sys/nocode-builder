'use client';

import { useState, type ReactNode } from 'react';
import MedinsureSubscriptions from './MedinsureSubscriptions';
import { AppWindow, ShieldCheck, Check, ChevronDown } from 'lucide-react';

export default function ProductPlans({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<'nexia' | 'medinsure' | null>(null);
  return (
    <section aria-labelledby="products-heading" className="bg-slate-50 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-sm font-bold tracking-[0.25em] text-blue-600">THSOFT SOLUTIONS</p>
        <h2 id="products-heading" className="mt-3 text-center text-3xl font-bold tracking-tight md:text-5xl">비즈니스에 맞는 솔루션</h2>
        <p className="mt-5 text-center text-slate-600">원하는 제품을 선택하고 요금제를 확인하세요.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {([
            { id: 'nexia', name: 'NEXIA', description: '홈페이지 제작 솔루션', detail: '브랜드를 담는 홈페이지, 제작부터 운영까지' },
            { id: 'medinsure', name: 'MedinSure', description: '보험 업무 지원 솔루션', detail: 'PROBE 병력분석과 분석 리포트' },
          ] as const).map(product => (
            <button key={product.id} id={`${product.id}-selector`} type="button"
              aria-expanded={selected === product.id} aria-controls={`${product.id}-plans`}
              onClick={() => setSelected(current => current === product.id ? null : product.id)}
              className={`flex items-center gap-4 rounded-2xl border p-4 text-left md:gap-6 md:px-8 md:py-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 ${selected === product.id ? 'border-blue-600 bg-gradient-to-r from-white to-blue-50 ring-1 ring-blue-600' : 'border-slate-200 bg-white hover:border-blue-300'}`}>
              {product.id === 'nexia' ? <AppWindow aria-hidden="true" className="h-7 w-7 shrink-0 text-blue-600 md:h-9 md:w-9" /> : <ShieldCheck aria-hidden="true" className="h-7 w-7 shrink-0 text-slate-900 md:h-9 md:w-9" />}
              <span className="flex-1"><span className="block text-lg font-bold md:text-2xl">{product.name}</span><span className="mt-1 block text-xs text-slate-600 md:text-sm">{product.description}</span></span>
              {selected === product.id ? <Check aria-hidden="true" className="h-6 w-6 rounded-full bg-blue-600 p-1 text-white" /> : <ChevronDown aria-hidden="true" className="h-6 w-6 text-slate-500" />}
            </button>
          ))}
        </div>
        {(['nexia', 'medinsure'] as const).map(product => (
          <div key={product} id={`${product}-plans`} role="region" aria-labelledby={`${product}-selector`}
            aria-hidden={selected !== product} inert={selected !== product}
            className="grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none"
            style={{ gridTemplateRows: selected === product ? '1fr' : '0fr', opacity: selected === product ? 1 : 0 }}>
            <div className="min-h-0 overflow-hidden">
              {product === 'nexia' ? children : (
                <MedinsureSubscriptions />
              )}
            </div>
          </div>
        ))}
        {selected === 'nexia' && <button type="button" onClick={() => setSelected('medinsure')} className="mt-8 flex w-full flex-wrap items-center gap-4 rounded-2xl bg-blue-50 p-5 text-left md:p-7">
          <ShieldCheck aria-hidden="true" className="h-8 w-8 shrink-0 text-blue-600" />
          <span className="flex-1"><span className="block font-bold">MedinSure도 함께 확인해보세요.</span><span className="mt-1 block text-xs text-slate-600 md:text-sm">선택하면 PROBE 병력분석을 포함한 요금제가 펼쳐집니다.</span></span>
          <span className="font-bold text-blue-600">월 22,000원 <span className="text-xs font-normal">VAT 포함</span></span>
          <ChevronDown aria-hidden="true" className="h-5 w-5 text-blue-600" />
        </button>}
      </div>
    </section>
  );
}

