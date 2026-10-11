'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ViewerManager from '@/components/builder/ViewerManager';
import { B2BTemplateData } from '@/types/template';

export default function PreviewPage() {
  const params = useParams();
  const siteId = params?.siteId as string;

  const [data, setData] = useState<B2BTemplateData | null>(null);
  const [activeSection, setActiveSection] = useState('main');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!siteId) return;

    const decodedId = decodeURIComponent(siteId);

    async function fetchSiteData() {
      const { data: site, error } = await supabase
        .from('sites')
        .select('data')
        .eq('id', decodedId)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        setData(null);
      } else {
        setData(site?.data || null);
      }
      setIsLoading(false);
    }

    void fetchSiteData();
  }, [siteId]);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">로드 중...</div>;
  }

  if (!data) {
    return <div className="h-screen flex items-center justify-center text-rose-600">데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <main className="min-h-screen w-full bg-white">
<ViewerManager
  data={data}
  activeSection={activeSection}
  setActiveSection={setActiveSection}
  published
/>
    </main>
  );
}