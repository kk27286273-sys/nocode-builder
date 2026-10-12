'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ViewerManager } from '@/components/viewer/ViewerManager';
import { getDefaultData } from '@/lib/defaultData';

function PreviewContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId') || 'corporate';

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);

      try {
        const { data: site, error } = await supabase
          .from('sites')
          .select('data, template_type')
          .eq('template_type', templateId)
          .limit(1)
          .maybeSingle();

        if (cancelled) return;

        if (error || !site?.data) {
          console.log(
            `${templateId} 템플릿 데이터를 찾지 못했습니다. 기본 데이터를 사용합니다.`,
          );

          const defaultData = getDefaultData(templateId);

          setData({
            ...defaultData,
            templateType: templateId,
          });

          return;
        }

        setData({
          ...site.data,
          templateType: templateId,
        });
      } catch (error) {
        if (cancelled) return;

        console.error('프리뷰 데이터 조회 오류:', error);

        const defaultData = getDefaultData(templateId);

        setData({
          ...defaultData,
          templateType: templateId,
        });
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchData();

    return () => {
      cancelled = true;
    };
  }, [templateId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        로드 중...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-rose-600">
        데이터를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white">
      <ViewerManager
        templateType={templateId}
        data={data}
      />
    </main>
  );
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          로드 중...
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}