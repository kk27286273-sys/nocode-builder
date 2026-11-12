import Link from 'next/link';
import NexiaRefundPolicy from '@/components/home/NexiaRefundPolicy';

export default function RefundPage() {
  return <main className="min-h-screen bg-slate-50 px-6 py-16">
    <div className="mx-auto max-w-3xl">
      <Link href="/nexia" className="mb-8 inline-flex text-sm font-semibold text-slate-600">← NEXIA로 돌아가기</Link>
      <h1 className="mb-4 text-4xl font-bold text-slate-900">NEXIA 해지·환불 안내</h1>
      <p className="mb-8 text-sm text-slate-500">개정안: 2026년 11월 11일 · 운영 반영 시 시행</p>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700"><NexiaRefundPolicy /></div>
    </div>
  </main>;
}
