'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { B2BTemplateData } from '@/types/template';
import { supabase } from '@/lib/supabase/client';
import EditorSidebar from '@/components/builder/EditorSidebar';
import ViewerManager from '@/components/builder/ViewerManager';

type TemplateKey = 'onepage' | 'corporate' | 'fitness' | 'legal';

type SiteRecord = {
  id: string;
  name: string | null;
  data: any;
  template_type?: string | null;
};

const TEMPLATE_OPTIONS: { key: TemplateKey; label: string }[] = [
  { key: 'onepage', label: '원페이지' },
  { key: 'corporate', label: '기업형' },
  { key: 'fitness', label: '피트니스형' },
  { key: 'legal', label: '법률형' },
];

const TEMPLATE_ALIASES: Record<TemplateKey, string[]> = {
  onepage: ['onepage', 'one-page', '원페이지'],
  corporate: ['corporate', '기업형', '기업형 홈페이지'],
  fitness: ['fitness', '피트니스', '피트니스형', '피트니스형 홈페이지'],
  legal: ['legal', '법률', '법률형', '법률형 홈페이지'],
};

function normalizeTemplate(value: unknown): TemplateKey | null {
  if (typeof value !== 'string') return null;

  const normalized = value.trim().toLowerCase();

  for (const option of TEMPLATE_OPTIONS) {
    if (
      TEMPLATE_ALIASES[option.key].some(
        (alias) => alias.toLowerCase() === normalized,
      )
    ) {
      return option.key;
    }
  }

  return null;
}

function getSiteTemplate(site: SiteRecord): TemplateKey | null {
  return (
    normalizeTemplate(site.template_type) ||
    normalizeTemplate(site.data?.templateType) ||
    normalizeTemplate(site.name)
  );
}

function createDefaultData(template: TemplateKey): B2BTemplateData {
  const base = {
    templateType: template,
    themeColor:
      template === 'fitness'
        ? '#f97316'
        : template === 'legal'
          ? '#0f172a'
          : '#2563eb',
    company: {
      name:
        template === 'fitness'
          ? '피트니스 센터'
          : template === 'legal'
            ? '법률 사무소'
            : template === 'onepage'
              ? '브랜드명'
              : '회사명을 입력해주세요',
      logoUrl: '/images/default-logo.png',
    },
    hero: {
      title:
        template === 'fitness'
          ? '건강한 변화를 시작하세요'
          : template === 'legal'
            ? '신뢰할 수 있는 법률 파트너'
            : template === 'onepage'
              ? '브랜드의 가치를 한 페이지에'
              : '최고의 정밀 기술로 산업의 표준을 제시합니다',
      subtitle:
        template === 'fitness'
          ? '전문 코치와 함께하는 맞춤형 운동 프로그램'
          : template === 'legal'
            ? '의뢰인의 권리를 지키는 전문적인 법률 서비스'
            : template === 'onepage'
              ? '서비스와 브랜드를 간결하고 효과적으로 소개합니다.'
              : '글로벌 시장을 선도하는 정밀 금형 솔루션 기업',
      badge:
        template === 'fitness'
          ? 'PERSONAL TRAINING'
          : template === 'legal'
            ? 'LEGAL SERVICE'
            : template === 'corporate'
              ? 'Since 1990'
              : 'WELCOME',
      mediaUrl: '',
    },
    solutions: [
      {
        title:
          template === 'fitness'
            ? '맞춤형 트레이닝'
            : template === 'legal'
              ? '전문 법률 상담'
              : template === 'onepage'
                ? '핵심 서비스'
                : '정밀 금형 설계',
        category:
          template === 'fitness'
            ? '트레이닝'
            : template === 'legal'
              ? '법률 서비스'
              : template === 'onepage'
                ? '서비스'
                : '핵심기술',
        description:
          template === 'fitness'
            ? '목표와 체력에 맞춘 운동 프로그램을 제공합니다.'
            : template === 'legal'
              ? '사안에 맞는 전문적인 검토와 대응을 제공합니다.'
              : template === 'onepage'
                ? '고객에게 제공하는 핵심 서비스를 소개합니다.'
                : '초정밀 설계를 통한 완벽한 품질 구현',
        image: '',
        detailedFeatures: [
          { featureTitle: '특징 1', featureContent: '상세 내용을 입력해주세요.' },
        ],
      },
    ],
    corporateInfo: {
      ceoGreeting: {
        title: '신뢰와 전문성으로 보답하겠습니다',
        content: '소개 내용을 입력해주세요.',
        image: '',
      },
      missionVision: {
        mission: '고객에게 더 나은 가치를 제공합니다.',
        vision: '분야를 선도하는 전문 브랜드',
      },
      history: [{ year: '2024', event: '서비스 시작' }],
      orgChart: '',
      ciImage: '',
      location: {
        headOffice: {
          address: '주소를 입력해주세요.',
          tel: '전화번호를 입력해주세요.',
          fax: '',
        },
      },
      esg: {
        environmental: { title: '환경', content: '', image: '' },
        social: { title: '사회', content: '', image: '' },
        governance: { title: '경영', content: '', image: '' },
      },
      disclosure: { certifications: [], reports: [] },
    },
    navigation: {
      menus:
        template === 'corporate'
          ? [
              { label: '회사소개', children: [] },
              { label: '사업소개', children: [] },
              { label: '지속가능경영', children: [] },
              { label: '홍보센터', children: [] },
              { label: '인재경영', children: [] },
              { label: '고객센터', children: [] },
            ]
          : [
              {
                label: '소개',
                children: [{ label: '서비스 소개', targetId: 'services' }],
              },
            ],
    },
    prCenter: { news: [], notice: [] },
    recruit: {
      talentValue: '함께 성장하는 인재',
      benefitInfo: '복지 정보를 입력해주세요.',
      openPositions: [],
    },
    csCenter: {
      faq: [],
      contactInfo: {
        email: 'info@example.com',
        phone: '02-000-0000',
        address: '주소를 입력해주세요.',
      },
    },
    supportPhone: '02-000-0000',
    csGuide: '운영시간을 입력해주세요.',
    kakaoLink: '',
    newsContent: '',
    videoUrl: '',
    talentValue: '함께 성장하는 인재',
    benefitInfo: '복지 정보를 입력해주세요.',
    footer: {
      address: '주소를 입력해주세요.',
      ownerName: '대표자명',
      businessNumber: '사업자등록번호',
      contactEmail: 'info@example.com',
      companyName: '회사명',
    },
  };

  return base as unknown as B2BTemplateData;
}

function mergeWithDefaultData(
  template: TemplateKey,
  currentData: any,
): B2BTemplateData {
  const defaults = createDefaultData(template);

  if (!currentData || typeof currentData !== 'object') {
    return defaults;
  }

  return {
    ...defaults,
    ...currentData,
    templateType: template,
    company: {
      ...defaults.company,
      ...(currentData.company || {}),
    },
    hero: {
      ...defaults.hero,
      ...(currentData.hero || {}),
    },
    solutions:
      Array.isArray(currentData.solutions) && currentData.solutions.length > 0
        ? currentData.solutions
        : defaults.solutions,
    corporateInfo: {
      ...defaults.corporateInfo,
      ...(currentData.corporateInfo || {}),
      ceoGreeting: {
        ...defaults.corporateInfo.ceoGreeting,
        ...(currentData.corporateInfo?.ceoGreeting || {}),
      },
      missionVision: {
        ...defaults.corporateInfo.missionVision,
        ...(currentData.corporateInfo?.missionVision || {}),
      },
      location: {
        ...defaults.corporateInfo.location,
        ...(currentData.corporateInfo?.location || {}),
        headOffice: {
          ...defaults.corporateInfo.location.headOffice,
          ...(currentData.corporateInfo?.location?.headOffice || {}),
        },
      },
    },
    navigation: {
      ...defaults.navigation,
      ...(currentData.navigation || {}),
    },
    prCenter: {
      ...defaults.prCenter,
      ...(currentData.prCenter || {}),
    },
    recruit: {
      ...defaults.recruit,
      ...(currentData.recruit || {}),
    },
    csCenter: {
      ...defaults.csCenter,
      ...(currentData.csCenter || {}),
      contactInfo: {
        ...defaults.csCenter.contactInfo,
        ...(currentData.csCenter?.contactInfo || {}),
      },
    },
    footer: {
      ...defaults.footer,
      ...(currentData.footer || {}),
    },
  } as B2BTemplateData;
}

export default function BuilderPage() {
  const [data, setData] = useState<B2BTemplateData | null>(null);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [sitesList, setSitesList] = useState<SiteRecord[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateKey>('corporate');
  const [activeSection, setActiveSection] = useState('main');
  const [isLoading, setIsLoading] = useState(true);

  const fetchSites = useCallback(async () => {
    const { data: sites, error } = await supabase
      .from('sites')
      .select('id, name, data, template_type')
      .order('name');

    if (error) {
      console.error('사이트 목록 로드 에러:', error);
      setSitesList([]);
      setIsLoading(false);
      return;
    }

    const list = (sites || []) as SiteRecord[];
    setSitesList(list);

    if (list.length === 0) {
      setSiteId(null);
      setData(null);
      setIsLoading(false);
      return;
    }

    const currentSite = siteId
      ? list.find((site) => site.id === siteId)
      : undefined;

    const initialSite =
      currentSite ||
      list.find((site) => getSiteTemplate(site) === 'corporate') ||
      list[0];

    const template = getSiteTemplate(initialSite) || 'corporate';

    setSiteId(initialSite.id);
    setSelectedTemplate(template);
    setData(mergeWithDefaultData(template, initialSite.data));
    setIsLoading(false);
  }, [siteId]);

  useEffect(() => {
    void fetchSites();
  }, [fetchSites]);

  async function loadSiteData(id: string) {
    if (!id) return;

    const selectedSite = sitesList.find((site) => site.id === id);
    if (!selectedSite) return;

    const template = getSiteTemplate(selectedSite) || 'corporate';

    setIsLoading(true);
    setSiteId(id);
    setSelectedTemplate(template);

    const { data: siteData, error } = await supabase
      .from('sites')
      .select('id, name, data, template_type')
      .eq('id', id)
      .single();

    if (error) {
      console.error('데이터 로드 에러:', error);
      alert('사이트 데이터를 불러오지 못했습니다: ' + error.message);
      setIsLoading(false);
      return;
    }

    setData(mergeWithDefaultData(template, siteData?.data));
    setActiveSection('main');
    setIsLoading(false);
  }

  async function handleTemplateChange(template: TemplateKey) {
    setSelectedTemplate(template);

    const matchingSite = sitesList.find(
      (site) => getSiteTemplate(site) === template,
    );

    if (!matchingSite) {
      setSiteId(null);
      setData(null);
      alert(
        `${TEMPLATE_OPTIONS.find((option) => option.key === template)?.label} 사이트가 Supabase에 없습니다. 먼저 해당 템플릿의 사이트 데이터를 생성해야 합니다.`,
      );
      return;
    }

    await loadSiteData(matchingSite.id);
  }

  async function handlePublish() {
    if (!siteId || !data) {
      alert('선택한 템플릿의 사이트를 찾을 수 없습니다.');
      return;
    }

    setIsLoading(true);

    try {
      const templateLabel =
        TEMPLATE_OPTIONS.find((option) => option.key === selectedTemplate)
          ?.label || selectedTemplate;

      const publishData = {
        ...data,
        templateType: selectedTemplate,
      };

      const { error } = await supabase
        .from('sites')
        .update({
          data: publishData,
          template_type: selectedTemplate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', siteId);

      if (error) {
        alert('발행 실패: ' + error.message);
        return;
      }

      alert(`${templateLabel} 홈페이지를 저장했습니다.`);
      window.open(
        `/preview/${encodeURIComponent(siteId)}`,
        '_blank',
        'noopener,noreferrer',
      );
    } catch (error) {
      console.error('발행 중 오류:', error);
      alert('발행 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteSite() {
    if (!siteId || !confirm('정말 선택한 사이트를 삭제하시겠습니까?')) return;

    setIsLoading(true);

    const { error } = await supabase.from('sites').delete().eq('id', siteId);

    if (error) {
      console.error('사이트 삭제 에러:', error);
      alert('사이트 삭제 실패: ' + error.message);
      setIsLoading(false);
      return;
    }

    setSiteId(null);
    setData(null);
    await fetchSites();
  }

  const templateSites = sitesList.filter(
    (site) => getSiteTemplate(site) === selectedTemplate,
  );

  const selectedTemplateLabel =
    TEMPLATE_OPTIONS.find((option) => option.key === selectedTemplate)?.label ||
    '템플릿';

  if (isLoading && !data) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900 font-bold text-white">
        빌더 데이터를 불러오는 중...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-slate-900 px-6 text-center text-white">
        <p className="text-lg font-bold">
          {selectedTemplateLabel} 사이트 데이터를 찾을 수 없습니다.
        </p>
        <p className="max-w-xl text-sm text-slate-300">
          Supabase의 `sites` 테이블에 해당 템플릿의 사이트가 있어야 편집할 수
          있습니다. 기존 데이터의 `template_type` 또는 `data.templateType`을
          `onepage`, `corporate`, `fitness`, `legal` 중 하나로 지정하거나,
          사이트 이름을 원페이지·기업형·피트니스형·법률형으로 설정해 주세요.
        </p>
        <button
          type="button"
          onClick={() => void fetchSites()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-500"
        >
          다시 불러오기
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-[9999] flex min-h-screen w-full overflow-y-auto bg-slate-100">
      <div className="relative z-20 flex min-h-screen w-[430px] shrink-0 flex-col border-r border-slate-300 bg-white shadow-2xl">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 text-[11px] font-black uppercase tracking-wider text-slate-400">
              템플릿
            </span>

            <select
              value={selectedTemplate}
              onChange={(event) =>
                void handleTemplateChange(event.target.value as TemplateKey)
              }
              disabled={isLoading}
              aria-label="편집할 템플릿 선택"
              className="max-w-[145px] cursor-pointer truncate rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white outline-none disabled:opacity-50"
            >
              {TEMPLATE_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={siteId || ''}
              onChange={(event) => void loadSiteData(event.target.value)}
              disabled={isLoading || templateSites.length === 0}
              aria-label={`${selectedTemplateLabel} 사이트 선택`}
              className="max-w-[120px] cursor-pointer truncate rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white outline-none disabled:opacity-50"
            >
              <option value="">
                {templateSites.length ? '사이트 선택' : '사이트 없음'}
              </option>
              {templateSites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name || site.id}
                </option>
              ))}
            </select>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveSection('main')}
              className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
            >
              메인
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isLoading}
              className="rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow transition hover:bg-blue-500 disabled:opacity-50"
            >
              {isLoading ? '저장...' : '저장·발행'}
            </button>
            <button
              type="button"
              onClick={deleteSite}
              disabled={!siteId || isLoading}
              className="rounded bg-rose-600 px-2 py-1.5 text-xs font-medium text-white transition hover:bg-rose-700 disabled:bg-slate-800"
            >
              삭제
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <EditorSidebar
            data={data}
            setData={setData}
            siteId={siteId}
            refreshSites={fetchSites}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>
      </div>

      <main className="relative z-10 min-h-screen flex-1 bg-slate-200">
        <ViewerManager
          data={data}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </main>
    </div>
  );
}