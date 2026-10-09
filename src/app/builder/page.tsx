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
      // [핵심 수정] 구버전 기본값으로 덮어씌우는 로직을 완전히 제거했습니다.
      // DB에 있는 데이터를 있는 그대로 사용하며, 최소한의 필수 구조만 보장합니다.
      const currentData = siteData.data;
      
      setData({
        ...currentData,
        company: currentData.company || { name: '', logoUrl: '' },
        solutions: currentData.solutions || [],
      });
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
      <div className="w-[430px] h-full flex flex-col shrink-0 bg-white border-r border-slate-300 shadow-2xl relative z-20">
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

      <main className="flex-1 h-full min-h-0 bg-slate-200 relative z-10 overflow-hidden">
        <ViewerManager data={data} activeSection={activeSection} setActiveSection={setActiveSection} />
      </main>
    </div>
  );
}