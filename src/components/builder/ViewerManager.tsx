'use client';

import React from 'react';
import LivePreview from './LivePreview';

interface ViewerManagerProps {
  data: any;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
}

export default function ViewerManager({ data, activeSection, setActiveSection }: ViewerManagerProps) {
  if (!data) {
    return <div className="flex items-center justify-center h-full text-slate-400">데이터를 불러오는 중입니다...</div>;
  }

  // 모든 뷰어는 LivePreview(캔버스)를 통해 렌더링되어야 스크롤과 줌이 작동합니다.
  return (
    <LivePreview 
      data={data} 
      activeSection={activeSection} 
      setActiveSection={setActiveSection} 
    />
  );
}