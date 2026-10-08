'use client';

import React, { useState } from 'react';
import { B2BTemplateData } from '@/data/templates';
import { CorporateViewer } from './CorporateViewer'; // 뷰어 컴포넌트 임포트

interface LivePreviewProps {
  data: B2BTemplateData;
  zoom?: number;
  setZoom?: React.Dispatch<React.SetStateAction<number>>;
}

export default function LivePreview({ data, zoom: propZoom, setZoom: propSetZoom }: LivePreviewProps) {
  const [internalZoom, setInternalZoom] = useState(100);
  const zoom = propZoom !== undefined ? propZoom : internalZoom;
  const setZoom = propSetZoom || setInternalZoom;

  return (
    <main className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden relative">
      {/* 상단 줌 컨트롤 바 */}
      <div className="h-12 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
        <span className="text-xs font-semibold text-slate-500 tracking-wider">미리보기 캔버스 ({zoom}%)</span>
        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={() => setZoom((prev) => Math.max(prev - 10, 50))} className="p-1 px-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 cursor-pointer">-</button>
          <span className="text-xs font-medium text-slate-600 w-10 sm:w-12 text-center">{zoom}%</span>
          <button onClick={() => setZoom((prev) => Math.min(prev + 10, 150))} className="p-1 px-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 cursor-pointer">+</button>
          <button onClick={() => setZoom(100)} className="ml-1 sm:ml-2 text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer">초기화</button>
        </div>
      </div>

      {/* 캔버스 영역: 스크롤 최적화 */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start relative bg-slate-200/50">
        <div
          style={{
            width: '1200px',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            // scale로 인해 발생하는 하단 빈 공간을 제거하기 위한 동적 마진 계산
            marginBottom: `${-1200 * (1 - zoom / 100)}px`, 
          }}
          className="bg-white shadow-2xl border border-slate-300 transition-transform duration-75 relative h-fit"
        >
          {/* 
            핵심 수정: 내부의 하드코딩된 모든 섹션을 제거하고 
            실제 렌더링 엔진인 CorporateViewer만 배치합니다.
          */}
          <CorporateViewer data={data} />
        </div>
      </div>
    </main>
  );
}