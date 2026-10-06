'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { defaultB2BTemplateData, B2BTemplateData } from '@/data/templates';
import { SHOWROOM_TEMPLATES } from '@/data/showroomTemplates'; // 쇼룸 데이터 추가
import LivePreview from '@/components/builder/LivePreview';
import { supabase } from '@/lib/supabase/client';

function PreviewContent() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get('id'); // 실제 배포된 사이트 ID
  const templateId = searchParams.get('templateId'); // 쇼룸에서 넘어온 템플릿 ID
  
  const [data, setData] = useState<B2BTemplateData>(defaultB2BTemplateData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPreviewData() {
      setLoading(true);

      // 1순위: 실제 배포된 사이트 ID가 있다면 DB에서 가져옴
      if (siteId) {
        const { data: siteRecord } = await supabase
          .from('sites')
          .select('content')
          .eq('id', siteId)
          .single();
        
        if (siteRecord?.content) {
          setData(siteRecord.content);
        }
      } 
      // 2순위: 쇼룸 템플릿 ID가 있다면 샘플 데이터에서 가져옴
      else if (templateId) {
        const sample = SHOWROOM_TEMPLATES.find((t) => t.id === templateId);
        if (sample && sample.sampleData) {
          setData(sample.sampleData);
        } else {
          // 샘플 데이터가 정의되지 않은 경우 기본값 유지
          setData(defaultB2BTemplateData);
        }
      } 
      // 3순위: 아무것도 없다면 기본 템플릿 유지
      else {
        setData(defaultB2BTemplateData);
      }

      setLoading(false);
    }

    loadPreviewData();
  }, [siteId, templateId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white">로딩 중...</div>;
  
  return (
    <div className="min-h-screen bg-white">
      <LivePreview data={data} zoom={100} />
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white">로딩 중...</div>}>
      <PreviewContent />
    </Suspense>
  );
}