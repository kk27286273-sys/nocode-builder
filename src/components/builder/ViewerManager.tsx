'use client';

import React from 'react';
import CorporateViewer from './CorporateViewer';
import LivePreview from './LivePreview';

interface ViewerManagerProps {
  data: any;
  activeSection: string;
  setActiveSection: (section: any) => void;
}

export default function ViewerManager({ data, activeSection, setActiveSection }: ViewerManagerProps) {
  const currentType = data?.templateType || 'one-page';

  return (
    <div className="flex flex-col h-full w-full bg-slate-200 overflow-hidden">
      {/* 상단 바는 유지하되 배율 조절 버튼 제거 */}
      <div className="h-12 bg-white border-b flex items-center justify-between px-4 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Preview Mode</span>
          <div className="h-4 w-px bg-slate-300" />
          <span className="text-xs font-medium text-slate-700">
            템플릿: <span className="text-blue-600 font-bold">{currentType === 'corporate' ? '기업형(에이텍 스타일)' : '원페이지'}</span>
          </span>
        </div>
      </div>

      {/* 🚩 [수정] 배율(scale) 제거 -> 100% 너비와 높이로 짤림 방지 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="w-full h-full bg-white shadow-2xl overflow-hidden">
          {currentType === 'corporate' ? (
            <CorporateViewer 
              data={data} 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} 
            />
          ) : (
            <LivePreview data={data} />
          )}
        </div>
      </div>
    </div>
  );
}