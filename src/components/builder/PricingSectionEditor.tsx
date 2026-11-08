'use client';

import type { Dispatch, SetStateAction } from 'react';
import { getPageSections, moveItem, newPricingCard, type PageSection, type PricingCard, type PricingSection } from '@/lib/pricing-sections';
import { medinsurePlans } from '@/lib/medinsure/plans';

const control = 'rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-30';
const input = 'mt-1 block w-full rounded border border-slate-300 px-2 py-1.5 text-sm';

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block text-xs font-semibold">{label}
    <input className={input} value={value} onChange={(event) => onChange(event.target.value)} />
  </label>;
}

function Actions({ index, count, move, remove, name }: {
  index: number; count: number; move: (by: number) => void; remove?: () => void; name: string;
}) {
  return <div className="flex flex-wrap gap-1">
    <button type="button" className={control} disabled={index === 0} onClick={() => move(-1)} aria-label={`${name} 위로 이동`}>↑</button>
    <button type="button" className={control} disabled={index === count - 1} onClick={() => move(1)} aria-label={`${name} 아래로 이동`}>↓</button>
    {remove && <button type="button" className={control} onClick={remove} aria-label={`${name} 삭제`}>삭제</button>}
  </div>;
}

export default function PricingSectionEditor({ data, siteId, setData }: {
  data: Parameters<typeof getPageSections>[0]; siteId?: string | null;
  setData: Dispatch<SetStateAction<any>>;
}) {
  const sections = getPageSections(data, siteId);
  const update = (edit: (sections: PageSection[]) => PageSection[]) => {
    setData((previous: Parameters<typeof getPageSections>[0]) => ({ ...previous, inlineSections: edit(getPageSections(previous, siteId)) }));
  };
  const editSection = (id: string, edit: (section: PricingSection) => PricingSection) =>
    update((items) => items.map((item) => item.id === id && item.pricing ? { ...item, pricing: edit(item.pricing) } : item));

  return <section aria-label="섹션 관리" className="space-y-3 rounded-xl border border-slate-200 bg-white p-3 text-slate-900">
    <label className="block text-sm font-bold">섹션 추가
      <select className={input} value="" onChange={(event) => {
        if (event.target.value !== 'pricing') return;
        const id = crypto.randomUUID();
        const section = { id, title: '요금제 카드', description: '', highlighted: '', cards: [newPricingCard()] };
        update((items) => [...items, { id, pricing: section }]);
      }}>
        <option value="">섹션 선택</option><option value="pricing">요금제 카드</option>
      </select>
    </label>
    {sections.map(({ id, pricing }, index) => {
      const name = pricing?.title || (pricing ? '요금제 카드' : '기존 메인 콘텐츠');
      return <div key={id} className="space-y-2 rounded-lg border border-slate-200 p-2">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <span className="text-xs font-bold">{index + 1}. {name}</span>
          {pricing && <Actions name={name} index={index} count={sections.length}
            move={(by) => update((items) => moveItem(items, index, by))}
            remove={() => update((items) => items.filter((item) => item.id !== id))} />}
        </div>
        {pricing && <>
          <button type="button" className={control} onClick={() => {
            const copy = structuredClone(pricing);
            copy.id = crypto.randomUUID();
            update((items) => [...items.slice(0, index + 1), { id: copy.id, pricing: copy }, ...items.slice(index + 1)]);
          }}>섹션 복제</button>
          <details className="rounded bg-slate-50 p-2">
            <summary className="cursor-pointer text-sm font-semibold">요금제 카드 편집</summary>
            <div className="mt-2 space-y-2">
              <Field label="섹션 제목" value={pricing.title} onChange={(title) => editSection(id, (section) => ({ ...section, title }))} />
              <Field label="섹션 설명" value={pricing.description} onChange={(description) => editSection(id, (section) => ({ ...section, description }))} />
              <label className="block text-xs font-semibold">강조 카드
                <select className={input} value={pricing.highlighted} onChange={(event) => {
                  const highlighted = event.target.value;
                  editSection(id, (section) => ({ ...section, highlighted }));
                }}>
                  <option value="">강조 없음</option>
                  {pricing.cards.map((card) => <option key={card.id} value={card.id}>{card.title || '제목 없음'}</option>)}
                </select>
              </label>
              {pricing.cards.map((card, cardIndex) => {
                const editCard = (edit: (current: PricingCard) => PricingCard) => editSection(id, (section) =>
                  ({ ...section, cards: section.cards.map((item) => item.id === card.id ? edit(item) : item) }));
                return <details key={card.id} className="rounded border bg-white p-2">
                  <summary className="cursor-pointer text-sm font-bold">{cardIndex + 1}. {card.title || '제목 없음'}</summary>
                  <div className="mt-2 space-y-2">
                    <Actions name={`카드 ${cardIndex + 1}`} index={cardIndex} count={pricing.cards.length}
                      move={(by) => editSection(id, (section) => ({ ...section, cards: moveItem(section.cards, cardIndex, by) }))}
                      remove={() => editSection(id, (section) => ({ ...section,
                        highlighted: section.highlighted === card.id ? '' : section.highlighted,
                        cards: section.cards.filter((item) => item.id !== card.id) }))} />
                    {([['title', '카드 제목'], ['description', '카드 설명'], ['badge', '인원 배지'],
                      ['price', '표시 요금'], ['button', '버튼 문구']] as const).map(([key, label]) =>
                      <Field key={key} label={label} value={card[key]} onChange={(value) => editCard((current) => ({ ...current, [key]: value }))} />)}
                    {siteId === 'medinsure' && <label className="block text-xs font-semibold">서버 상품
                      <select className={input} value={card.product || ''} onChange={(event) => {
                        const product = event.target.value;
                        editCard((current) => ({ ...current, product }));
                      }}>
                        <option value="">연결 없음</option>
                        {medinsurePlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
                      </select>
                    </label>}
                    <p className="text-xs text-slate-600">표시 요금은 실제 청구 금액에 영향을 주지 않습니다.</p>
                    <fieldset className="space-y-2 border-t pt-2">
                      <legend className="text-xs font-bold">정보 행</legend>
                      {card.rows.map((row, rowIndex) => <div key={row.id} className="space-y-1 rounded bg-slate-50 p-2">
                        <Field label="항목명" value={row.label} onChange={(label) => editCard((current) => ({ ...current, rows: current.rows.map((item) => item.id === row.id ? { ...item, label } : item) }))} />
                        <Field label="내용" value={row.value} onChange={(value) => editCard((current) => ({ ...current, rows: current.rows.map((item) => item.id === row.id ? { ...item, value } : item) }))} />
                        <Actions name={`정보 행 ${rowIndex + 1}`} index={rowIndex} count={card.rows.length}
                          move={(by) => editCard((current) => ({ ...current, rows: moveItem(current.rows, rowIndex, by) }))}
                          remove={() => editCard((current) => ({ ...current, rows: current.rows.filter((item) => item.id !== row.id) }))} />
                      </div>)}
                      <button type="button" className={control} onClick={() => {
                        const row = { id: crypto.randomUUID(), label: '', value: '' };
                        editCard((current) => ({ ...current, rows: [...current.rows, row] }));
                      }}>정보 행 추가</button>
                    </fieldset>
                    <fieldset className="space-y-2 border-t pt-2">
                      <legend className="text-xs font-bold">기본 제공 항목</legend>
                      {card.features.map((feature, featureIndex) => <div key={feature.id} className="space-y-1">
                        <Field label={`제공 항목 ${featureIndex + 1}`} value={feature.text} onChange={(text) => editCard((current) => ({
                          ...current, features: current.features.map((item) => item.id === feature.id ? { ...item, text } : item),
                        }))} />
                        <Actions name={`제공 항목 ${featureIndex + 1}`} index={featureIndex} count={card.features.length}
                          move={(by) => editCard((current) => ({ ...current, features: moveItem(current.features, featureIndex, by) }))}
                          remove={() => editCard((current) => ({ ...current, features: current.features.filter((item) => item.id !== feature.id) }))} />
                      </div>)}
                      <button type="button" className={control} onClick={() => {
                        const feature = { id: crypto.randomUUID(), text: '' };
                        editCard((current) => ({ ...current, features: [...current.features, feature] }));
                      }}>제공 항목 추가</button>
                    </fieldset>
                  </div>
                </details>;
              })}
              <button type="button" className={control} onClick={() => {
                const card = newPricingCard();
                editSection(id, (section) => ({ ...section, cards: [...section.cards, card] }));
              }}>카드 추가</button>
            </div>
          </details>
        </>}
      </div>;
    })}
  </section>;
}
