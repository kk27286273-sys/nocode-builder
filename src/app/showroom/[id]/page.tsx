import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SHOWROOM_TEMPLATES } from '@/data/showroomTemplates';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ShowroomDetailPage({ params }: PageProps) {
  const { id } = await params;
  const template = SHOWROOM_TEMPLATES.find((item) => item.id === id);

  if (!template) {
    notFound();
  }

  const KAKAO_LINK = 'http://pf.kakao.com/_qxmixiX/chat';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* 상단 헤더 */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto border-b border-slate-200">
        <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
          ← 메인으로 돌아가기
        </Link>
        <span className="text-xs font-bold px-3 py-1 bg-white border border-slate-200 rounded-full">
          {template.category}
        </span>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-10">
        {/* 타이틀 영역 */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            {template.name}
          </h1>
          <p className="text-lg text-slate-600">
            {template.tagline}
          </p>
        </div>

        {/* 메인 이미지 미리보기 카드 */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 mb-10 bg-white">
          <img 
            src={template.thumbnailImage} 
            alt={template.name}
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>

        {/* 상세 스펙 및 안내 */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4">템플릿 최적화 구성</h2>
              <ul className="space-y-3">
                {template.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-3">적용 가이드</h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                해당 템플릿은 업종별 특화 동선에 맞춰 사전 설계되었습니다. 
                로고, 대표 색상, 세부 서비스 문구 및 상담/예약 링크는 관리자 페이지 또는 커스텀 설정을 통해 즉시 변경 가능합니다.
              </p>
            </div>
          </div>

          {/* 우측 액션 카드 */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
              <div className="text-sm font-semibold text-slate-500">템플릿 메인 컬러</div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg border border-slate-200 shadow-inner" 
                  style={{ backgroundColor: template.primaryColor }}
                />
                <span className="font-mono text-sm text-slate-700">{template.primaryColor}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
              <Link
                href="/preview"
                className="w-full py-4 text-center font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                실시간 프리뷰 열기
              </Link>
              <a
                href={KAKAO_LINK}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 text-center font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md"
              >
                이 템플릿으로 문의하기
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}