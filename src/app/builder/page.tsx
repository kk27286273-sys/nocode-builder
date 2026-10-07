'use client';

import React, { useState, useEffect, useCallback } from 'react';
import EditorSidebar from '@/components/builder/EditorSidebar';
import ViewerManager from '@/components/builder/ViewerManager';
import { defaultB2BTemplateData, B2BTemplateData } from '@/data/templates';
import { supabase } from '@/lib/supabase/client';

const ADMIN_PASSWORD = 'Kk@72862';

export default function BuilderPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [data, setData] = useState<B2BTemplateData>(defaultB2BTemplateData);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [sitesList, setSitesList] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🚩 [핵심] 뷰어-에디터 상태 공유를 위한 전역 섹션 관리
  const [activeSection, setActiveSection] = useState<'main' | 'ceo' | 'mission' | 'org' | 'ci' | 'location' | 'sol' | 'news' | 'video' | 'talent' | 'benefit' | 'cs'>('main');

  const fetchSites = useCallback(async () => {
    try {
      const { data: sites, error } = await supabase
        .from('sites')
        .select('id, name')
        .order('updated_at', { ascending: false });
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
      const { data: siteData, error } = await supabase.from('sites').select('content').eq('id', id).single();
      if (error) throw error;
      if (siteData && siteData.content) {
        setData(siteData.content);
        setSiteId(id);
        localStorage.setItem('current_site_id', id);
      } else {
        setData(defaultB2BTemplateData);
        setSiteId(id);
      }
    } catch (err: any) {
      alert('데이터 로드 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSite = async () => {
    if (!siteId || !confirm(`정말로 삭제하시겠습니까?`)) return;
    setIsLoading(true);
    try {
      await supabase.from('sites').delete().eq('id', siteId);
      alert('삭제 완료');
      fetchSites();
      setData(defaultB2BTemplateData);
    } catch (err: any) {
      alert('삭제 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('is_builder_admin', 'true');
      setIsAuthenticated(true);
    } else {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
    }
  };

  const handlePublish = async () => {
    if (!siteId) return alert("사이트 ID가 없습니다.");
    const newWindow = window.open('about:blank', '_blank');
    try {
      setIsLoading(true);
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: siteId, name: data.company?.name || '이름 없는 사이트', content: data }),
      });
      if (!res.ok) throw new Error('발행 오류');
      alert('발행 성공!');
      newWindow.location.href = `/p/${siteId}`;
    } catch (error: any) {
      alert(`발행 실패: ${error.message}`);
      newWindow?.close();
    } finally { setIsLoading(false); }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl space-y-4">
          <div className="text-center">
            <h1 className="text-lg font-bold text-slate-800">관리자 인증</h1>
          </div>
          <input type="password" placeholder="비밀번호" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900" autoFocus />
          {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
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
            <label className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Site</label>
            <select value={siteId || ''} onChange={(e) => loadSiteData(e.target.value)} className="bg-slate-700 text-white text-xs px-2 py-1 rounded border border-slate-600 outline-none max-w-full">
              <option value="">사이트 선택</option>
              {sitesList.map((site) => <option key={site.id} value={site.id}>{site.name || site.id}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            {isLoading && <span className="text-[10px] text-sky-400 animate-pulse">...</span>}
            {/* 🚩 [수정] 뒤로가기 버튼을 빌더 헤더에 완전히 고정 (뷰어를 가리지 않음) */}
            {activeSection !== 'main' && (
              <button onClick={() => setActiveSection('main')} className="px-3 py-1.5 bg-white text-slate-900 text-[11px] font-extrabold rounded-md hover:bg-slate-100 transition border border-slate-300 shadow-sm">
                ← 메인으로 돌아가기
              </button>
            )}
            <button onClick={handlePublish} disabled={isLoading} style={{ backgroundColor: data.themeColor }} className="px-4 py-2 text-xs font-bold text-white rounded-lg shadow disabled:opacity-50 hover:opacity-90 transition">
              {isLoading ? '처리 중...' : '사이트 발행'}
            </button>
            <button onClick={deleteSite} disabled={!siteId || isLoading} className="bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white text-[10px] font-bold px-2 py-1 rounded transition">삭제</button>
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