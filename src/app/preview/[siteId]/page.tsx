'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PaymentSection, { type PaymentSectionSettings } from '@/components/builder/PaymentSection';
import { supabase } from '@/lib/supabase';
import ViewerManager from '@/components/builder/ViewerManager';
import { B2BTemplateData } from '@/types/Template';

function PreviewContent() {
const params = useParams();
const siteId = decodeURIComponent((params?.siteId as string) || '');

  const [data, setData] = useState<B2BTemplateData | null>(null);
  const [activeSection, setActiveSection] = useState('main');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!siteId) {
      setIsLoading(false);
      return;
    }

    async function fetchTemplateData() {
      const { data: sites, error } = await supabase
        .from('sites')
        .select('data')
        .eq('id', siteId)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        setData(null);
      } else {
        setData(sites?.data || null);
      }
      setIsLoading(false);
    }

    void fetchTemplateData();
  }, [siteId]);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">로드 중...</div>;
  }

  if (!data) {
    return <div className="h-screen flex items-center justify-center text-rose-600">데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <main className="min-h-screen w-full bg-white">
      {siteId === 'medinsure' && (
        <nav aria-label="MedinSure 서비스" className="flex flex-wrap justify-center gap-4 border-b bg-slate-50 px-4 py-3 text-sm font-semibold text-blue-900">
          <Link href="/medinsure#plans">요금제</Link>
          <Link href="/organization">로그인·조직 관리</Link>
          <Link href="/medinsure/download">프로그램 다운로드</Link>
        </nav>
      )}
      <PaymentSection settings={(data as B2BTemplateData & { paymentSection?: PaymentSectionSettings }).paymentSection}
        checkoutPath={siteId === 'medinsure' ? '/medinsure#plans' : undefined} />
      <ViewerManager
        data={data}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        published
      />
    </main>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">로드 중...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
