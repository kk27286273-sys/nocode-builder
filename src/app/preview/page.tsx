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
  const preset = searchParams.get('preset');

  const [data, setData] = useState<B2BTemplateData>(defaultB2BTemplateData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPreviewData() {
      setLoading(true);

      // 1. Supabase 사이트 데이터 우선
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
  setData(siteRecord.data as B2BTemplateData);
          setLoading(false);
          return;
        }
      }

      // 2. URL의 preset 쿼리 처리 (?preset=legal 등)
      if (preset && B2B_PRESETS[preset]) {
        setData(B2B_PRESETS[preset]);
        setLoading(false);
        return;
      }

      // 3. 쇼룸 ID 기반 프리셋 매칭 (?templateId=legal-tax 등)
      if (templateId) {
        const matched = SHOWROOM_TEMPLATES.find((t) => t.id === templateId);
        const presetKey = matched?.previewUrl.split('preset=')[1];

        if (presetKey && B2B_PRESETS[presetKey]) {
          setData(B2B_PRESETS[presetKey]);
          setLoading(false);
          return;
        }

        if (matched) {
          setData({
            ...defaultB2BTemplateData,
            themeColor: matched.themeColor,
          });
          setLoading(false);
          return;
        }
      }

      // 기본 데이터 폴백
      setData(defaultB2BTemplateData);
      setLoading(false);
    }

    loadPreviewData();
  }, [siteId, templateId, preset]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-600">
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
        <div className="min-h-screen flex items-center justify-center bg-white text-slate-600">
          미리보기를 불러오는 중입니다...
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}