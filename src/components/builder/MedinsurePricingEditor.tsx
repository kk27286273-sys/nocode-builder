'use client';

import { useEffect, useState } from 'react';
import { initialPolicy, validPolicy, type PricingPolicy } from '@/lib/medinsure/plans';
import { moveItem } from '@/lib/pricing-sections';
import { pricingReview } from '@/lib/pricing-review';

export default function MedinsurePricingEditor() {
  const [policy, setPolicy] = useState<PricingPolicy>(initialPolicy);
  const [version, setVersion] = useState(0);
  const [effective, setEffective] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [group, setGroup] = useState<'individual' | 'ga'>('individual');
  useEffect(() => {
    fetch('/api/medinsure/pricing').then((res) => res.json()).then((result) => {
      if (validPolicy(result.policy)) { setPolicy(result.policy); setVersion(result.version); }
      else if (!pricingReview) setStatus('활성 정책을 읽을 수 없습니다.');
    }).catch(() => setStatus('활성 정책을 읽을 수 없습니다.'));
  }, []);
  const base = group === 'individual' ? 'individualBase' : 'gaBase';
  const edit = (index: number, key: 'threshold' | 'discount', value: number) => setPolicy((current) => ({
    ...current, [group]: current[group].map((row, i) => i === index ? { ...row, id: row.id ?? String(row.threshold), [key]: value } : row),
  }));
  async function publish() {
    if (!validPolicy(policy) || !window.confirm('신규 견적에 적용할 요금 정책을 게시할까요? 기존 구독은 변경되지 않습니다.')) return;
    setBusy(true);
    try {
      const response = await fetch('/api/medinsure/pricing', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policy, effectiveAt: effective ? new Date(effective).toISOString() : null }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setStatus(`버전 ${result.version} 저장 · 적용일 ${new Date(result.effective_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`);
      window.dispatchEvent(new Event('medinsure-pricing-published'));
    } catch (error) { setStatus(error instanceof Error ? error.message : '저장에 실패했습니다.'); }
    finally { setBusy(false); }
  }
  return <details className="rounded-xl border bg-white p-3 text-slate-900">
    <summary className="cursor-pointer font-bold">MedinSure 요금 정책</summary>
    <p className="my-2 text-xs">현재 활성 버전 {version} · 신규 견적용</p>
    <div className="flex gap-2">
      <button type="button" aria-pressed={group === 'individual'} className="rounded border px-2" onClick={() => setGroup('individual')}>개인</button>
      <button type="button" aria-pressed={group === 'ga'} className="rounded border px-2" onClick={() => setGroup('ga')}>GA</button>
    </div>
    <label className="my-3 block text-sm">월 기본료 <input className="w-24 rounded border px-1" type="number" value={policy[base]} onChange={(e) => setPolicy({ ...policy, [base]: +e.target.value })} /></label>
    {policy[group].map((row, i) => {
      const unit = Math.round(policy[base] * (100 - row.discount) / 100);
      return <div key={i} className="mb-2 rounded border p-2 text-xs">
        <label>{group === 'individual' ? '개월' : '시작 인원'} <input className="w-16 rounded border" type="number" value={row.threshold} onChange={(e) => edit(i, 'threshold', +e.target.value)} /></label>
        <label className="ml-2">할인율 % <input className="w-12 rounded border" type="number" value={row.discount} onChange={(e) => edit(i, 'discount', +e.target.value)} /></label>
        <p className="py-1">월 단가 {unit.toLocaleString('ko-KR')}원 · {group === 'individual' ? '기간 총액' : '시작 인원 총액'} {(unit * row.threshold).toLocaleString('ko-KR')}원</p>
        <button type="button" disabled={!i} className="mr-2" onClick={() => setPolicy({ ...policy, [group]: moveItem(policy[group], i, -1) })}>↑</button>
        <button type="button" disabled={i === policy[group].length - 1} className="mr-2" onClick={() => setPolicy({ ...policy, [group]: moveItem(policy[group], i, 1) })}>↓</button>
        <button type="button" onClick={() => setPolicy({ ...policy, [group]: policy[group].filter((_, j) => i !== j) })}>삭제</button>
      </div>;
    })}
    <button type="button" className="rounded border px-2" onClick={() => setPolicy({ ...policy, [group]: [...policy[group], { threshold: Math.max(group === 'ga' ? 1 : 0, ...policy[group].map((row) => row.threshold)) + 1, discount: 0 }] })}>구간 추가</button>
    <label className="my-3 block text-xs">적용일 (비우면 즉시)
      <input type="datetime-local" className="block w-full rounded border" value={effective} onChange={(e) => setEffective(e.target.value)} />
    </label>
    <button type="button" disabled={busy || pricingReview || !validPolicy(policy)} className="rounded bg-blue-700 px-3 py-2 text-xs font-bold text-white disabled:opacity-50" onClick={publish}>요금 정책 게시</button>
    {status && <p role="status" className="mt-2 text-xs">{status}</p>}
  </details>;
}
