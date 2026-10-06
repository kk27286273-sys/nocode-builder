'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // 👈 추가: URL 파라미터 읽기 위해 필수
import { B2BTemplateData, defaultB2BTemplate } from '@/data/templates';
import { supabase } from '@/lib/supabase/client';
import LivePreview from '@/components/builder/LivePreview';

export interface ViewerClientProps {
  data?: B2BTemplateData;
  siteId?: string;
}

export default function ViewerClient({
  data: initialData,
  siteId: propSiteId,
}: ViewerClientProps) {
  // 🚀 [핵심 추가] 현재 URL에서 siteId와 pageId를 모두 추출합니다.
  const params = useParams();
  const siteId = propSiteId || (params?.id as string);
  const pageId = params?.pageId as string | undefined; 

  const [data, setData] = useState<B2BTemplateData>(
    initialData || defaultB2BTemplate
  );
  const [loading, setLoading] = useState<boolean>(!initialData && !!siteId);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setLoading(false);
      return;
    }

    if (siteId) {
      setLoading(true);
      supabase
        .from('sites')
        .select('content')
        .eq('id', siteId)
        .single()
        .then(({ data: siteRecord, error }) => {
          if (!error && siteRecord?.content) { 
            setData(siteRecord.content);
          }
          setLoading(false);
        });
    }
  }, [initialData, siteId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-slate-500 text-sm font-semibold animate-pulse">
          페이지를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 
        LivePreview에 현재 어떤 페이지(pageId)를 보여줘야 하는지 전달합니다.
        pageId가 없으면(메인 페이지면) 'main'을 기본값으로 넘깁니다.
      */}
      <LivePreview 
        data={data} 
        zoom={100} 
        currentPageId={pageId || 'main'} 
      />
    </div>
  );
}