'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { B2BTemplateData, defaultB2BTemplateData } from '@/data/templates';
import { supabase } from '@/lib/supabase/client';
import LivePreview from '@/components/builder/LivePreview';

// 업종별 기본 데이터를 매칭하기 위한 헬퍼 함수
function getPresetData(id: string): B2BTemplateData {
  if (id.includes('legal')) {
    return {
      ...defaultB2BTemplateData,
      siteName: '법률사무소 정론',
      mainHero: {
        title: '승소율 98% 전문 변호사',
        subtitle: '당신의 권리를 지키는 가장 확실한 법률 파트너',
        description: '복잡한 법률 분쟁, 치밀한 전략과 압도적인 증거로 최선의 결과를 만들어냅니다.',
      },
      stats: [
        { label: '누적 승소 사례', value: '1,200+', icon: '⚖️' },
        { label: '업계 경력', value: '15년', icon: '🎓' },
        { label: '긴급 대응 체계', value: '24h', icon: '📞' },
      ],
      features: [
        { title: '민사/형사 소송', description: '치밀한 법리 분석을 통해 의뢰인의 이익을 극대화합니다.' },
        { title: '기업 법무 자문', description: '리스크를 사전에 방지하는 체계적인 기업 법률 솔루션을 제공합니다.' },
        { title: '가사/상속 분쟁', description: '섬세한 접근과 전문성으로 가족 간의 갈등을 원만히 해결합니다.' },
      ],
      contactForm: {
        title: '비밀 상담 신청',
        description: '문의 내용을 남겨주시면 확인 후 담당 변호사가 신속히 연락드립니다.',
        fields: ['성함', '연락처', '상담 희망 분야', '문의 내용'],
      },
    };
  }

  if (id.includes('fitness')) {
    return {
      ...defaultB2BTemplateData,
      siteName: '에너제틱 피트니스',
      mainHero: {
        title: '결과로 증명하는 프리미엄 PT',
        subtitle: '당신의 인생 마지막 다이어트',
        description: '과학적인 프로그램과 체계적인 식단 관리로 최단 기간 최대 효율의 변화를 만들어냅니다.',
      },
      stats: [
        { label: '누적 회원수', value: '2,000+', icon: '💪' },
        { label: '평균 감량치', value: '-8kg', icon: '📉' },
        { label: '만족도', value: '99%', icon: '⭐' },
      ],
      features: [
        { title: '1:1 맞춤 PT', description: '개인별 신체 특성을 분석하여 최적의 운동 루틴을 설계합니다.' },
        { title: '식단 밀착 관리', description: '단순한 제한이 아닌, 지속 가능한 건강한 식단을 제안합니다.' },
        { title: '체형 교정 솔루션', description: '통증 완화와 라인 개선을 동시에 잡는 전문 교정 프로그램을 운영합니다.' },
      ],
      contactForm: {
        title: '무료 체험 신청',
        description: '첫 방문 상담 및 체험 PT를 통해 당신의 몸 상태를 진단해 드립니다.',
        fields: ['성함', '연락처', '운동 목적', '희망 시간대'],
      },
    };
  }

  return defaultB2BTemplateData;
}

export interface ViewerClientProps {
  data?: B2BTemplateData;
  siteId?: string;
}

export default function ViewerClient({ data: initialData, siteId: propSiteId }: ViewerClientProps) {
  const params = useParams();
  const siteId = propSiteId || (params?.id as string);
  const pageId = params?.pageId as string | undefined;

  const [data, setData] = useState<B2BTemplateData>(() => {
    if (initialData) return initialData;
    if (siteId) return getPresetData(siteId);
    return defaultB2BTemplateData;
  });

  const [loading, setLoading] = useState<boolean>(!initialData && !!siteId);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setLoading(false);
      return;
    }

    if (siteId) {
      setLoading(true);
      supabase
        .from('sites')
        .select('content')
        .eq('id', siteId)
        .single()
        .then(({ data: siteRecord }) => {
          if (siteRecord?.content) {
            const content = siteRecord.content;

            // solutionMain이 없는 구버전 데이터 구조를 보정합니다.
            if (!content.solutionMain && content.solutions && content.solutions.length > 0) {
              const firstSol = content.solutions[0];
              content.solutionMain = {
                title: firstSol.title || '사업 소개',
                description: firstSol.description || '솔루션 상세 안내',
                detailContent: firstSol.detailContent || '상세 내용을 확인하세요.',
              };
            }

            setData(content);
          } else {
            setData(getPresetData(siteId));
          }

          setLoading(false);
        });
    }
  }, [initialData, siteId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-slate-500 text-sm font-semibold animate-pulse">
          페이지를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <LivePreview
        data={data}
        zoom={100}
        currentPageId={pageId || 'main'}
        published
      />
    </div>
  );
}