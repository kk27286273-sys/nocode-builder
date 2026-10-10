'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import CorporateViewer from '@/components/builder/CorporateViewer';
import LivePreview from '@/components/builder/LivePreview';
import { B2BTemplateData } from '@/types/template';

export default function PublicSitePage() {
  const params = useParams();
  const siteId = params?.id as string;

  const [data, setData] = useState<B2BTemplateData | null>(null);
  const [activeSection, setActiveSection] = useState('main');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!siteId) return;

    async function fetchSite() {
      setLoading(true);

      const { data: siteRecord, error } = await supabase
        .from('sites')
        .select('data')
        .eq('id', siteId)
        .single();

      if (error || !siteRecord?.data) {
        setNotFound(true);
      } else {
        setData(siteRecord.data);
      }

      setLoading(false);
    }

    fetchSite();
  }, [siteId]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-900 font-bold text-white">
        사이트를 불러오는 중입니다...
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-slate-100 text-slate-800">
        <h1 className="text-2xl font-bold">사이트를 찾을 수 없습니다</h1>
        <p className="text-sm text-slate-500">
          발행된 사이트 ID가 올바른지 확인해주세요.
        </p>
      </div>
    );
  }

  const isSolutionType = data.solutionMain !== undefined;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      {isSolutionType ? (
        <LivePreview data={data} published />
      ) : (
        <CorporateViewer
          data={data}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      )}
    </div>
  );
}