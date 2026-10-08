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

  const scale = zoom / 100;

  return (
    <div className="flex-1 flex flex-col w-full h-full min-h-0 bg-slate-200 overflow-hidden select-none">
      {/* 상단 줌 컨트롤 바 */}
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

      {/* 무한 스크롤 가능한 캔버스 뷰포트 영역 */}
      <div className="flex-1 w-full h-[calc(100%-3rem)] overflow-y-auto overflow-x-auto p-4 md:p-10 flex justify-center items-start">
        {/* 스케일 보정 래퍼: scale 축소 시 줄어든 실제 높이를 보정 */}
        <div 
          className="relative transition-all duration-100 origin-top flex justify-center pb-20"
          style={{
            width: zoom === 100 ? '1280px' : `${1280 * scale}px`,
          }}
        >
          <div
            style={{
              width: '1280px',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
            className="bg-white shadow-2xl border border-slate-300 rounded-lg overflow-visible shrink-0"
          >
            <CorporateViewer data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}