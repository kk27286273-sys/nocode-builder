'use client';

import React, { useState, useEffect, useCallback } from 'react'; // useCallback 추가
import EditorSidebar from '@/components/builder/EditorSidebar';
import LivePreview from '@/components/builder/LivePreview';
import { defaultTemplateData, B2BTemplateData } from '@/data/templates';
import { supabase } from '@/lib/supabase/client';

const ADMIN_PASSWORD = 'Kk@72862';

export default function BuilderPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [data, setData] = useState<B2BTemplateData>(defaultTemplateData);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [sitesList, setSitesList] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🔄 fetchSites를 useCallback으로 감싸서 자식에게 전달해도 무한루프 안 돌게 설정
  const fetchSites = useCallback(async () => {
    try {
      const { data: sites, error } = await supabase
        .from('sites')
        .select('id, name')
        .order('updated_at', { ascending: false }); // ✨ created_at -> updated_at으로 수정

      if (error) throw error;
      setSitesList(sites || []);
    } catch (err: any) {
      console.error('사이트 목록 로드 실패:', err.message);
    }
  }, []);

  useEffect(() => {
    const auth = sessionStorage.getItem('is_builder_admin');
    if (auth === 'true') setIsAuthenticated(true);

    const storedId = localStorage.getItem('current_site_id') || `site-${Date.now()}`;
    setSiteId(storedId);
    localStorage.setItem('current_site_id', storedId);

    fetchSites();
  }, [fetchSites]);

  const loadSiteData = async (id: string) => {
    setIsLoading(true);
    try {
      const { data: siteData, error } = await supabase
        .from('sites')
        .select('content')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (siteData && siteData.content) {
        setData(siteData.content);
        setSiteId(id);
        localStorage.setItem('current_site_id', id);
      } else {
        alert('해당 사이트에 저장된 데이터가 없습니다. 기본 템플릿으로 시작합니다.');
        setData(defaultTemplateData);
        setSiteId(id);
      }
    } catch (err: any) {
      console.error('데이터 로드 실패:', err.message);
      alert('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSite = async () => {
    if (!siteId) return alert("삭제할 사이트 ID가 없습니다.");
    if (!confirm(`정말로 [${siteId}] 사이트를 삭제하시겠습니까?\n삭제 후에는 복구가 불가능합니다.`)) return;

    setIsLoading(true);
    try {
      console.log('삭제 요청 시작 - SiteID:', siteId); // 🔍 로그 추가
      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', siteId);

      if (error) {
        console.error('Supabase 삭제 에러 상세:', error); // 🔍 상세 에러 로그
        throw error;
      }

      alert('사이트가 성공적으로 삭제되었습니다.');
      
      await fetchSites();
      setData(defaultTemplateData);
      const newId = `site-${Date.now()}`;
      setSiteId(newId);
      localStorage.setItem('current_site_id', newId);
    } catch (err: any) {
      console.error('삭제 최종 실패:', err);
      alert(`삭제 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('is_builder_admin', 'true');
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl space-y-4">
          <div className="text-center">
            <h1 className="text-lg font-bold text-slate-800">관리자 인증</h1>
            <p className="text-xs text-slate-500 mt-1">빌더 접근을 위해 비밀번호를 입력하세요.</p>
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
              autoFocus
            />
            {errorMsg && <p className="text-xs text-red-500 mt-1.5">{errorMsg}</p>}
          </div>
          <button type="submit" className="w-full py-2.5 bg-sky-600 text-white font-semibold text-sm rounded-lg hover:bg-sky-700 transition">확인</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      <div className="flex flex-col h-full w-[430px] shrink-0 border-r border-slate-200 bg-white shadow-xl">
        <div className="p-3 bg-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Site</label>
            <select 
              value={siteId || ''} 
              onChange={(e) => loadSiteData(e.target.value)}
              className="bg-slate-700 text-white text-xs px-2 py-1 rounded border border-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer max-w-full"
            >
              <option value="">사이트 선택</option>
              {sitesList.map((site) => (
                <option key={site.id} value={site.id}>{site.name || site.id}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            {isLoading && <span className="text-[10px] text-sky-400 animate-pulse">...</span>}
            <button 
              onClick={deleteSite}
              disabled={!siteId || isLoading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white text-[10px] font-bold px-2 py-1 rounded transition"
            >
              삭제
            </button>
          </div>
        </div>
        {/* 🌟 여기서 fetchSites 함수를 넘겨줍니다 */}
        <EditorSidebar data={data} setData={setData} siteId={siteId} refreshSites={fetchSites} />
      </div>
      
      <main className="flex-1 h-full overflow-hidden relative">
        <LivePreview data={data} />
      </main>
    </div>
  );
}