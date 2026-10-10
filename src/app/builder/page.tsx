'use client';

import React, { useState, useEffect } from 'react';
import { B2BTemplateData } from '@/types/template';
import { supabase } from '@/lib/supabase/client';
import EditorSidebar from '@/components/builder/EditorSidebar';
import ViewerManager from '@/components/builder/ViewerManager';

export default function BuilderPage() {
  const [data, setData] = useState<B2BTemplateData | null>(null);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [sitesList, setSitesList] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState('main');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  async function fetchSites() {
    const { data: sites } = await supabase.from('sites').select('*');

    if (sites && sites.length > 0) {
      setSitesList(sites);
      if (!siteId) loadSiteData(sites[0].id);
    }
  }

  async function loadSiteData(id: string) {
    if (!id) return;

    setSiteId(id);
    setIsLoading(true);

    const { data: siteData, error } = await supabase
      .from('sites')
      .select('data')
      .eq('id', id)
      .single();

    if (error) {
      console.error('데이터 로드 에러:', error);
    } else if (siteData?.data) {
      const currentData = siteData.data;

      // 에디터 메뉴 구성을 유지하기 위한 기본 틀
      const defaultCorporateData: B2BTemplateData = {
        templateType: 'corporate',
        themeColor: '#2563eb',
        company: {
          name: '회사명을 입력해주세요',
          logoUrl: '/images/default-logo.png',
        },
        hero: {
          title: '최고의 정밀 기술로 산업의 표준을 제시합니다',
          subtitle: '글로벌 시장을 선도하는 정밀 금형 솔루션 기업',
          badge: 'Since 1990',
          mediaUrl: '',
        },
        solutions: [
          {
            title: '정밀 금형 설계',
            category: '핵심기술',
            description: '초정밀 설계를 통한 완벽한 품질 구현',
            image: '',
            detailedFeatures: [
              { featureTitle: '특징 1', featureContent: '상세 내용입니다.' },
            ],
          },
        ],
        corporateInfo: {
          ceoGreeting: {
            title: '신뢰와 기술로 보답하겠습니다',
            content: 'CEO 인사말 내용이 들어갑니다.',
            image: '',
          },
          missionVision: {
            mission: '인류 산업 발전에 기여하는 기술력',
            vision: '2030 글로벌 톱 10 정밀금형 기업',
          },
          history: [{ year: '2024', event: '글로벌 시장 진출 및 확장' }],
          orgChart: '',
          ciImage: '',
          location: {
            headOffice: {
              address: '서울시 강남구...',
              tel: '02-000-0000',
              fax: '02-000-0000',
            },
          },
          esg: {
            environmental: {
              title: '환경경영',
              content: '친환경 공정 도입',
              image: '',
            },
            social: {
              title: '사회공헌',
              content: '지역사회 상생',
              image: '',
            },
            governance: {
              title: '투명경영',
              content: '윤리경영 실천',
              image: '',
            },
          },
          disclosure: { certifications: [], reports: [] },
        },
        navigation: {
          menus: [
            {
              label: '회사소개',
              children: [
                { label: 'CEO인사말', targetId: 'ceo' },
                { label: '연혁', targetId: 'history' },
              ],
            },
            {
              label: '사업소개',
              children: [{ label: '솔루션', targetId: 'sol_detail' }],
            },
          ],
        },
        prCenter: { news: [], notice: [] },
        recruit: {
          talentValue: '도전하는 인재',
          benefitInfo: '최고의 복지',
          openPositions: [],
        },
        csCenter: {
          faq: [],
          contactInfo: {
            email: 'help@company.com',
            phone: '02-000-0000',
            address: '서울시...',
          },
        },
        supportPhone: '02-000-0000',
        csGuide: '평일 09:00 ~ 18:00',
        kakaoLink: '',
        newsContent: '',
        videoUrl: '',
        talentValue: '열정적인 인재',
        benefitInfo: '자유로운 연차 사용',
        footer: {
          address: '서울시...',
          ownerName: '대표자명',
          businessNumber: '000-00-00000',
          contactEmail: 'info@company.com',
          companyName: '태산금형',
        },
      };

      // 기존 데이터 유지 + 빈 틀만 채우기
      setData({
        ...defaultCorporateData,
        ...currentData,
        company: {
          ...defaultCorporateData.company,
          ...(currentData.company || {}),
        },
        solutions:
          currentData.solutions && currentData.solutions.length > 0
            ? currentData.solutions
            : defaultCorporateData.solutions,
      });
    }

    setIsLoading(false);
  }

  async function handlePublish() {
    if (!siteId || !data) {
      alert('사이트를 먼저 선택해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('sites')
        .update({ data })
        .eq('id', siteId);

      if (error) {
        alert('발행 실패: ' + error.message);
        return;
      }

      window.open(`/preview?id=${encodeURIComponent(siteId)}`, '_blank');
    } catch (error) {
      console.error('발행 중 오류:', error);
      alert('발행 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteSite() {
    if (!siteId || !confirm('정말 삭제하시겠습니까?')) return;

    setIsLoading(true);

    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', siteId);

    if (error) {
      console.error('사이트 삭제 에러:', error);
      alert('사이트 삭제 실패: ' + error.message);
      setIsLoading(false);
      return;
    }

    setSiteId(null);
    setData(null);
    await fetchSites();
    setIsLoading(false);
  }

  if (!data) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900 font-bold text-white">
        빌더 데이터를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="relative z-[9999] flex min-h-screen w-full overflow-y-auto bg-slate-100">
      <div className="relative z-20 flex min-h-screen w-[430px] shrink-0 flex-col border-r border-slate-300 bg-white shadow-2xl">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Site
            </span>
            <select
              value={siteId || ''}
              onChange={(event) => loadSiteData(event.target.value)}
              className="max-w-[130px] cursor-pointer truncate rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white outline-none"
            >
              <option value="">사이트 선택</option>
              {sitesList.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name || site.id}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
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
              {isLoading ? '저장...' : '발행'}
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