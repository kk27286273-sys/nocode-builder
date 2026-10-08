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
      console.error("데이터 로드 에러:", error);
    } else if (siteData && siteData.data) {
      // [임시 조치] DB 데이터가 원페이지형일 경우, 강제로 기업형 기본 구조를 씌웁니다.
      const currentData = siteData.data;
      
      if (currentData.templateType !== 'corporate') {
        setData({
          ...currentData,
          templateType: 'corporate',
          company: { name: '태산금형', logoUrl: '' },
          hero: { title: '모바일 최적화 실속형 홈페이지', subtitle: '기업 회사소개부터 매장 홍보까지', badge: '3~4일 신속 구축', mediaUrl: '' },
          solutions: [
            { title: 'B2B 기업 웹', category: '제조업', description: '신뢰도 높은 반응형 웹', image: '' },
            { title: '매장 홍보 웹', category: '포트폴리오', description: '견적 요청 구조', image: '' },
            { title: '1인 기업 랜딩', category: '전문직', description: '빠른 상담 연결', image: '' },
          ],
          navigation: {
            navLinks: [
              { label: '홈으로', targetId: 'main' },
              { label: 'CEO 인사말', targetId: 'ceo' },
              { label: '사업소개', targetId: 'sol_detail' },
              { label: '문의하기', targetId: 'cs' },
            ]
          }
        });
      } else {
        setData(currentData);
      }
    }
    
    setIsLoading(false);
  }

  async function handlePublish() {
    if (!siteId || !data) return alert('사이트를 먼저 선택해주세요.');
    setIsLoading(true);
    const { error } = await supabase.from('sites').update({ data }).eq('id', siteId);
    if (error) {
      alert('발행 실패: ' + error.message);
    } else {
      window.open(`/site/${siteId}`, '_blank');
    }
    setIsLoading(false);
  }

  async function deleteSite() {
    if (!siteId || !confirm('정말 삭제하시겠습니까?')) return;
    setIsLoading(true);
    await supabase.from('sites').delete().eq('id', siteId);
    setSiteId(null);
    setData(null);
    fetchSites();
    setIsLoading(false);
  }

  if (!data) return <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900 font-bold text-white">빌더 데이터를 불러오는 중...</div>;

  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen flex overflow-hidden bg-slate-100">
      {/* 좌측 패널 전체: 상단 제어바 + 에디터 */}
      <div className="w-[430px] h-full flex flex-col shrink-0 bg-white border-r border-slate-300 shadow-2xl relative z-20">
        
        {/* 상단 제어바 */}
        <div className="h-14 px-4 bg-slate-900 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Site</span>
            <select 
              value={siteId || ''} 
              onChange={(e) => loadSiteData(e.target.value)} 
              className="bg-slate-800 text-white text-xs px-2 py-1.5 rounded border border-slate-700 outline-none cursor-pointer max-w-[130px] truncate"
            >
              <option value="">사이트 선택</option>
              {sitesList.map((site) => <option key={site.id} value={site.id}>{site.name || site.id}</option>)}
            </select>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              type="button" 
              onClick={() => setActiveSection('main')} 
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700 transition"
            >
              메인
            </button>
            <button 
              type="button" 
              onClick={handlePublish} 
              disabled={isLoading} 
              className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded shadow disabled:opacity-50 transition"
            >
              {isLoading ? '저장...' : '발행'}
            </button>
            <button 
              type="button" 
              onClick={deleteSite} 
              disabled={!siteId || isLoading} 
              className="bg-rose-600 hover:bg-rose-700 disabled:bg-slate-800 text-white text-xs font-medium px-2 py-1.5 rounded transition"
            >
              삭제
            </button>
          </div>
        </div>

        {/* 하단 에디터 영역 */}
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

      {/* 우측 뷰어 */}
      <main className="flex-1 h-full overflow-hidden bg-slate-200 relative z-10">
        <ViewerManager data={data} activeSection={activeSection} setActiveSection={setActiveSection} />
      </main>
    </div>
  );
}