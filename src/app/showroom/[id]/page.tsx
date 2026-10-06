import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SHOWROOM_TEMPLATES } from '@/data/showroomTemplates';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ShowroomDetailPage({ params }: Props) {
  const { id } = await params;
  const template = SHOWROOM_TEMPLATES.find((t) => t.id === id);

  if (!template) {
    notFound();
  }

  const kakaoConsultUrl = 'http://pf.kakao.com/_qxmixiX/chat';

  // 업종별 레이아웃 타입 분기 (피트니스, B2B는 기능 강조형)
  const isVisualLayout = id === 'fitness-lesson' || id === 'b2b-rental';

  // 섹션 1: 소개
  const IntroSection = (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-2">템플릿 소개</h2>
      <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
        {template.description}
      </p>
    </div>
  );

  // 섹션 2: 추천 대상
  const TargetSection = (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
        추천 대상
      </h3>
      <p className="text-slate-800 font-medium">{template.targetAudience}</p>
    </div>
  );

  // 섹션 3: 주요 특화 기능
  const FeatureSection = (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-3">주요 특화 기능</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {template.features.map((feature, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 flex items-center gap-2"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: template.themeColor }}
            />
            {feature}
          </div>
        ))}
      </div>
    </div>
  );

  // 섹션 4: 페이지 구조
  const StructureSection = (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-3">제공 페이지 구성</h2>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700">
          1. {template.pageStructure.main}
        </span>
        <span className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700">
          2. {template.pageStructure.sub}
        </span>
        <span className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-indigo-600">
          3. {template.pageStructure.conversion}
        </span>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* 상단 썸네일 & 배너 */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-900 overflow-hidden">
          <img
            src={template.thumbnailImage}
            alt={template.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full text-white mb-2"
              style={{ backgroundColor: template.themeColor }}
            >
              {template.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold">{template.name}</h1>
            <p className="text-slate-300 text-sm mt-1">{template.tagline}</p>
          </div>
        </div>

        {/* 본문 콘텐츠 (레이아웃에 따른 배치 순서 차별화) */}
        <div className="p-6 sm:p-10 space-y-8">
          {isVisualLayout ? (
            <>
              {FeatureSection}
              {IntroSection}
              {TargetSection}
              {StructureSection}
            </>
          ) : (
            <>
              {IntroSection}
              {TargetSection}
              {StructureSection}
              {FeatureSection}
            </>
          )}

          {/* 액션 버튼 */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <Link
              href={template.previewUrl}
              className="flex-1 text-center py-3.5 px-6 rounded-xl font-bold text-white transition-opacity hover:opacity-90 shadow-sm"
              style={{ backgroundColor: template.themeColor }}
            >
              실제 템플릿 미리보기
            </Link>

            <a
              href={kakaoConsultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-3.5 px-6 rounded-xl font-bold bg-amber-400 text-slate-900 hover:bg-amber-300 transition-colors shadow-sm"
            >
              이 템플릿으로 제작 문의
            </a>
          </div>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-slate-400 hover:text-slate-600 underline">
              ← 쇼룸 메인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}