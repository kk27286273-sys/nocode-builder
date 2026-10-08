'use client';

import React, { useState } from 'react';
import { B2BTemplateData } from '@/data/templates';
import { CorporateViewer } from './CorporateViewer';

interface LivePreviewProps {
  data: B2BTemplateData;
  zoom?: number;
  setZoom?: React.Dispatch<React.SetStateAction<number>>;
}

export default function LivePreview({ data, zoom: propZoom, setZoom: propSetZoom }: LivePreviewProps) {
  const [internalZoom, setInternalZoom] = useState(100);
  const zoom = propZoom !== undefined ? propZoom : internalZoom;
  const setZoom = propSetZoom || setInternalZoom;

  // 기준 너비를 1280px로 잡고 줌 수치에 따라 실제 픽셀 너비를 계산합니다.
  const baseWidth = 1280;
  const currentWidth = baseWidth * (zoom / 100);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-slate-200 overflow-hidden">
      {/* 상단 컨트롤 바: 고정 높이 */}
      <div className="h-12 bg-white border-b border-slate-300 flex items-center justify-between px-6 z-30 shrink-0 shadow-sm">
        <span className="text-xs font-bold text-slate-600 tracking-wider uppercase">
          Preview Canvas ({zoom}%)
        </span>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setZoom((prev) => Math.max(prev - 10, 40))} 
            className="w-7 h-7 flex items-center justify-center text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition"
          >
            -
          </button>
          <span className="text-xs font-semibold text-slate-700 w-12 text-center">{zoom}%</span>
          <button 
            type="button"
            onClick={() => setZoom((prev) => Math.min(prev + 10, 150))} 
            className="w-7 h-7 flex items-center justify-center text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition"
          >
            +
          </button>
          <button 
            type="button"
            onClick={() => setZoom(100)} 
            className="ml-2 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition"
          >
            100%
          </button>
        </div>
      </div>

      {/* 캔버스 뷰포트: overflow-y-auto를 통해 물리적 높이를 모두 인식하게 함 */}
      <div className="flex-1 overflow-y-auto overflow-x-auto p-4 md:p-10 flex justify-center items-start bg-slate-200">
        <div 
          style={{ 
            width: `${currentWidth}px`,
            minWidth: `${currentWidth}px`,
            maxWidth: '100%',
          }}
          className="bg-white shadow-2xl border border-slate-300 rounded-lg overflow-hidden shrink-0 h-fit"
        >
          {/* 
            중요: 이제 scale을 쓰지 않으므로 내부 요소들의 폰트 크기나 레이아웃이 
            너비에 따라 유동적으로 변하는 '반응형' 상태가 됩니다. 
            CorporateViewer 내부의 Tailwind 클래스(md:, lg:)들이 정상 작동합니다.
          */}
          <CorporateViewer data={data} />
        </div>
      </div>
    </div>
  );
}