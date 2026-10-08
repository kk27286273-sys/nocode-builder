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
  activeSection: string;
  setActiveSection: (section: any) => void;
}

export default function EditorSidebar({ data, setData, siteId, refreshSites, activeSection, setActiveSection }: EditorSidebarProps) {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

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
      alert('업로드 완료!');
    } catch (err: any) { 
      alert('업로드 실패: ' + err.message); 
    } finally { 
      setUploading(prev => ({ ...prev, [key]: false })); 
    }
  };

  return (
    <div className="w-full flex flex-col bg-white">
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
            
            {/* 메인 히어로 설정 */}
            <div id="edit-section-main" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">메인 비주얼 설정</h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">메인 화면</span>
                  <button onClick={() => setActiveSection('main')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">상단 배지</label>
                    <input type="text" value={data.hero?.badge || ''} onChange={(e) => setData(prev => ({ ...prev, hero: { ...prev.hero, badge: e.target.value } }))} className="w-full px-3 py-2 border rounded-lg text-xs" placeholder="예: OFFICIAL" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">메인 타이틀</label>
                    <textarea rows={2} value={data.hero?.title || ''} onChange={(e) => setData(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))} className="w-full px-3 py-2 border rounded-lg text-xs" placeholder="메인 타이틀 입력" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">서브 타이틀</label>
                    <textarea rows={2} value={data.hero?.subtitle || ''} onChange={(e) => setData(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))} className="w-full px-3 py-2 border rounded-lg text-xs" placeholder="서브 타이틀 입력" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">배경 이미지</label>
                    <input type="file" onChange={(e) => handleImageUpload(e, (url) => setData(prev => ({ ...prev, hero: { ...prev.hero, mediaUrl: url } })), 'hero')} className="text-xs" />
                  </div>
                </div>
              </div>
            </div>

            {/* SOL(사업 소개) 에디터 */}
            <div id="edit-section-sol" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">사업 영역 (SOL 페이지)</h3>
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-xs font-bold text-slate-700">솔루션 리스트 관리</span>
                <button onClick={() => setActiveSection('sol')} className="text-[10px] text-blue-600 underline">SOL 페이지 미리보기</button>
              </div>
              <div className="space-y-4">
                {(data.solutions || []).map((sol, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-3 relative group hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-blue-600">솔루션 #{idx + 1}</span>
                      <button onClick={() => setData(prev => ({ ...prev, solutions: prev.solutions.filter((_, i) => i !== idx) }))} className="text-slate-400 hover:text-red-500 text-xs">삭제</button>
                    </div>
                    <input type="text" value={sol.title} onChange={(e) => { const next = [...data.solutions]; next[idx].title = e.target.value; setData(prev => ({ ...prev, solutions: next })); }} className="w-full p-2 border rounded text-xs font-bold" placeholder="솔루션 제목" />
                    <input type="text" value={sol.category} onChange={(e) => { const next = [...data.solutions]; next[idx].category = e.target.value; setData(prev => ({ ...prev, solutions: next })); }} className="w-full p-2 border rounded text-xs" placeholder="카테고리" />
                    <textarea rows={3} value={sol.description} onChange={(e) => { const next = [...data.solutions]; next[idx].description = e.target.value; setData(prev => ({ ...prev, solutions: next })); }} className="w-full p-2 border rounded text-xs" placeholder="상세 설명 입력" />
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] text-slate-500 shrink-0">대표 이미지</label>
                      <input type="file" onChange={(e) => handleImageUpload(e, (url) => { const next = [...data.solutions]; next[idx].image = url; setData(prev => ({ ...prev, solutions: next })); }, `sol-${idx}`)} className="text-[10px] flex-1" />
                    </div>
                  </div>
                ))}
                <button onClick={() => setData(prev => ({ ...prev, solutions: [...(prev.solutions || []), { title: '신규 솔루션', category: '분야', description: '설명을 입력하세요', image: '', detailedFeatures: [] }] }))} className="w-full py-3 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-md">+ 새로운 솔루션 추가</button>
              </div>
            </div>

            {/* 회사 소개 섹션 */}
            <div id="edit-section-company" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">회사 소개</h3>
              <div id="edit-section-ceo" className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">CEO 인사말</span>
                  <button onClick={() => setActiveSection('ceo')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
<input 
  type="text" 
  value={data.corporateInfo?.ceoGreeting?.title || ''} 
  onChange={(e) => setData(prev => ({ 
    ...prev, 
    corporateInfo: { 
      ...(prev.corporateInfo || {}), 
      ceoGreeting: { 
        ...(prev.corporateInfo?.ceoGreeting || {}), 
        title: e.target.value 
      } 
    } 
  }))} 
  className="w-full p-2 border rounded text-xs" 
  placeholder="인사말 제목" 
/>
<textarea 
  rows={4} 
  value={data.corporateInfo?.ceoGreeting?.content || ''} 
  onChange={(e) => setData(prev => ({ 
    ...prev, 
    corporateInfo: { 
      ...(prev.corporateInfo || {}), 
      ceoGreeting: { 
        ...(prev.corporateInfo?.ceoGreeting || {}), 
        content: e.target.value 
      } 
    } 
  }))} 
  className="w-full p-2 border rounded text-xs" 
  placeholder="인사말 본문" 
/>
<input 
  type="file" 
  onChange={(e) => handleImageUpload(e, (url) => setData(prev => ({ 
    ...prev, 
    corporateInfo: { 
      ...(prev.corporateInfo || {}), 
      ceoGreeting: { 
        ...(prev.corporateInfo?.ceoGreeting || {}), 
        image: url 
      } 
    } 
  })), 'ceo')} 
  className="text-[10px]" 
/>
              </div>
              <div id="edit-section-mission" className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">미션 & 비전</span>
                  <button onClick={() => setActiveSection('mission')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <textarea rows={3} value={data.corporateInfo?.missionVision?.mission || ''} onChange={(e) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, missionVision: { ...prev.corporateInfo.missionVision, mission: e.target.value } } }))} className="w-full p-2 border rounded text-xs" placeholder="미션 및 비전 내용 입력" />
              </div>
              <div id="edit-section-org" className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">조직도</span>
                  <button onClick={() => setActiveSection('org')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <input type="file" onChange={(e) => handleImageUpload(e, (url) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, orgChart: url } })), 'org')} className="text-[10px]" />
              </div>
              <div id="edit-section-ci" className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">CI 소개</span>
                  <button onClick={() => setActiveSection('ci')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <input type="file" onChange={(e) => handleImageUpload(e, (url) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, ciImage: url } })), 'ci')} className="text-[10px]" />
                <textarea rows={2} value={(data.corporateInfo as any)?.ciDescription || ''} onChange={(e) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, ciDescription: e.target.value } }))} className="w-full p-2 border rounded text-xs" placeholder="CI 의미 설명" />
              </div>
              <div id="edit-section-location" className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">오시는 길</span>
                  <button onClick={() => setActiveSection('location')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <input type="text" value={data.corporateInfo?.location?.headOffice?.address || ''} onChange={(e) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, location: { ...prev.corporateInfo.location, headOffice: { address: e.target.value } } } }))} className="w-full p-2 border rounded text-xs" placeholder="본사 주소 입력" />
              </div>
            </div>

            <div id="edit-section-pr" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">홍보 센터</h3>
              <div className="grid grid-cols-2 gap-4">
                <div id="edit-section-news" className="p-4 bg-slate-50 rounded-xl border space-y-3">
                  <span className="text-xs font-bold block">회사 소식</span>
                  <textarea rows={3} value={(data as any).newsContent || ''} onChange={(e) => setData(prev => ({ ...prev, newsContent: e.target.value }))} className="w-full p-2 border rounded text-xs" />
                  <button onClick={() => setActiveSection('news')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <div id="edit-section-video" className="p-4 bg-slate-50 rounded-xl border space-y-3">
                  <span className="text-xs font-bold block">홍보 영상</span>
                  <input type="text" value={(data as any).videoUrl || ''} onChange={(e) => setData(prev => ({ ...prev, videoUrl: e.target.value }))} className="w-full p-2 border rounded text-xs" />
                  <button onClick={() => setActiveSection('video')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
              </div>
            </div>

            <div id="edit-section-talent" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">인재경영</h3>
              <div className="grid grid-cols-2 gap-4">
                <div id="edit-section-talent-val" className="p-4 bg-slate-50 rounded-xl border space-y-3">
                  <span className="text-xs font-bold block">인재상</span>
                  <textarea rows={3} value={(data as any).talentValue || ''} onChange={(e) => setData(prev => ({ ...prev, talentValue: e.target.value }))} className="w-full p-2 border rounded text-xs" />
                  <button onClick={() => setActiveSection('talent')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <div id="edit-section-benefit" className="p-4 bg-slate-50 rounded-xl border space-y-3">
                  <span className="text-xs font-bold block">복리후생</span>
                  <textarea rows={3} value={(data as any).benefitInfo || ''} onChange={(e) => setData(prev => ({ ...prev, benefitInfo: e.target.value }))} className="w-full p-2 border rounded text-xs" />
                  <button onClick={() => setActiveSection('benefit')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
              </div>
            </div>

            {/* CS/문의하기 설정 강화 */}
            <div id="edit-section-cs" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">고객센터 (CS 페이지)</h3>
              <div className="p-4 bg-slate-50 rounded-xl border space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">문의 채널 관리</span>
                  <button onClick={() => setActiveSection('cs')} className="text-[10px] text-blue-600 underline">CS 페이지 미리보기</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">대표 문의 전화번호</label>
                    <input type="text" value={data.supportPhone || ''} onChange={(e) => setData(prev => ({ ...prev, supportPhone: e.target.value }))} className="w-full p-2 border rounded text-xs" placeholder="예: 02-123-4567" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">문의 안내 문구</label>
                    <textarea rows={3} value={(data as any).csGuide || ''} onChange={(e) => setData(prev => ({ ...prev, csGuide: e.target.value }))} className="w-full p-2 border rounded text-xs" placeholder="문의 방법이나 안내 사항을 입력하세요" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">카카오톡 상담 링크 (URL)</label>
                    <input type="text" value={(data as any).kakaoLink || ''} onChange={(e) => setData(prev => ({ ...prev, kakaoLink: e.target.value }))} className="w-full p-2 border rounded text-xs" placeholder="https://pf.kakao.com/..." />
                  </div>
                </div>
              </div>
            </div>

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
    </div>
  );
}