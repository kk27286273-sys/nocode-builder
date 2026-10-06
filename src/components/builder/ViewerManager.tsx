'use client';

import React from 'react';
import { B2BTemplateData } from '@/types/template';
import LivePreview from './LivePreview'; // 기존 원페이지 뷰어
import CorporateViewer from './CorporateViewer';
import RentalViewer from './RentalViewer';
import PortfolioViewer from './PortfolioViewer';

interface ViewerManagerProps {
  data: B2BTemplateData;
}

export default function ViewerManager({ data }: ViewerManagerProps) {
  // 템플릿 타입에 따라 다른 뷰어 컴포넌트를 렌더링합니다.
  switch (data.templateType) {
    case 'corporate':
      return <CorporateViewer data={data} />;
    case 'rental-shop':
      return <RentalViewer data={data} />;
    case 'portfolio':
      return <PortfolioViewer data={data} />;
    case 'one-page':
    default:
      return <LivePreview data={data} />;
  }
}