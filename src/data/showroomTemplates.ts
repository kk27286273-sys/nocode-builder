'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { defaultB2BTemplateData, B2BTemplateData } from '@/data/templates';
import { SHOWROOM_TEMPLATES } from '@/data/showroomTemplates';
import LivePreview from '@/components/builder/LivePreview';
import { supabase } from '@/lib/supabase/client';

function PreviewContent() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get('id'); 
  const templateId = searchParams.get('templateId'); 
  
  const [data, setData] = useState<B2BTemplateData>(defaultB2BTemplateData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPreviewData() {
      setLoading(true);

      if (siteId) {
        // 1. 실제 사이트 데이터 로드
        const { data: siteRecord } = await supabase
          .from('sites')
          .select('content')
          .eq('id', siteId)
          .single();
        
        if (siteRecord?.content) {
          setData(siteRecord.content);
        }
      } else if (templateId) {
        // 2. 쇼룸 템플릿 ID로 프리셋 데이터 매칭
        const template = SHOWROOM_TEMPLATES.find((t) => t.id === templateId);
        
        // previewUrl에서 'preset=xxx' 부분만 추출 (예: legal, counseling 등)
        const presetMatch = template?.previewUrl.match(/preset=([^&]+)/);
        const presetName = presetMatch ? presetMatch[1] : null;

        if (presetName) {
          // templates.ts에 정의된 프리셋 데이터들을 가져오는 로직
          // 주의: templates.ts에 B2B_PRESETS 같은 객체가 정의되어 있어야 합니다.
          // 만약 없다면 일단 defaultB2BTemplateData를 쓰되, 
          // 색상만이라도 template.themeColor로 변경해주는 처리를 합니다.
          
          // 임시 방편: 프리셋 데이터를 찾지 못했을 때 최소한 색상이라도 맞춤
          const baseData = { ...defaultB2BTemplateData };
          if (template) {
            baseData.themeColor = template.themeColor;
          }
          setData(baseData);
        }
      } else {
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