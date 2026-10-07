'use client';

import React from 'react';
import { B2BTemplateData } from '@/types/template';
import LivePreview from './LivePreview'; 
import CorporateViewer from './CorporateViewer';
import RentalViewer from './RentalViewer';
import PortfolioViewer from './PortfolioViewer';

interface ViewerManagerProps {
  data: B2BTemplateData;
}

export default function ViewerManager({ data }: ViewerManagerProps) {
  // [강제 수정] 어떤 데이터가 오든 일단 기업형 뷰어로 렌더링합니다.
  // 데이터의 templateType이 제대로 전달되지 않는 문제를 해결하기 위한 임시 조치입니다.
  
  if (data.templateType === 'corporate' || !data.templateType) {
    return <CorporateViewer data={data} />;
  }

  switch (data.templateType) {
    case 'rental-shop':
      return <RentalViewer data={data} />;
    case 'portfolio':
      return <PortfolioViewer data={data} />;
    default:
      return <LivePreview data={data} />;
  }
}