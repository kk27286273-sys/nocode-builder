'use client';
import React from 'react';
import CorporateViewer from './CorporateViewer';
import LivePreview from './LivePreview';

export default function ViewerManager({ data, activeSection, setActiveSection }: any) {
  const currentType = data?.templateType || 'one-page';

  return (
    <div className="flex flex-col h-full w-full bg-slate-200 overflow-hidden">
      <div className="h-12 bg-white border-b flex items-center justify-between px-4 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Preview Mode (80%)</span>
          <div className="h-4 w-px bg-slate-300" />
          <span className="text-xs font-medium text-slate-700">
            템플릿: <span className="text-blue-600 font-bold">{currentType === 'corporate' ? '기업형' : '원페이지'}</span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar flex justify-center bg-slate-200 p-4">
        {/* 🚩 80% 배율 설정: w-[1280px] 기준 scale(0.8) 적용하여 짤림 방지 */}
        <div className="w-[1280px] h-fit origin-top transition-transform duration-200" style={{ transform: 'scale(0.8)' }}>
          <div className="bg-white shadow-2xl min-h-full">
            {currentType === 'corporate' ? (
              <CorporateViewer data={data} activeSection={activeSection} setActiveSection={setActiveSection} />
            ) : (
              <LivePreview data={data} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}