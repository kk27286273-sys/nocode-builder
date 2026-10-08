'use client';

import React from 'react';
import { B2BTemplateData } from '@/data/templates';
import { CorporateViewer } from './CorporateViewer';

interface LivePreviewProps {
  data: B2BTemplateData;
  zoom?: number;
  setZoom?: React.Dispatch<React.SetStateAction<number>>;
}

export default function LivePreview({ data, zoom: propZoom, setZoom: propSetZoom }: LivePreviewProps) {
  const zoom = propZoom || 100;
  const setZoom = propSetZoom || (() => {});

  return (
    // 1. 최상위: h-full과 overflow-hidden을 제거하고, flex-col로 구조만 잡습니다.
    <div className="flex-1 flex flex-col w-full h-full bg-slate-200 relative">
      
      {/* 2. 컨트롤 바: shrink-0로 높이 고정 */}
      <div className="h-12 bg-white border-b border-slate-300 flex items-center justify-between px-6 z-50 shrink-0 shadow-sm">
        <span className="text-xs font-bold text-slate-600 tracking-wider">
          PREVIEW CANVAS ({zoom}%)
        </span>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom((prev: any) => Math.max(prev - 10, 30))} className="w-7 h-7 bg-slate-100 border rounded text-xs font-bold">-</button>
          <span className="text-xs font-semibold w-10 text-center">{zoom}%</span>
          <button onClick={() => setZoom((prev: any) => Math.min(prev + 10, 150))} className="w-7 h-7 bg-slate-100 border rounded text-xs font-bold">+</button>
        </div>
      </div>

      {/* 
        3. 뷰포트: 여기가 핵심입니다. 
        - min-h-0: flex 자식 요소가 부모 높이를 넘어갈 때 발생하는 버그 방지
        - overflow-y-auto: 여기서 모든 세로 스크롤을 처리합니다.
        - h-full: 남은 높이를 모두 차지하게 합니다.
      */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto p-4 md:p-10 flex justify-center items-start">
        
        {/* 4. 캔버스: 물리적 너비만 조절하고, 높이는 h-fit으로 콘텐츠만큼 늘어나게 합니다. */}
        <div 
          style={{ 
            width: `${1280 * (zoom / 100)}px`,
            maxWidth: '100%',
          }}
          className="bg-white shadow-2xl border border-slate-300 rounded-lg overflow-hidden h-fit shrink-0"
        >
          <CorporateViewer data={data} />
        </div>
      </div>
    </div>
  );
}