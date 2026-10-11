'use client';

import React from 'react';

export default function CorporateLayout() {
  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">기업형 홈페이지</h1>
          <p className="text-lg text-blue-100">기업의 경쟁력과 가치를 체계적으로 전달합니다</p>
        </div>
      </header>

      {/* 본문 */}
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">회사소개</h2>
            <p className="text-slate-600">기업의 정체성과 미션을 소개합니다.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">사업소개</h2>
            <p className="text-slate-600">핵심 사업 분야와 경쟁력을 설명합니다.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">지속가능경영</h2>
            <p className="text-slate-600">ESG와 사회적 책임을 공유합니다.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">고객센터</h2>
            <p className="text-slate-600">문의 및 상담을 받습니다.</p>
          </section>
        </div>
      </div>
    </main>
  );
}