import Link from 'next/link';
import type { ReactNode } from 'react';
import { getPageSections, type PricingSection } from '@/lib/pricing-sections';
import { medinsurePlans } from '@/lib/medinsure/plans';

export function PricingCards({ section, checkout, onSelect, selected }: {
  section: PricingSection;
  checkout?: boolean;
  onSelect?: (product: string) => void;
  selected?: string;
}) {
  return <section id={section.id} aria-label={section.title || '요금제 카드'} className="@container border-y border-slate-200 bg-slate-50 px-5 py-14 text-slate-950">
    <div className="mx-auto max-w-7xl">
      {section.title && <h2 className="text-center text-3xl font-black">{section.title}</h2>}
      {section.description && <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-slate-600">{section.description}</p>}
      <div className="mt-8 grid grid-cols-1 gap-4 @min-[560px]:grid-cols-2 @min-[1020px]:grid-cols-4">
        {section.cards.map((card) => {
          const product = medinsurePlans.find((plan) => plan.id === card.product);
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
  const main = sections.findIndex((section) => !section.pricing);
  const render = (items: typeof sections) => items.map((section) => section.pricing &&
    <PricingCards key={section.id} section={section.pricing} checkout={siteId === 'medinsure'} />);
  return children(render(sections.slice(0, main)), render(sections.slice(main + 1)));
}
