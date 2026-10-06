import React from 'react';
import { SiteData } from '@/types/template';
import { OnePageViewer } from './templates/OnePageViewer';
import { CorporateViewer } from './templates/CorporateViewer';
import { RentalViewer } from './templates/RentalViewer';
import { PortfolioViewer } from './templates/PortfolioViewer';

interface ViewerManagerProps {
  data: SiteData;
}

export const ViewerManager = ({ data }: ViewerManagerProps) => {
  // 선택된 templateType에 따라 다른 뷰어 컴포넌트를 리턴합니다.
  switch (data.templateType) {
    case 'corporate':
      return <CorporateViewer data={data} />;
    case 'rental-shop':
      return <RentalViewer data={data} />;
    case 'portfolio':
      return <PortfolioViewer data={data} />;
    case 'one-page':
    default:
      return <OnePageViewer data={data} />;
  }
};