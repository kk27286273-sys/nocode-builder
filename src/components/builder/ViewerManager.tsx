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
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  // 1. 템플릿 타입 확인 (데이터 구조에 따라 templateType 위치가 다를 수 있어 둘 다 체크)
  const templateType = data.templateType || data.specifics?.templateType;

  // 2. 기업형(corporate)일 경우 전용 뷰어를 반환
  if (templateType === 'corporate') {
    return (
      <CorporateViewer 
        data={data} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
    );
  }

  // 3. 그 외(one-page, portfolio 등)는 기존 LivePreview 사용
  return (
    <LivePreview 
      data={data} 
      activeSection={activeSection} 
      setActiveSection={setActiveSection} 
    />
  );
}