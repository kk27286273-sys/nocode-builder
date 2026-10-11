// src/app/preview/page.tsx

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import InteriorViewer from '@/components/viewer/templates/InteriorViewer';
import { CorporateViewer } from '@/components/builder/CorporateViewer';
import LegalViewer from '@/components/viewer/templates/LegalViewer';

function PreviewContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams?.get('templateId') || 'corporate';

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 템플릿 타입에 맞는 사이트 데이터 조회
        const { data: sites, error } = await supabase
          .from('sites')
          .select('data, template_type')
          .eq('template_type', templateId)
          .single();

        if (error || !sites?.data) {
          console.log('DB에서 찾지 못함. 더미 데이터 사용');
          setData(getDummyData(templateId));
        } else {
          setData(sites.data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setData(getDummyData(templateId));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [templateId]);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">로드 중...</div>;
  }

  if (!data) {
    return <div className="h-screen flex items-center justify-center text-rose-600">데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <main className="min-h-screen w-full bg-white">
      {templateId === 'interior' && <InteriorViewer data={data} editable={false} />}
      {templateId === 'legal' && <LegalViewer data={data} />}
      {templateId === 'fitness' && <CorporateViewer data={data} />}
      {templateId === 'corporate' && <CorporateViewer data={data} />}
    </main>
  );
}

function getDummyData(templateId: string) {
  const dummyMap: Record<string, any> = {
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
      footer: { companyName: '인테리어 회사', address: '', businessNumber: '' },
      csCenter: { contactInfo: { email: 'info@example.com', phone: '010-0000-0000', address: '' } },
    },
    legal: {
      templateType: 'legal',
      company: { name: '법률사무소', logoUrl: '' },
      hero: {
        title: '신뢰할 수 있는 법률 파트너',
        subtitle: '의뢰인의 권리를 지키는 전문적인 법률 서비스',
        badge: '',
        mediaUrl: '',
      },
      footer: { companyName: '법률사무소', address: '', businessNumber: '' },
      csCenter: { contactInfo: { email: 'legal@example.com', phone: '010-0000-0000', address: '' } },
    },
    fitness: {
      templateType: 'fitness',
      company: { name: '피트니스 센터', logoUrl: '' },
      hero: {
        title: '건강한 변화를 시작하세요',
        subtitle: '전문 코치와 함께하는 맞춤형 운동 프로그램',
        badge: '',
        mediaUrl: '',
      },
      services: [],
      footer: { companyName: '피트니스 센터', address: '', businessNumber: '' },
      csCenter: { contactInfo: { email: 'fitness@example.com', phone: '010-0000-0000', address: '' } },
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

  return dummyMap[templateId] || dummyMap.corporate;
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">로드 중...</div>}>
      <PreviewContent />
    </Suspense>
  );
}