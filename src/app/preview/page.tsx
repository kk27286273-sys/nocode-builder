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
        // ?쒗뵆由???낆뿉 留욌뒗 ?ъ씠???곗씠??議고쉶
        const { data: sites, error } = await supabase
          .from('sites')
          .select('data, template_type')
          .eq('template_type', templateId)
          .single();

        if (error || !sites?.data) {
          console.log('DB?먯꽌 李얠? 紐삵븿. 湲곕낯 ?곗씠???ъ슜');
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
    return <div className="h-screen flex items-center justify-center">濡쒕뱶 以?..</div>;
  }

  if (!data) {
    return <div className="h-screen flex items-center justify-center text-rose-600">?곗씠?곕? 李얠쓣 ???놁뒿?덈떎.</div>;
  }

  return (
    <main className="min-h-screen w-full bg-white">
      <ViewerManager templateType={templateId} data={data} />
    </main>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">濡쒕뱶 以?..</div>}>
      <PreviewContent />
    </Suspense>
  );
}
