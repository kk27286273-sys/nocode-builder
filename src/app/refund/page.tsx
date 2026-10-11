'use client';

import Link from 'next/link';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex text-sm font-semibold text-slate-600 hover:text-slate-900 mb-8">
          ← 돌아가기
        </Link>

        <h1 className="text-4xl font-bold text-slate-900 mb-8">환불정책</h1>

        <div className="space-y-8 bg-white rounded-3xl p-8 border border-slate-200">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">구축비 환불</h2>
            <ul className="space-y-3 text-slate-700">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>작업 착수 전:</strong> 100% 환불</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>작업 착수 후:</strong> 50% 차감 후 환불</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>완성본 발송 후:</strong> 환불 불가</span>
              </li>
            </ul>
          </section>

          <hr className="border-slate-200" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">월간 구독료 환불</h2>
            <ul className="space-y-3 text-slate-700">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>구독 취소 시:</strong> 해당 월까지 서비스 제공 후 환불 없음</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>예: 10월 15일 취소 → 10월 31일까지 서비스 이용 가능</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>11월부터 청구 없음</span>
              </li>
            </ul>
          </section>

          <hr className="border-slate-200" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">환불 신청 절차</h2>
            <ol className="space-y-3 text-slate-700">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">1.</span>
                <span>고객센터로 환불 신청</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">2.</span>
                <span>신청 내용 검토 (1~2영업일)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">3.</span>
                <span>환불 처리 (카드사 기준 3~5영업일)</span>
              </li>
            </ol>
          </section>

          <hr className="border-slate-200" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">문의</h2>
            <p className="text-slate-700 mb-4">
              환불 관련 문의는 고객센터로 연락해주세요.
            </p>
            <Link 
              href="/#contact" 
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              고객센터 문의
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}