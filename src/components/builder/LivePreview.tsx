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
  // 초기 줌을 100%가 아니라, 화면에 맞게 자동으로 조절될 수 있도록 설정
  const [internalZoom, setInternalZoom] = useState(100);
  const zoom = propZoom !== undefined ? propZoom : internalZoom;
  const setZoom = propSetZoom || setInternalZoom;

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-slate-200 overflow-hidden">
      {/* 상단 컨트롤 바 */}
      <div className="h-12 bg-white border-b border-slate-300 flex items-center justify-between px-6 z-30 shrink-0 shadow-sm">
        <span className="text-xs font-bold text-slate-600 tracking-wider uppercase">
          Preview Canvas ({zoom}%)
        </span>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setZoom((prev) => Math.max(prev - 10, 30))} 
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

      {/* 
        핵심 수정 영역: 
        1. overflow-y-auto를 통해 세로 스크롤은 자유롭게 둡니다.
        2. items-center를 통해 캔버스를 중앙에 배치합니다.
        3. width를 '100%'로 잡고 max-width를 줌 수치에 따라 조절하여 
           줌이 100% 이하일 때는 화면에 꽉 차게, 100% 이상일 때만 스크롤이 생기게 합니다.
      */}
      <div className="flex-1 overflow-y-auto overflow-x-auto p-4 md:p-6 flex justify-center items-start bg-slate-200">
        <div 
          style={{ 
            width: zoom === 100 ? '100%' : `${zoom}%`,
            maxWidth: zoom === 100 ? '1280px' : `${1280 * (zoom / 100)}px`,
            minWidth: '320px', // 모바일 최소 너비 보장
          }}
          className="bg-white shadow-2xl border border-slate-300 rounded-lg overflow-hidden shrink-0 h-fit transition-all duration-200"
        >
          <CorporateViewer data={data} />
        </div>
      </div>
    </div>
  );
}