'use client';
import React from 'react';
import CorporateViewer from './CorporateViewer';
import LivePreview from './LivePreview';

export default function ViewerManager({ data, activeSection, setActiveSection }: any) {
  // 🚩 데이터 보정: templateType이 없어도 무조건 'corporate'로 작동하도록 안전장치 마련
  const currentType = data?.templateType || 'corporate';

  return (
    <div className="flex flex-col h-full w-full bg-slate-200 overflow-hidden relative">
      {/* 상단 상태바: z-index를 높여 뷰어 내용보다 항상 위에 위치 */}
      <div className="h-12 bg-white border-b flex items-center justify-between px-4 shrink-0 z-[110] shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Preview Mode (80%)</span>
          <div className="h-4 w-px bg-slate-300" />
          <span className="text-xs font-medium text-slate-700">
            템플릿: <span className="text-blue-600 font-bold">{currentType === 'corporate' ? '기업형' : '원페이지'}</span>
          </span>
        </div>
      </div>

      {/* 🚩 [수정] 뷰포트 컨테이너: scale 적용 시 잘림 방지를 위한 구조 개선 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex justify-center bg-slate-200 p-4 relative">
        <div 
          className="w-[1280px] origin-top transition-transform duration-200 pb-40" // pb-40으로 푸터 하단 여백 확보
          style={{ transform: 'scale(0.8)' }}
        >
          {/* 🚩 섀도우와 배경색을 명확히 하여 실제 웹사이트 느낌 구현 */}
          <div className="bg-white shadow-2xl min-h-screen w-full overflow-hidden">
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