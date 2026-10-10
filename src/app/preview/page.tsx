'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { defaultB2BTemplateData, B2BTemplateData } from '@/data/templates';
import { SHOWROOM_TEMPLATES } from '@/data/showroomTemplates';
import LivePreview from '@/components/builder/LivePreview';
import { supabase } from '@/lib/supabase/client';

function PreviewContent() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get('id');
  const templateId = searchParams.get('templateId');

  const [data, setData] = useState<B2BTemplateData>(defaultB2BTemplateData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPreviewData() {
      setLoading(true);

      // 1. Supabase 사이트 데이터 로드
      if (siteId) {
        const { data: siteRecord, error } = await supabase
          .from('sites')
          .select('data')
          .eq('id', siteId)
          .single();

        if (error) {
          console.error('발행 사이트 데이터 로드 실패:', error);
        }

        if (siteRecord?.data) {
          try {
            const parsedData =
              typeof siteRecord.data === 'string'
                ? JSON.parse(siteRecord.data)
                : siteRecord.data;

            setData({
              ...defaultB2BTemplateData,
              ...parsedData,
            });
            setLoading(false);
            return;
          } catch (e) {
            console.error('데이터 파싱 오류:', e);
          }
        }
      }

      // 2. 쇼룸 템플릿 매칭
      if (templateId) {
        const matched = SHOWROOM_TEMPLATES.find((t) => t.id === templateId);
        if (matched) {
          setData({
            ...defaultB2BTemplateData,
            themeColor: matched.themeColor,
          });
          setLoading(false);
          return;
        }
      }

      // 3. 기본 데이터 폴백
      setData(defaultB2BTemplateData);
      setLoading(false);
    }

    loadPreviewData();
  }, [siteId, templateId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-600 font-medium">
        미리보기를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LivePreview data={data} zoom={100} />
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white text-slate-600 font-medium">
          미리보기를 불러오는 중입니다...
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}