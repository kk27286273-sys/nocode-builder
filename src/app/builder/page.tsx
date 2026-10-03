'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { defaultB2BTemplate, B2BTemplateData } from '@/data/templates';
import LivePreview from '@/components/builder/LivePreview';
import EditorSidebar from '@/components/builder/EditorSidebar';
import { supabase } from '@/lib/supabase';

interface SiteItem {
  id: string;
  name: string;
  data: B2BTemplateData;
}

export default function BuilderPage() {
  const [sites, setSites] = useState<SiteItem[]>([
    {
      id: 'default-b2b',
      name: defaultB2BTemplate?.company?.name || '기본 B2B 템플릿',
      data: defaultB2BTemplate,
    },
  ]);
  const [currentSiteId, setCurrentSiteId] = useState<string>('default-b2b');
  const [data, setData] = useState<B2BTemplateData>(defaultB2BTemplate);
  const [zoom, setZoom] = useState<number>(100);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // 1. 수파베이스에서 저장된 고객 사이트 목록 불러오기
  const fetchSites = async () => {
    try {
      const { data: dbSites, error } = await supabase
        .from('sites')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.warn('수파베이스 사이트 조회 경고:', error.message);
        return;
      }

      if (dbSites && dbSites.length > 0) {
        setSites(dbSites);
        setCurrentSiteId(dbSites[0].id);
        if (dbSites[0].data) {
          setData(dbSites[0].data);
        }
      }
    } catch (err) {
      console.error('사이트 목록 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  // 2. 상단 드롭다운에서 다른 고객 사이트를 선택했을 때 데이터 교체
  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId === 'NEW') {
      const newName = prompt('새로 제작할 업체명을 입력하세요:');
      if (!newName || !newName.trim()) return;

      const newId = `site-${Date.now()}`;
      const newTemplateData: B2BTemplateData = {
        ...defaultB2BTemplate,
        company: { ...defaultB2BTemplate.company, name: newName.trim() },
      };

      const newSiteItem: SiteItem = {
        id: newId,
        name: newName.trim(),
        data: newTemplateData,
      };

      setSites((prev) => [newSiteItem, ...prev]);
      setCurrentSiteId(newId);
      setData(newTemplateData);
      return;
    }

    const targetSite = sites.find((s) => s.id === selectedId);
    if (targetSite && targetSite.data) {
      setCurrentSiteId(targetSite.id);
      setData(targetSite.data);
    }
  };

  // 3. 더미 이미지 업로드 핸들러 (EditorSidebar 안전 연동)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, pathKey?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        setData((prev) => {
          const updated = { ...prev };
          if (pathKey === 'company.logoUrl') {
            updated.company.logoUrl = base64Url;
          }
          return updated;
        });
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  // 4. [발행하기] 클릭 시 수파베이스 DB에 영구 저장 후 새 창 오픈
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const siteName = data?.company?.name || '업체 사이트';

      const { error } = await supabase.from('sites').upsert({
        id: currentSiteId,
        name: siteName,
        data: data,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.warn('DB upsert 경고:', error.message);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('thsoft_published_site', JSON.stringify(data));
      }

      await fetchSites();

      const previewUrl = `/preview?siteId=${currentSiteId}`;
      const newWindow = window.open(previewUrl, '_blank');
      if (!newWindow) {
        alert('팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해 주세요.');
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('발행 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden font-sans">
      {/* 상단 헤더 바 */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>TH소프트</span>
            <span className="text-xs font-medium text-slate-400">| 멀티 웹 빌더</span>
          </Link>

          {/* 고객 사이트 전환 드롭다운 */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            <span className="text-xs font-bold text-slate-500">작업 사이트:</span>
            <select
              value={currentSiteId}
              onChange={handleSiteChange}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name} ({site.id})
                </option>
              ))}
              <option value="NEW">+ 새 업체 사이트 만들기</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/preview?siteId=${currentSiteId}`}
            target="_blank"
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            새 탭에서 미리보기
          </Link>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            {isPublishing ? '클라우드 DB 저장 중...' : '클라우드 실시간 발행'}
          </button>
        </div>
      </header>

      {/* 중앙 작업 공간: 좌측(전체 편집 사이드바) + 우측(캔버스) */}
      <div className="flex-1 flex overflow-hidden">
        <EditorSidebar
          data={data}
          setData={setData}
          onPublish={handlePublish}
          saving={isPublishing}
          uploadingImage={uploadingImage}
          handleImageUpload={handleImageUpload}
          setIsPaymentOpen={() => {}}
          onOpenPayment={() => {}}
        />
        <div className="flex-1 flex overflow-hidden">
          <LivePreview data={data} zoom={zoom} setZoom={setZoom} />
        </div>
      </div>
    </div>
  );
}