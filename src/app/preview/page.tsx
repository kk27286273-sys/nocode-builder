'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import InteriorViewer from '@/components/viewer/templates/InteriorViewer';
import { CorporateViewer } from '@/components/builder/CorporateViewer';

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams?.get('templateId') || 'corporate';

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const dummyData = {
      interior: {
        templateType: 'interior',
        company: { name: '인테리어 회사', logoUrl: '' },
        hero: {
          title: '당신의 꿈의 공간을 만듭니다',
          subtitle: '전문적인 시공으로 가치 있는 인테리어',
          badge: '11월부터 새로운 작업을 받고 있습니다',
          mediaUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=900&fit=crop',
        },
        projects: [],
        services: [],
        process: [],
        solutions: [],
        footer: { companyName: '인테리어 회사', address: '', businessNumber: '' },
        csCenter: { contactInfo: { email: 'info@example.com', phone: '010-0000-0000', address: '' } },
      },
      corporate: {
        templateType: 'corporate',
        company: { name: 'COMPANY', logoUrl: '' },
        hero: { title: '기업의 미래를 설계합니다', subtitle: '', badge: 'Since 1990', mediaUrl: '' },
        solutions: [],
        footer: { companyName: 'COMPANY', address: '', businessNumber: '' },
        csCenter: { contactInfo: { email: '', phone: '', address: '' } },
      },
    };

    setData(dummyData[templateId as keyof typeof dummyData] || dummyData.corporate);
  }, [templateId]);

  if (!data) return <div className="h-screen flex items-center justify-center">로드 중...</div>;

  return (
    <main className="min-h-screen w-full bg-white">
      {templateId === 'interior' ? (
        <InteriorViewer data={data} editable={false} />
      ) : (
        <CorporateViewer data={data} />
      )}
    </main>
  );
}