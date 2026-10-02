'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { defaultB2BTemplate, B2BTemplateData } from '@/data/templates';
import LivePreview from '@/components/builder/LivePreview';

export default function HomePage() {
  const [data, setData] = useState<B2BTemplateData>(() => defaultB2BTemplate);
  const [zoom, setZoom] = useState<number>(100);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('siteId');
    if (id) {
      supabase
        .from('sites')
        .select('data')
        .eq('id', id)
        .single()
        .then(({ data: siteRecord, error }) => {
          if (!error && siteRecord?.data) {
            setData(siteRecord.data);
          }
        });
    }
  }, []);

  return (
    <main className="min-h-screen w-full bg-white">
      <LivePreview data={data} zoom={100} setZoom={setZoom} />
    </main>
  );
}
