'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { defaultB2BTemplateData, B2BTemplateData } from '@/data/templates';
import LivePreview from '@/components/builder/LivePreview';
import { supabase } from '@/lib/supabase/client';

function PreviewContent() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get('id');
  const [data, setData] = useState<B2BTemplateData>(defaultB2BTemplateData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (siteId) {
      supabase.from('sites').select('content').eq('id', siteId).single().then(({ data: siteRecord }) => {
        if (siteRecord?.content) setData(siteRecord.content);
        setLoading(false);
      });
    } else { setLoading(false); }
  }, [siteId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white">로딩 중...</div>;
  return <div className="min-h-screen bg-white"><LivePreview data={data} zoom={100} /></div>;
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white">로딩 중...</div>}>
      <PreviewContent />
    </Suspense>
  );
}