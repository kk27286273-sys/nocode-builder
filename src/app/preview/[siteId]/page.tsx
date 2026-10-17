'use client';

import React, {
  Suspense,
  useEffect,
  useState,
} from 'react';
import {
  useParams,
  useSearchParams,
} from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ViewerManager from '@/components/builder/ViewerManager';
import { B2BTemplateData } from '@/types/Template';

type PreviewSite = {
  id: string;
  data: B2BTemplateData | null;
  template_type: string | null;
};

function PreviewContent() {
  const params = useParams<{ siteId: string }>();
  const searchParams = useSearchParams();

  const rawSiteId = params?.siteId || '';
  const requestedTemplateId =
    searchParams.get('templateId') || 'corporate';

  let siteId = rawSiteId;

  try {
    siteId = decodeURIComponent(rawSiteId);
  } catch {
    console.warn('siteId 디코딩에 실패했습니다:', rawSiteId);
  }

  const [data, setData] = useState<B2BTemplateData | null>(null);
  const [activeSection, setActiveSection] = useState('main');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchTemplateData() {
      setIsLoading(true);
      setData(null);

      console.log('프리뷰 조회 시작');
      console.log('siteId:', siteId);
      console.log(
        'requestedTemplateId:',
        requestedTemplateId,
      );

      try {
        /*
         * 1차 조회
         * /preview/[siteId]의 값을 sites.id로 조회합니다.
         */
        let site: PreviewSite | null = null;

        const firstResult = await supabase
          .from('sites')
          .select('id, data, template_type')
          .eq('id', siteId)
          .maybeSingle();

        console.log('id 조회 결과:', firstResult.data);
        console.log('id 조회 오류:', firstResult.error);

        site = firstResult.data as PreviewSite | null;

        /*
         * 2차 조회
         * URL 값이 실제 id가 아닐 경우 template_type으로 조회합니다.
         */
        if (!site && !firstResult.error) {
          const secondResult = await supabase
            .from('sites')
            .select('id, data, template_type')
            .eq('template_type', requestedTemplateId)
            .limit(1)
            .maybeSingle();

          console.log(
            'template_type 조회 결과:',
            secondResult.data,
          );
          console.log(
            'template_type 조회 오류:',
            secondResult.error,
          );

          if (secondResult.error) {
            throw secondResult.error;
          }

          site = secondResult.data as PreviewSite | null;
        }

        if (cancelled) {
          return;
        }

        if (!site?.data) {
          console.error(
            '프리뷰 데이터를 찾을 수 없습니다.',
          );
          setData(null);
          return;
        }

        console.log('최종 불러온 사이트:', site);

        setData(site.data);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          'Supabase 프리뷰 조회 오류:',
          error,
        );

        setData(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    if (!siteId) {
      console.error('siteId가 없습니다.');
      setIsLoading(false);
      return;
    }

    void fetchTemplateData();

    return () => {
      cancelled = true;
    };
  }, [siteId, requestedTemplateId]);

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