'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { medinsurePlans, quoteMedinsure } from '@/lib/medinsure/plans';
import { PricingCards } from '@/components/builder/PaymentSection';
import { defaultMedinsurePricing } from '@/lib/pricing-sections';
import { supabase } from '@/lib/supabase/client';

const won = (value: number) => `${value.toLocaleString('ko-KR')}원`;
type BillingSdk = (clientKey: string) => {
  payment(options: { customerKey: string }): {
    requestBillingAuth(options: { method: 'CARD'; successUrl: string; failUrl: string }): Promise<void>;
  };
};
let sdkPromise: Promise<BillingSdk> | undefined;

function billingSdk() {
  const browser = window as Window & { TossPayments?: BillingSdk };
  if (browser.TossPayments) return Promise.resolve(browser.TossPayments);
  sdkPromise ??= new Promise<BillingSdk>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v2/standard';
    script.onload = () => browser.TossPayments ? resolve(browser.TossPayments) : reject(new Error('결제창을 초기화하지 못했습니다.'));
    script.onerror = () => reject(new Error('결제창을 불러오지 못했습니다.'));
    document.head.append(script);
  }).catch((err) => { sdkPromise = undefined; throw err; });
  return sdkPromise;
}

export default function MedinsurePage() {
  const [plan, setPlan] = useState<(typeof medinsurePlans)[number]>(medinsurePlans[0]);
  const [seats, setSeats] = useState(1);
  const [quote, setQuote] = useState<ReturnType<typeof quoteMedinsure>>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [checkoutEnabled, setCheckoutEnabled] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [billingAccepted, setBillingAccepted] = useState(false);
  const [organization, setOrganization] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const fromCard = medinsurePlans.find((item) => item.id === new URLSearchParams(window.location.search).get('plan'));
    if (fromCard) { setPlan(fromCard); setSeats(fromCard.minimum); return; }
    try {
      const stored = JSON.parse(sessionStorage.getItem('medinsure-quote') || 'null');
      const saved = quoteMedinsure(stored?.plan, stored?.seats);
      if (saved) { setPlan(saved.plan); setSeats(saved.seats); }
    } catch { /* Ignore an invalid browser draft. */ }
  }, []);

  async function openOrder() {
    setError('');
    setBusy(true);
    try {
      const response = await fetch('/api/medinsure/quote', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.id, seats }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setQuote(result);
      setCheckoutEnabled(result.checkoutEnabled === true);
      setTermsAccepted(false); setBillingAccepted(false); setNeedsLogin(false);
      sessionStorage.setItem('medinsure-quote', JSON.stringify({ plan: plan.id, seats }));
      dialog.current?.showModal();
    } catch (error) {
      setError(error instanceof Error ? error.message : '견적을 불러오지 못했습니다.');
    } finally {
      setBusy(false);
    }
  }

  async function startCheckout() {
    if (!quote || !termsAccepted || !billingAccepted || busy) return;
    setBusy(true); setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setNeedsLogin(true); return; }
      const response = await fetch('/api/medinsure/test-checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ action: 'prepare', plan: quote.plan.id, seats: quote.seats, organization, termsAccepted, billingAccepted }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      const toss = await billingSdk();
      await toss(result.clientKey).payment({ customerKey: result.customerKey }).requestBillingAuth({
        method: 'CARD', successUrl: result.successUrl, failUrl: result.failUrl,
      });
    } catch (err) { setError(err instanceof Error ? err.message : '결제창을 열 수 없습니다.'); }
    finally { setBusy(false); }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white px-6 py-5">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4" aria-label="MedinSure">
          <Link href="/medinsure" className="text-xl font-black text-blue-800">MedinSure</Link>
          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            <Link href="/preview/medinsure">서비스 홈페이지</Link>
            <Link href="/organization">조직 관리</Link>
            <Link href="/medinsure/download">다운로드</Link>
          </div>
        </nav>
      </header>
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold text-sky-300">MEDINSURE FOR WINDOWS</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-black md:text-6xl">설계사의 병력자료 분석을 한곳에서</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">PDF와 Excel 자료를 PC에서 분석하세요. 개인과 조직 모두 같은 분석 기능을 사용합니다.</p>
          <a href="#plans" className="mt-8 inline-block rounded-lg bg-blue-600 px-5 py-3 font-bold text-white">요금제 보기</a>
        </div>
      </section>
      <div id="plans">
        <PricingCards section={defaultMedinsurePricing} selected={plan.id} onSelect={(product) => {
          const next = medinsurePlans.find((item) => item.id === product);
          if (next) { setPlan(next); setSeats(next.minimum); setError(''); document.getElementById('quote-controls')?.scrollIntoView({ block: 'center' }); }
        }} />
      </div>
      <section id="quote-controls" aria-label="계약 인원과 주문 확인" className="mx-auto max-w-6xl px-6 pb-14">
        <div className="mt-6 flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-5">
          <label className="text-sm font-semibold">계약 인원
            <input className="mt-1 block w-28 rounded border border-slate-300 p-2" type="number" min={plan.minimum} disabled={plan.id === 'solo'} value={Number.isNaN(seats) ? '' : seats} onChange={(e) => setSeats(e.currentTarget.valueAsNumber)} />
          </label>
          <button type="button" disabled={busy} onClick={openOrder} className="rounded-lg bg-blue-700 px-5 py-2 font-bold text-white disabled:opacity-50">주문 확인</button>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        </div>
      </section>
      <footer className="mx-auto flex max-w-6xl flex-wrap gap-4 px-6 pb-8 text-sm text-slate-600">
        <Link href="/medinsure/legal/terms">이용약관</Link>
        <Link href="/medinsure/legal/privacy">개인정보처리방침</Link>
        <Link href="/medinsure/legal/refund">환불정책</Link>
      </footer>
      <dialog ref={dialog} aria-labelledby="order-title" className="m-auto w-[min(90vw,30rem)] rounded-xl bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-950/60">
        <h2 id="order-title" className="text-xl font-bold">주문 확인</h2>
        {quote && <div className="mt-4 space-y-2">
          <p>{quote.plan.name} · {quote.seats}명 · 1인 {won(quote.plan.unit)} · 할인 {quote.plan.discount}%</p>
          <p className="font-bold">월 {won(quote.amount)} (VAT 포함)</p>
          <p className="text-sm">매월 자동 갱신 · 다음 갱신 중단 가능</p>
          <div className="flex flex-wrap gap-3 text-sm text-blue-800">
            <Link href="/medinsure/legal/terms">이용약관</Link>
            <Link href="/medinsure/legal/privacy">개인정보처리방침</Link>
            <Link href="/medinsure/legal/refund">청약철회·환불</Link>
          </div>
          {checkoutEnabled ? <div className="space-y-3 rounded bg-slate-50 p-3 text-sm">
            <p>테스트 모드 · 실제 청구와 자동 갱신은 발생하지 않습니다.</p>
            {quote.plan.id !== 'solo' && <label className="block">조직명<input className="mt-1 block w-full rounded border p-2" maxLength={100} value={organization} onChange={(e) => setOrganization(e.target.value)} /></label>}
            <label className="flex gap-2"><input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} /> 이용약관을 확인했습니다.</label>
            <label className="flex gap-2"><input type="checkbox" checked={billingAccepted} onChange={(e) => setBillingAccepted(e.target.checked)} /> 위 금액의 월 정기결제 조건과 테스트 카드 등록에 동의합니다.</label>
            <button type="button" className="rounded bg-blue-700 px-4 py-2 font-bold text-white disabled:opacity-50" disabled={!termsAccepted || !billingAccepted || busy}
              onClick={startCheckout}>토스 테스트 결제</button>
            {needsLogin && <Link className="block text-blue-800 underline" href="/organization?checkout=1">로그인 후 이어서 진행</Link>}
            {error && <p role="alert" className="text-red-700">{error}</p>}
          </div> : <p className="rounded bg-amber-50 p-3 text-sm">현재 서버 견적까지 확인할 수 있습니다. 결제 승인 단계는 열려 있지 않습니다.</p>}
        </div>}
        <form method="dialog" className="mt-5"><button className="rounded border px-4 py-2">닫기</button></form>
      </dialog>
    </main>
  );
}
