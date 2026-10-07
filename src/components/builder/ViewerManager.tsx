'use client';

import React, { useState } from 'react';
import CorporateViewer from './CorporateViewer';
import LivePreview from './LivePreview';

interface ViewerManagerProps {
  data: any;
  activeSection: string; // 🚩 추가: 현재 섹션 상태
  setActiveSection: (section: any) => void; // 🚩 추가: 섹션 변경 함수
}

export default function ViewerManager({ data, activeSection, setActiveSection }: ViewerManagerProps) {
  const [scale, setScale] = useState(0.75); // 기본 배율 75% (화면 맞춤)
  const currentType = data?.templateType || 'one-page';

  return (
    <div className="flex flex-col h-full w-full bg-slate-200 overflow-hidden">
      {/* 🚩 [상단 제어 바] 배율 조절 및 상태 표시 */}
      <div className="h-12 bg-white border-b flex items-center justify-between px-4 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Preview Mode</span>
          <div className="h-4 w-px bg-slate-300" />
          <span className="text-xs font-medium text-slate-700">
            템플릿: <span className="text-blue-600 font-bold">{currentType === 'corporate' ? '기업형(에이텍 스타일)' : '원페이지'}</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border">
            <button onClick={() => setScale(Math.max(0.5, scale - 0.1))} className="px-2 py-1 text-xs font-bold hover:bg-white rounded shadow-sm transition">-</button>
            <span className="text-xs font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(Math.min(1, scale + 0.1))} className="px-2 py-1 text-xs font-bold hover:bg-white rounded shadow-sm transition">+</button>
          </div>
          <button onClick={() => setScale(0.75)} className="text-[10px] text-slate-500 underline hover:text-blue-600">초기화</button>
        </div>
      </div>

      {/* 🚩 [스케일링 뷰포트] 실제 사이트가 렌더링되는 영역 */}
      <div className="flex-1 overflow-auto p-8 flex justify-center items-start custom-scrollbar">
        <div 
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top center',
            width: scale === 1 ? '100%' : '1280px', // 기준 해상도 1280px
            transition: 'transform 0.2s ease-out'
          }} 
          className="bg-white shadow-2xl rounded-sm overflow-hidden"
        >
          {/* 🚩 [핵심 수정] CorporateViewer에 상태 전달 함수들을 모두 넘겨줍니다 */}
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