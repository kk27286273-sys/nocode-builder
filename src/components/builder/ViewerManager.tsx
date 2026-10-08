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

  // [디버깅] 현재 어떤 데이터가 들어오는지 개발자 도구(F12) 콘솔에서 확인하기 위함입니다.
  const templateType = data.templateType || data.specifics?.templateType;
  console.log("현재 감지된 템플릿 타입:", templateType);
  console.log("전체 데이터 구조:", data);

  if (templateType === 'corporate') {
    console.log("결과: CorporateViewer를 렌더링합니다.");
    return (
      <CorporateViewer 
        data={data} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
    );
  }

  console.log("결과: LivePreview를 렌더링합니다.");
  return (
    <LivePreview 
      data={data} 
      activeSection={activeSection} 
      setActiveSection={setActiveSection} 
    />
  );
}