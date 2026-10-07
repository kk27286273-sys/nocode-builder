'use client';

import React, { useState, useEffect } from 'react';
import { B2BTemplateData, TemplateType } from '@/types/template';
import { supabase } from '@/lib/supabase/client';
import { compressImage } from '@/utils/compressImage';
import { TemplateSelector } from './TemplateSelector';

interface EditorSidebarProps {
  data: B2BTemplateData;
  setData: React.Dispatch<React.SetStateAction<B2BTemplateData>>;
  siteId: string | null;
  refreshSites?: () => void;
  activeSection: string; // 🚩 추가
  setActiveSection: (section: any) => void; // 🚩 추가
}

function FontSizeSlider({ label, value, min = 12, max = 60, onChange }: { label: string; value?: number; min?: number; max?: number; onChange: (val: number) => void }) {
  const currentVal = value || min;
  return (
    <div className="flex items-center justify-between gap-2 mt-2 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
      <span className="text-xs text-slate-600 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} value={currentVal} onChange={(e) => onChange(Number(e.target.value))} className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600" />
        <span className="text-xs font-bold text-slate-800 w-9 text-right font-mono">{currentVal}px</span>
      </div>
    </div>
  );
}

export default function EditorSidebar({ data, setData, siteId, refreshSites, activeSection, setActiveSection }: EditorSidebarProps) {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

  // 🚩 [핵심] 뷰어에서 섹션 변경 시 에디터의 해당 위치로 자동 스크롤
  useEffect(() => {
    const element = document.getElementById(`edit-section-${activeSection}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeSection]);

  const handleTemplateChange = (type: TemplateType) => {
    setData(prev => ({ ...prev, templateType: type }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(prev => ({ ...prev, [key]: true }));
      let processedFile = file;
      if (typeof compressImage === 'function') processedFile = await compressImage(file);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${key}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('site-images').upload(filePath, processedFile, { upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('site-images').getPublicUrl(filePath);
      callback(publicUrl);
      alert('이미지가 성공적으로 업로드되었습니다!');
    } catch (err: any) { 
      alert('업로드 실패: ' + err.message); 
    } finally { 
      setUploading(prev => ({ ...prev, [key]: false })); 
    }
  };

  const updateFont = (key: any, val: number) => setData(prev => ({ ...prev, fontSizes: { ...prev.fontSizes, [key]: val } }));

  return (
    <aside className="w-[430px] h-screen bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-xl">
      <div className="p-4 border-b border-slate-200 flex flex-col gap-4 bg-slate-50 shrink-0">
        <div className="flex flex-col">
          <h2 className="text-sm font-extrabold text-slate-900">통합 웹 빌더 에디터</h2>
          <span className="text-[10px] text-slate-500">에이텍 스타일 완벽 복제 모드</span>
        </div>
        <TemplateSelector currentType={data.templateType || 'one-page'} onTypeChange={handleTemplateChange} />
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-10 text-sm custom-scrollbar">
        
        {/* 0. 브랜드 기본 설정 */}
        <section className="space-y-4 pb-6 border-b-2 border-slate-200">
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">Brand Identity</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">테마 컬러</label>
              <input type="color" value={data.themeColor} onChange={(e) => setData(prev => ({ ...prev, themeColor: e.target.value }))} className="w-full h-8 rounded border cursor-pointer" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">회사명</label>
              <input type="text" value={data.company.name} onChange={(e) => setData(prev => ({ ...prev, company: { ...prev.company, name: e.target.value } }))} className="w-full px-2 py-1 border rounded text-xs" />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">로고 이미지</label>
            <input type="file" onChange={(e) => handleImageUpload(e, (url) => setData(prev => ({ ...prev, company: { ...prev.company, logoUrl: url } })), 'logo')} className="text-xs" />
          </div>
        </section>

        {data.templateType === 'corporate' && (
          <div className="space-y-12">
            
            {/* 1. 회사 소개 섹션 */}
            <div id="edit-section-company" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">1. 회사 소개</h3>
              
              {/* 1-1. CEO 인사말 */}
              <div id="edit-section-ceo" className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">CEO 인사말</span>
                  <button onClick={() => setActiveSection('ceo')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <input type="text" value={data.corporateInfo?.ceoGreeting?.title || ''} onChange={(e) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, ceoGreeting: { ...prev.corporateInfo.ceoGreeting, title: e.target.value } } }))} className="w-full p-2 border rounded text-xs" placeholder="인사말 제목" />
                <textarea rows={4} value={data.corporateInfo?.ceoGreeting?.content || ''} onChange={(e) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, ceoGreeting: { ...prev.corporateInfo.ceoGreeting, content: e.target.value } } }))} className="w-full p-2 border rounded text-xs" placeholder="인사말 본문" />
                <input type="file" onChange={(e) => handleImageUpload(e, (url) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, ceoGreeting: { ...prev.corporateInfo.ceoGreeting, image: url } } })), 'ceo')} className="text-[10px]" />
              </div>

              {/* 1-2. 미션 & 비전 */}
              <div id="edit-section-mission" className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">미션 & 비전</span>
                  <button onClick={() => setActiveSection('mission')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <textarea rows={3} value={data.corporateInfo?.missionVision?.mission || ''} onChange={(e) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, missionVision: { ...prev.corporateInfo.missionVision, mission: e.target.value } } }))} className="w-full p-2 border rounded text-xs" placeholder="미션 및 비전 내용 입력" />
              </div>

              {/* 1-3. 조직도 */}
              <div id="edit-section-org" className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">조직도</span>
                  <button onClick={() => setActiveSection('org')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <input type="file" onChange={(e) => handleImageUpload(e, (url) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, orgChart: url } })), 'org')} className="text-[10px]" />
                <p className="text-[10px] text-slate-400">조직도 이미지를 업로드하세요.</p>
              </div>

              {/* 1-4. CI 소개 */}
              <div id="edit-section-ci" className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">CI 소개</span>
                  <button onClick={() => setActiveSection('ci')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <input type="file" onChange={(e) => handleImageUpload(e, (url) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, ciImage: url } })), 'ci')} className="text-[10px]" />
                <textarea rows={2} value={(data.corporateInfo as any)?.ciDescription || ''} onChange={(e) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, ciDescription: e.target.value } }))} className="w-full p-2 border rounded text-xs" placeholder="CI 의미 설명" />
              </div>

              {/* 1-5. 오시는 길 */}
              <div id="edit-section-location" className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">오시는 길</span>
                  <button onClick={() => setActiveSection('location')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <input type="text" value={data.corporateInfo?.location?.headOffice?.address || ''} onChange={(e) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, location: { ...prev.corporateInfo.location, headOffice: { address: e.target.value } } } }))} className="w-full p-2 border rounded text-xs" placeholder="본사 주소 입력" />
              </div>
            </div>

            {/* 2. 사업 소개 섹션 */}
            <div id="edit-section-business" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">2. 사업 소개</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-700">솔루션 관리</span>
                <button onClick={() => setActiveSection('sol')} className="text-[10px] text-blue-600 underline">미리보기</button>
              </div>
              <div className="space-y-4">
                {(data.solutions || []).map((sol, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border rounded-xl space-y-3 relative group">
                    <button onClick={() => setData(prev => ({ ...prev, solutions: prev.solutions.filter((_, i) => i !== idx) }))} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">✕</button>
                    <input type="text" value={sol.title} onChange={(e) => { const next = [...data.solutions]; next[idx].title = e.target.value; setData(prev => ({ ...prev, solutions: next })); }} className="w-full p-2 border rounded text-xs font-bold" placeholder="솔루션 제목" />
                    <input type="text" value={sol.category} onChange={(e) => { const next = [...data.solutions]; next[idx].category = e.target.value; setData(prev => ({ ...prev, solutions: next })); }} className="w-full p-2 border rounded text-xs" placeholder="카테고리" />
                    <textarea rows={2} value={sol.description} onChange={(e) => { const next = [...data.solutions]; next[idx].description = e.target.value; setData(prev => ({ ...prev, solutions: next })); }} className="w-full p-2 border rounded text-xs" placeholder="상세 설명" />
                    <input type="file" onChange={(e) => handleImageUpload(e, (url) => { const next = [...data.solutions]; next[idx].image = url; setData(prev => ({ ...prev, solutions: next })); }, `sol-${idx}`)} className="text-[10px]" />
                  </div>
                ))}
                <button onClick={() => setData(prev => ({ ...prev, solutions: [...(prev.solutions || []), { title: '신규 솔루션', category: '분야', description: '설명을 입력하세요', image: '', detailedFeatures: [] }] }))} className="w-full py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300 transition">+ 솔루션 추가</button>
              </div>
            </div>

            {/* 3. 홍보 센터 */}
            <div id="edit-section-pr" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">3. 홍보 센터</h3>
              <div className="grid grid-cols-2 gap-4">
                <div id="edit-section-news" className="p-4 bg-slate-50 rounded-xl border space-y-3">
                  <span className="text-xs font-bold block">회사 소식</span>
                  <textarea rows={3} value={(data as any).newsContent || ''} onChange={(e) => setData(prev => ({ ...prev, newsContent: e.target.value }))} className="w-full p-2 border rounded text-xs" placeholder="최신 소식 입력" />
                  <button onClick={() => setActiveSection('news')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <div id="edit-section-video" className="p-4 bg-slate-50 rounded-xl border space-y-3">
                  <span className="text-xs font-bold block">홍보 영상</span>
                  <input type="text" value={(data as any).videoUrl || ''} onChange={(e) => setData(prev => ({ ...prev, videoUrl: e.target.value }))} className="w-full p-2 border rounded text-xs" placeholder="유튜브 URL" />
                  <button onClick={() => setActiveSection('video')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
              </div>
            </div>

            {/* 4. 인재경영 */}
            <div id="edit-section-talent" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">4. 인재경영</h3>
              <div className="grid grid-cols-2 gap-4">
                <div id="edit-section-talent-val" className="p-4 bg-slate-50 rounded-xl border space-y-3">
                  <span className="text-xs font-bold block">인재상</span>
                  <textarea rows={3} value={(data as any).talentValue || ''} onChange={(e) => setData(prev => ({ ...prev, talentValue: e.target.value }))} className="w-full p-2 border rounded text-xs" placeholder="인재상 입력" />
                  <button onClick={() => setActiveSection('talent')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <div id="edit-section-benefit" className="p-4 bg-slate-50 rounded-xl border space-y-3">
                  <span className="text-xs font-bold block">복리후생</span>
                  <textarea rows={3} value={(data as any).benefitInfo || ''} onChange={(e) => setData(prev => ({ ...prev, benefitInfo: e.target.value }))} className="w-full p-2 border rounded text-xs" placeholder="복리후생 입력" />
                  <button onClick={() => setActiveSection('benefit')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
              </div>
            </div>

            {/* 5. 고객센터 */}
            <div id="edit-section-cs" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">5. 고객센터</h3>
              <div className="p-4 bg-slate-50 rounded-xl border space-y-3">
                <span className="text-xs font-bold block">문의하기 안내</span>
                <textarea rows={3} value={(data as any).csGuide || ''} onChange={(e) => setData(prev => ({ ...prev, csGuide: e.target.value }))} className="w-full p-2 border rounded text-xs" placeholder="문의 안내 문구" />
                <button onClick={() => setActiveSection('cs')} className="text-[10px] text-blue-600 underline">미리보기</button>
              </div>
            </div>

            {/* 푸터 정보 */}
            <div id="edit-section-footer" className="space-y-6">
              <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 border-l-4 border-slate-800 pl-2">푸터 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] text-slate-500 block">사업자 주소</label>
                  <input type="text" value={data.footer?.address || ''} onChange={(e) => setData(prev => ({ ...prev, footer: { ...prev.footer, address: e.target.value } }))} className="w-full p-2 border rounded text-xs" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-slate-500 block">대표자명</label>
                  <input type="text" value={data.footer?.ownerName || ''} onChange={(e) => setData(prev => ({ ...prev, footer: { ...prev.footer, ownerName: e.target.value } }))} className="w-full p-2 border rounded text-xs" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-slate-500 block">사업자 번호</label>
                  <input type="text" value={data.footer?.businessNumber || ''} onChange={(e) => setData(prev => ({ ...prev, footer: { ...prev.footer, businessNumber: e.target.value } }))} className="w-full p-2 border rounded text-xs" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-slate-500 block">공식 이메일</label>
                  <input type="text" value={data.footer?.contactEmail || ''} onChange={(e) => setData(prev => ({ ...prev, footer: { ...prev.footer, contactEmail: e.target.value } }))} className="w-full p-2 border rounded text-xs" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}