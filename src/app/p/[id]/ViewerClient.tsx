'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { B2BTemplateData, defaultB2BTemplateData } from '@/data/templates';
import { supabase } from '@/lib/supabase/client';
import LivePreview from '@/components/builder/LivePreview';

export interface ViewerClientProps {
  data?: B2BTemplateData;
  siteId?: string;
}

export default function ViewerClient({ data: initialData, siteId: propSiteId }: ViewerClientProps) {
  const params = useParams();
  const siteId = propSiteId || (params?.id as string);
  const pageId = params?.pageId as string | undefined; 

  const [data, setData] = useState<B2BTemplateData>(initialData || defaultB2BTemplateData);
  const [loading, setLoading] = useState<boolean>(!initialData && !!siteId);

  useEffect(() => {
    if (initialData) { setData(initialData); setLoading(false); return; }
    if (siteId) {
      setLoading(true);
      supabase.from('sites').select('content').eq('id', siteId).single().then(({ data: siteRecord }) => {
        if (siteRecord?.content) setData(siteRecord.content);
        setLoading(false);
      });
    }
  }, [initialData, siteId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="text-slate-500 text-sm font-semibold animate-pulse">페이지를 불러오는 중입니다...</div></div>;

  return <div className="min-h-screen bg-white"><LivePreview data={data} zoom={100} currentPageId={pageId || 'main'} /></div>;
}