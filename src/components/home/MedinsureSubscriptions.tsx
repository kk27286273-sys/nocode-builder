'use client';
import { useState } from 'react';
import { initialPolicy, plansFor, quoteMedinsure } from '@/lib/medinsure/plans';
const plans = plansFor(initialPolicy);
export default function MedinsureSubscriptions() {
 const [group,setGroup]=useState<'individual'|'ga'>('individual');
 const [seats,setSeats]=useState('2');
 const quote=quoteMedinsure('ga-2',Number(seats));
 return <div className="pt-10 pb-2">
  <div className="flex gap-2" aria-label="구독 종류">
   {(['individual','ga'] as const).map(value=><button key={value} type="button" aria-pressed={group===value} onClick={()=>setGroup(value)} className={`rounded-xl px-6 py-3 font-bold ${group===value?'bg-blue-600 text-white':'bg-white text-slate-700'}`}>{value==='individual'?'개인 구독':'GA 단체 구독'}</button>)}
  </div>
  <p className="my-6 text-sm text-slate-600">모든 금액은 VAT 포함입니다. 모든 요금제는 PROBE 병력분석 · 분석 리포트 · 프로그램 업데이트를 제공합니다.</p>
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
   {plans.filter(p=>p.group===group).map(p=><article key={p.id} className="flex flex-col rounded-2xl border border-blue-100 bg-white p-6">
    <span className="text-sm font-bold text-blue-600">{p.discount}% 할인</span><h3 className="mt-3 text-2xl font-bold">{p.name}</h3>
    <p className="mt-6 text-3xl font-bold text-blue-600">{(p.unit*p.months).toLocaleString('ko-KR')}원</p>
    <p className="mt-2 text-sm text-slate-600">{group==='individual'?`${p.months}개월 전액 선결제 · ${p.months}개월마다 자동결제`:'1인당 월 요금 · 대표자 일괄 결제'}</p>
    <ul className="my-6 space-y-2 text-sm"><li>✓ PROBE 병력분석</li><li>✓ 분석 리포트</li><li>✓ 프로그램 업데이트</li></ul>
    <button type="button" disabled className="mt-auto cursor-not-allowed rounded-xl bg-slate-100 p-3 font-semibold text-slate-500">결제 준비 중</button>
   </article>)}
  </div>
  {group==='ga' && <div className="mt-6 rounded-2xl bg-blue-50 p-6"><label className="font-semibold">계약 인원 <input aria-label="계약 인원" type="number" min="2" max="10000" step="1" value={seats} onChange={e=>setSeats(e.target.value)} className="ml-3 w-28 rounded-lg border bg-white p-2" /></label>
   <p className="mt-4" aria-live="polite">{quote?`${quote.seats}명 × ${quote.plan.unit.toLocaleString('ko-KR')}원 = 월 ${quote.amount.toLocaleString('ko-KR')}원 (VAT 포함)`:'2~10,000 사이의 정수 인원을 입력하세요.'}</p>
   <p className="mt-3 text-sm text-slate-600">현재 할인표 그대로 계산한 예상 금액입니다. 할인 경계에서 총액이 낮아질 수 있으며 최소 청구액을 임의로 적용하지 않습니다. 계약 중 인원 변경·정산은 정책 확정 전까지 제공하지 않습니다.</p></div>}
  <details className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600"><summary className="cursor-pointer font-bold text-slate-900">자동결제 · 해지 · 구독 정책 안내</summary>
   <p className="mt-4">개인 상품은 선택한 기간 전체를 선결제하고 동일 기간·금액으로 자동갱신합니다. GA 상품은 월 단위로 대표자가 일괄 결제하며 계약 좌석 범위에서 이용권을 배정합니다. 무료 체험은 관리자가 별도로 지급할 수 있습니다.</p>
   <p>자동갱신을 해지해도 다음 결제 예정 시점까지 이용할 수 있습니다. 최초 정기결제 실패부터 3일간 이용권을 유지하고 재결제하며, 최초 시도 포함 총 3회 실패 시 구독 종료 및 신규 분석이 제한됩니다.</p>
   <p>최초 결제일과 계약 개월 수를 기준으로 갱신합니다. 해당 날짜가 없는 달에는 말일에 결제한 후 원래 기준일로 복원합니다. 2월 29일 기준은 비윤년 3월 1일 특례를 적용합니다.</p>
   <p>환불·GA 인원 변경·세부 재시도 일정은 확정 전입니다. 전용 이용약관과 동의 절차를 마련한 뒤 THsoft에서 결제를 제공합니다. 현재 결제는 진행되지 않습니다.</p>
  </details>
 </div>;
}
