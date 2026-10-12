'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import InteriorViewer from '@/components/viewer/templates/InteriorViewer';
import { CorporateViewer } from '@/components/builder/CorporateViewer';
import LegalViewer from '@/components/viewer/templates/LegalViewer';
import FitnessViewer from '@/components/viewer/templates/FitnessViewer';
import { ViewerManager } from '@/components/viewer/ViewerManager';
import { getDefaultData } from '@/lib/defaultData';

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
          console.log('DB에서 찾지 못함. 기본 데이터 사용');
          setData(getDefaultData(templateId));
        } else {
          setData(sites.data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setData(getDefaultData(templateId));
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
      <ViewerManager data={{ templateType: templateId, ...data }} />
    </main>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">로드 중...</div>}>
      <PreviewContent />
    </Suspense>
  );
}