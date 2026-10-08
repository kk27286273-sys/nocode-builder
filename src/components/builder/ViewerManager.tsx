'use client';

import React from 'react';
import CorporateViewer from './CorporateViewer';
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

  const templateType = data.templateType || data.specifics?.templateType;

 if (templateType === 'corporate') {
    return (
      <CorporateViewer 
        data={data} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
    );
  }

  // [검증용] 화면 상단에 파란색 띠를 추가해 LivePreview가 작동 중인지 확인합니다.
  return (
    <>
      <div className="bg-blue-600 text-white text-center text-xs py-1 font-bold">LIVE PREVIEW ACTIVE</div>
      <LivePreview 
        data={data} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
    </>
  );
}