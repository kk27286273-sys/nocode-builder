import Link from 'next/link';
import { useState, useEffect, type ReactNode } from 'react';
import { getPageSections, medinsurePricing, type PricingSection } from '@/lib/pricing-sections';
import { initialPolicy, plansFor, quoteMedinsure, validPolicy, type PricingPolicy } from '@/lib/medinsure/plans';

export function usePricing() {
  const [policy, setPolicy] = useState(initialPolicy);
  useEffect(() => {
    const controller = new AbortController();
    const refresh = () => fetch('/api/medinsure/pricing', { signal: controller.signal }).then((response) => response.json())
      .then((result) => { if (validPolicy(result.policy)) setPolicy(result.policy); }).catch(() => {});
    void refresh();
    window.addEventListener('medinsure-pricing-published', refresh);
    return () => { controller.abort(); window.removeEventListener('medinsure-pricing-published', refresh); };
  }, []);
  return policy;
}

export function PricingCards({ section, checkout, onSelect, selected, policy }: {
  section: PricingSection;
  checkout?: boolean;
  onSelect?: (product: string) => void;
  selected?: string;
  policy?: PricingPolicy;
}) {
  const [tab, setTab] = useState<'individual' | 'ga'>('individual');
  const [seats, setSeats] = useState(2);
  const catalog = plansFor(policy ?? initialPolicy);
  const generated = policy ? medinsurePricing(policy) : null;
  const selectedGroup = catalog.find((plan) => plan.id === selected)?.group;
  useEffect(() => { if (selectedGroup) setTab(selectedGroup); }, [selectedGroup]);
  const cards = section.cards.flatMap((card) => {
    if (!generated || !card.product) return [card];
    const current = generated.cards.find((item) => item.product === card.product);
    if (!current) return [];
    return [{ ...card, price: current.price, rows: card.rows.map((row) =>
      current.rows.find((entry) => entry.id === row.id) ? { ...row, value: current.rows.find((entry) => entry.id === row.id)!.value } : row) }];
  });
  const gaQuote = policy ? quoteMedinsure(catalog.find((plan) => plan.group === 'ga')?.id, seats, policy) : null;
  return <section id={section.id} aria-label={section.title || '요금제 카드'} className="@container border-y border-slate-200 bg-slate-50 px-5 py-14 text-slate-950">
    <div className="mx-auto max-w-7xl">
      {section.title && <h2 className="text-center text-3xl font-black">{section.title}</h2>}
      {section.description && <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-slate-600">{section.description}</p>}
      {policy && <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button type="button" aria-pressed={tab === 'individual'} className={tab === 'individual' ? 'rounded bg-blue-700 px-4 py-2 text-white' : 'rounded border px-4 py-2'} onClick={() => setTab('individual')}>개인</button>
        <button type="button" aria-pressed={tab === 'ga'} className={tab === 'ga' ? 'rounded bg-blue-700 px-4 py-2 text-white' : 'rounded border px-4 py-2'} onClick={() => setTab('ga')}>GA</button>
        {tab === 'ga' && <label className="text-sm">GA 인원 <input type="number" min={2} max={10000} className="w-24 rounded border p-2" value={Number.isNaN(seats) ? '' : seats} onChange={(e) => setSeats(e.currentTarget.valueAsNumber)} />
          {gaQuote && <span className="ml-3 font-bold">{gaQuote.plan.unit.toLocaleString('ko-KR')}원/인 · 월 {gaQuote.amount.toLocaleString('ko-KR')}원</span>}
        </label>}
      </div>}
      <div className="mt-8 grid grid-cols-1 gap-4 @min-[560px]:grid-cols-2 @min-[1020px]:grid-cols-4">
        {cards.filter((card) => !policy || !card.product || catalog.find((plan) => plan.id === card.product)?.group === tab).map((card) => {
          const product = catalog.find((plan) => plan.id === card.product);
          const emphasis = section.highlighted === card.id;
          const buttonStyle = emphasis ? 'bg-blue-700 text-white hover:bg-blue-800' : 'border border-slate-300 bg-white text-slate-900 hover:border-blue-600 hover:text-blue-800';
          return <article key={card.id} className={`flex min-w-0 flex-col break-words rounded-2xl border bg-white p-5 shadow-sm ${emphasis ? 'border-blue-600 ring-1 ring-blue-600' : 'border-slate-200'}`}>
            <header>
              {card.badge && <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">{card.badge}</span>}
              {card.title && <h3 className="mt-3 text-xl font-black">{card.title}</h3>}
              {card.description && <p className="mt-2 text-sm text-slate-600">{card.description}</p>}
            </header>
            {card.price && <p className="mt-6 text-xl font-black tracking-tight">{card.price}</p>}
            {card.rows.length > 0 && <dl className="mt-4 divide-y divide-slate-100 border-y border-slate-100">
              {card.rows.map((row) => <div key={row.id} className="flex justify-between gap-2 py-2 text-sm">
                <dt className="text-slate-600">{row.label}</dt><dd className="text-right font-semibold">{row.value}</dd>
              </div>)}
            </dl>}
            {card.features.length > 0 && <div className="mt-5 pb-5">
              <p className="text-xs font-bold">기본 제공</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-700">{card.features.map((feature) =>
                <li key={feature.id} className="flex gap-2"><span className="font-bold text-blue-700" aria-hidden="true">✓</span>{feature.text}</li>)}</ul>
            </div>}
            <div className="mt-auto pt-2">
              {card.button && (onSelect && product ?
                <button type="button" aria-pressed={selected === product.id} onClick={() => onSelect(product.id)}
                  className={`block w-full rounded-lg px-3 py-2.5 text-center text-sm font-bold ${buttonStyle}`}>{card.button}<span className="sr-only"> · {card.title}</span></button> :
                checkout && product ? <Link href={`/medinsure?plan=${product.id}#quote-controls`}
                  className={`block rounded-lg px-3 py-2.5 text-center text-sm font-bold ${buttonStyle}`}>{card.button}<span className="sr-only"> · {card.title}</span></Link> :
                  <button type="button" disabled className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-500">{card.button}</button>)}
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}

export default function PaymentSection({ data, siteId, children }: {
  data: Parameters<typeof getPageSections>[0]; siteId?: string | null;
  children: (beforeMain: ReactNode, afterMain: ReactNode) => ReactNode;
}) {
  const sections = getPageSections(data, siteId);
  const policy = usePricing();
  const main = sections.findIndex((section) => !section.pricing);
  const render = (items: typeof sections) => items.map((section) => section.pricing &&
    <PricingCards key={section.id} section={section.id === 'medinsure-pricing' && !data?.inlineSections
      ? { ...medinsurePricing(policy), title: section.pricing.title, description: section.pricing.description }
      : section.pricing} checkout={siteId === 'medinsure'} policy={siteId === 'medinsure' ? policy : undefined} />);
  return children(render(sections.slice(0, main)), render(sections.slice(main + 1)));
}
