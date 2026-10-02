'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { defaultB2BTemplate, B2BTemplateData } from '@/data/templates';
import LivePreview from '@/components/builder/LivePreview';

export default function HomePage() {
  const [data, setData] = useState<B2BTemplateData>(() => ({
    ...defaultB2BTemplate,
    navigation: defaultB2BTemplate.navigation || { navLinks: [] },
    hero: defaultB2BTemplate.hero || {
      badge: '',
      title: '',
      subtitle: '',
      mediaUrl: '',
    },
    solutionsSection: defaultB2BTemplate.solutionsSection || {
      title: '',
      subtitle: '',
    },
    reviewsSection: defaultB2BTemplate.reviewsSection || {
      title: '',
      subtitle: '',
    },
    stats: defaultB2BTemplate?.stats || [],
    solutions: defaultB2BTemplate?.solutions || [],
    reviews: defaultB2BTemplate?.reviews || [],
    faqs: defaultB2BTemplate?.faqs || [],
  }));

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
      {/* 편집 툴바/사이드바 제거, 순수 완성 화면만 100% 비율로 출력 */}
      <LivePreview data={data} zoom={100} setZoom={setZoom} />
    </main>
  );
}