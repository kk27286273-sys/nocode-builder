'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { CorporateViewer } from '@/components/viewer/templates/CorporateViewer';

export default function CorporateLayout() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCorporateData = async () => {
      try {
        const { data: siteData, error: siteError } = await supabase
          .from('sites')
          .select('*')
          .eq('template_type', 'corporate')
          .single();

        if (siteError || !siteData) {
          setError('기업형 데이터를 불러올 수 없습니다.');
          setLoading(false);
          return;
        }

        setData(siteData.content || {});
        setLoading(false);
      } catch (err) {
        console.error('Error fetching corporate data:', err);
        setError('데이터 로드 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchCorporateData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-slate-600">로드 중...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-slate-600">{error || '데이터를 찾을 수 없습니다.'}</p>
      </div>
    );
  }

  return <CorporateViewer data={data} />;
}