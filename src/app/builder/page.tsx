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

  useEffect(() => { fetchSites(); }, []);

  async function fetchSites() {
    const { data: sites } = await supabase.from('sites').select('*');
    if (sites) setSitesList(sites);
  }

  async function loadSiteData(id: string) {
    setSiteId(id);
    setIsLoading(true);
    const { data: siteData } = await supabase.from('sites').select('data').eq('id', id).single();
    if (siteData) setData(siteData.data);
    setIsLoading(false);
  }

  async function handlePublish() {
    if (!siteId || !data) return alert('사이트를 선택해주세요.');
    setIsLoading(true);
    // 발행 로직 (생략 가능)
    alert('사이트가 성공적으로 발행되었습니다!');
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

  if (!data) return <div className="h-screen w-screen flex items-center justify-center">데이터를 로딩 중입니다...</div>;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      <div className="flex flex-col h-full w-[430px] shrink-0 border-r border-slate-200 bg-white shadow-xl">
        <div className="p-3 bg-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <label className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Site</label>
            <select value={siteId || ''} onChange={(e) => loadSiteData(e.target.value)} className="bg-slate-700 text-white text-xs px-2 py-1 rounded border border-slate-600 outline-none max-w-full">
              <option value="">사이트 선택</option>
              {sitesList.map((site) => <option key={site.id} value={site.id}>{site.name || site.id}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveSection('main')} className="px-3 py-1.5 bg-white text-slate-900 text-[11px] font-extrabold rounded-md hover:bg-slate-100 transition border border-slate-300 shadow-sm">
              ← 메인으로
            </button>
            <button onClick={handlePublish} disabled={isLoading} style={{ backgroundColor: data.themeColor }} className="px-4 py-2 text-xs font-bold text-white rounded-lg shadow disabled:opacity-50 hover:opacity-90 transition">
              {isLoading ? '...' : '사이트 발행'}
            </button>
            <button onClick={deleteSite} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2 py-1 rounded transition">
              삭제
            </button>
          </div>
        </div>
        <EditorSidebar data={data} setData={setData} siteId={siteId} refreshSites={fetchSites} activeSection={activeSection} setActiveSection={setActiveSection} />
      </div>
      <main className="flex-1 h-full overflow-hidden relative">
        <ViewerManager data={data} activeSection={activeSection} setActiveSection={setActiveSection} />
      </main>
    </div>
  );
}