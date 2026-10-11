'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SHOWROOM_TEMPLATES } from '@/data/showroomTemplates';
import LivePreview from '@/components/LivePreview';
import LegalTaxLayout from '@/components/templates/LegalTaxLayout';
import CorporateLayout from '@/components/templates/CorporateLayout';

function PreviewContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');

  if (!templateId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">템플릿을 선택해주세요.</p>
      </div>
    );
  }

  const template = SHOWROOM_TEMPLATES.find((t) => t.id === templateId);

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">템플릿을 찾을 수 없습니다.</p>
      </div>
    );
  }

  // legal-tax는 전용 레이아웃
  if (templateId === 'legal-tax') {
    return <LegalTaxLayout />;
  }

  // corporate도 전용 레이아웃
  if (templateId === 'corporate') {
    return <CorporateLayout />;
  }

  // 나머지는 LivePreview
  return <LivePreview template={template} />;
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <PreviewContent />
    </Suspense>
  );
}