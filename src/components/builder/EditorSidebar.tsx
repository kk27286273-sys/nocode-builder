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

  const updateFontSize = (section: string, field: string, size: number) => {
    setData(prev => ({
      ...prev,
      fontSizes: {
        ...prev.fontSizes,
        [`${section}_${field}`]: size
      }
    }));
  };

  return (
    <div className="w-full flex flex-col bg-white">
      <div className="p-4 border-b border-slate-200 flex flex-col gap-4 bg-slate-50 shrink-0">
        <div className="flex flex-col">
          <h2 className="text-sm font-extrabold text-slate-900">통합 웹 빌더 에디터</h2>
          <span className="text-[10px] text-slate-500">에이텍 스타일 정밀 제어 모드</span>
        </div>
        <TemplateSelector currentType={data.templateType || 'one-page'} onTypeChange={handleTemplateChange} />
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-10 text-sm custom-scrollbar">
        
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
            
            <div id="edit-section-main" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">메인 페이지</h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">메인 비주얼</span>
                  <button onClick={() => setActiveSection('main')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">상단 배지</label>
                    <input type="text" value={data.hero?.badge || ''} onChange={(e) => setData(prev => ({ ...prev, hero: { ...prev.hero, badge: e.target.value } }))} className="w-full px-3 py-2 border rounded-lg text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 block mb-1">메인 타이틀</label>
                    <div className="flex gap-2">
                      <textarea rows={2} value={data.hero?.title || ''} onChange={(e) => setData(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))} className="flex-1 px-3 py-2 border rounded-lg text-xs" />
                      <input type="number" value={(data as any).fontSizes?.heroTitle || 48} onChange={(e) => updateFontSize('hero', 'title', parseInt(e.target.value))} className="w-16 px-2 py-1 border rounded text-xs" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 block mb-1">서브 타이틀</label>
                    <div className="flex gap-2">
                      <textarea rows={2} value={data.hero?.subtitle || ''} onChange={(e) => setData(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))} className="flex-1 px-3 py-2 border rounded-lg text-xs" />
                      <input type="number" value={(data as any).fontSizes?.heroSubtitle || 18} onChange={(e) => updateFontSize('hero', 'subtitle', parseInt(e.target.value))} className="w-16 px-2 py-1 border rounded text-xs" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] text-slate-500 shrink-0">배경 이미지</label>
                    <input type="file" onChange={(e) => handleImageUpload(e, (url) => setData(prev => ({ ...prev, hero: { ...prev.hero, mediaUrl: url } })), 'hero')} className="text-[10px] flex-1" />
                  </div>
                </div>
              </div>
            </div>

            <div id="edit-section-about" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">회사소개</h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">CEO 인사말 & 비전</span>
                  <button onClick={() => setActiveSection('about')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 block mb-1">CEO 인사말 제목</label>
                    <div className="flex gap-2">
                      <input type="text" value={data.corporateInfo?.ceoGreeting?.title || ''} onChange={(e) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, ceoGreeting: { ...prev.corporateInfo?.ceoGreeting, title: e.target.value } } }))} className="flex-1 p-2 border rounded text-xs" />
                      <input type="number" value={(data as any).fontSizes?.ceoTitle || 32} onChange={(e) => updateFontSize('ceo', 'title', parseInt(e.target.value))} className="w-16 p-2 border rounded text-xs" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 block mb-1">CEO 인사말 본문</label>
                    <div className="flex gap-2">
                      <textarea rows={3} value={data.corporateInfo?.ceoGreeting?.content || ''} onChange={(e) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, ceoGreeting: { ...prev.corporateInfo?.ceoGreeting, content: e.target.value } } }))} className="flex-1 p-2 border rounded text-xs" />
                      <input type="number" value={(data as any).fontSizes?.ceoContent || 16} onChange={(e) => updateFontSize('ceo', 'content', parseInt(e.target.value))} className="w-16 p-2 border rounded text-xs" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] text-slate-500 shrink-0">CEO 이미지</label>
                    <input type="file" onChange={(e) => handleImageUpload(e, (url) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, ceoGreeting: { ...prev.corporateInfo?.ceoGreeting, image: url } } })), 'ceo')} className="text-[10px] flex-1" />
                  </div>
                  <hr className="border-slate-200" />
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 block">미션 & 비전</label>
                    <div className="space-y-2">
                      <textarea rows={2} value={data.corporateInfo?.missionVision?.mission || ''} onChange={(e) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, missionVision: { ...prev.corporateInfo.missionVision, mission: e.target.value } } }))} className="w-full p-2 border rounded text-xs" placeholder="미션 입력" />
                      <textarea rows={2} value={data.corporateInfo?.missionVision?.vision || ''} onChange={(e) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, missionVision: { ...prev.corporateInfo.missionVision, vision: e.target.value } } }))} className="w-full p-2 border rounded text-xs" placeholder="비전 입력" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="edit-section-sol_detail" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">사업소개 (솔루션)</h3>
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-xs font-bold text-slate-700">솔루션 리스트 관리</span>
                <button onClick={() => setActiveSection('sol_detail')} className="text-[10px] text-blue-600 underline">미리보기</button>
              </div>
              <div className="space-y-4">
                {(data.solutions || []).map((sol, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-3 relative group hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-blue-600">솔루션 #{idx + 1}</span>
                      <button onClick={() => setData(prev => ({ ...prev, solutions: prev.solutions.filter((_, i) => i !== idx) }))} className="text-slate-400 hover:text-red-500 text-xs">삭제</button>
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={sol.title} onChange={(e) => { const next = [...data.solutions]; next[idx].title = e.target.value; setData(prev => ({ ...prev, solutions: next })); }} className="flex-1 p-2 border rounded text-xs font-bold" placeholder="솔루션 제목" />
                      <input type="number" value={(data as any).fontSizes?.solTitle || 24} onChange={(e) => updateFontSize('sol', 'title', parseInt(e.target.value))} className="w-16 p-2 border rounded text-xs" />
                    </div>
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

            <div id="edit-section-esg" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">지속가능경영 (ESG)</h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">ESG 가치 설정</span>
                  <button onClick={() => setActiveSection('esg')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                {['environmental', 'social', 'governance'].map((key) => (
                  <div key={key} className="p-3 bg-white border rounded-lg space-y-3">
                    <span className="text-[10px] font-bold uppercase text-slate-400">{key}</span>
                    <div className="flex gap-2">
                      <input type="text" value={(data.corporateInfo?.esg as any)?.[key]?.title || ''} onChange={(e) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, esg: { ...prev.corporateInfo?.esg, [key]: { ...prev.corporateInfo?.esg?.[key], title: e.target.value } } } }))} className="flex-1 p-2 border rounded text-xs" />
                      <input type="number" value={(data as any).fontSizes?.[`${key}Title`] || 30} onChange={(e) => updateFontSize(key, 'title', parseInt(e.target.value))} className="w-16 p-2 border rounded text-xs" />
                    </div>
                    <textarea rows={2} value={(data.corporateInfo?.esg as any)?.[key]?.content || ''} onChange={(e) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, esg: { ...prev.corporateInfo?.esg, [key]: { ...prev.corporateInfo?.esg?.[key], content: e.target.value } } } }))} className="w-full p-2 border rounded text-xs" />
                    <input type="file" onChange={(e) => handleImageUpload(e, (url) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, esg: { ...prev.corporateInfo?.esg, [key]: { ...prev.corporateInfo?.esg?.[key], image: url } } } })), `esg-${key}`)} className="text-[10px]" />
                  </div>
                ))}
              </div>
            </div>

            <div id="edit-section-disclosure" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">공시정보</h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">인증서 및 보고서</span>
                  <button onClick={() => setActiveSection('disclosure')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-white border rounded-lg space-y-2">
                    <span className="text-[10px] font-bold block">인증서 관리</span>
                    {(data.corporateInfo?.disclosure?.certifications || []).map((cert, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input type="text" value={cert.name} onChange={(e) => { const next = [...data.corporateInfo.disclosure.certifications]; next[idx].name = e.target.value; setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, disclosure: { ...prev.corporateInfo.disclosure, certifications: next } } })); }} className="flex-1 p-1 border rounded text-[10px]" />
                        <input type="text" value={cert.date} onChange={(e) => { const next = [...data.corporateInfo.disclosure.certifications]; next[idx].date = e.target.value; setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, disclosure: { ...prev.corporateInfo.disclosure, certifications: next } } })); }} className="w-20 p-1 border rounded text-[10px]" />
                      </div>
                    ))}
                    <button onClick={() => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, disclosure: { ...prev.corporateInfo.disclosure, certifications: [...(prev.corporateInfo?.disclosure?.certifications || []), { name: '신규 인증서', image: '', date: '2024-00-00' }] } }))} className="text-[10px] text-blue-600 font-bold">+ 인증서 추가</button>
                  </div>
                  <div className="p-3 bg-white border rounded-lg space-y-2">
                    <span className="text-[10px] font-bold block">보고서 관리</span>
                    {(data.corporateInfo?.disclosure?.reports || []).map((rep, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input type="text" value={rep.title} onChange={(e) => { const next = [...data.corporateInfo.disclosure.reports]; next[idx].title = e.target.value; setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, disclosure: { ...prev.corporateInfo.disclosure, reports: next } } })); }} className="flex-1 p-1 border rounded text-[10px]" />
                        <input type="text" value={rep.date} onChange={(e) => { const next = [...data.corporateInfo.disclosure.reports]; next[idx].date = e.target.value; setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, disclosure: { ...prev.corporateInfo.disclosure, reports: next } } })); }} className="w-20 p-1 border rounded text-[10px]" />
                      </div>
                    ))}
                    <button onClick={() => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, disclosure: { ...prev.corporateInfo.disclosure, reports: [...(prev.corporateInfo?.disclosure?.reports || []), { title: '신규 보고서', date: '2024-00-00', link: '' }] } }))} className="text-[10px] text-blue-600 font-bold">+ 보고서 추가</button>
                  </div>
                </div>
              </div>
            </div>

            <div id="edit-section-pr" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">홍보센터</h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">뉴스 및 공지</span>
                  <button onClick={() => setActiveSection('pr')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-white border rounded-lg space-y-2">
                    <span className="text-[10px] font-bold block">뉴스 관리</span>
                    {(data.prCenter?.news || []).map((news, idx) => (
                      <div key={idx} className="p-2 border rounded-lg space-y-2 mb-3 bg-slate-50">
                        <input type="text" value={news.title} onChange={(e) => { const next = [...data.prCenter.news]; next[idx].title = e.target.value; setData(prev => ({ ...prev, prCenter: { ...prev.prCenter, news: next } })); }} className="w-full p-1 border rounded text-[10px] font-bold" />
                        <textarea rows={2} value={news.summary} onChange={(e) => { const next = [...data.prCenter.news]; next[idx].summary = e.target.value; setData(prev => ({ ...prev, prCenter: { ...prev.prCenter, news: next } })); }} className="w-full p-1 border rounded text-[10px]" />
                        <input type="file" onChange={(e) => handleImageUpload(e, (url) => { const next = [...data.prCenter.news]; next[idx].image = url; setData(prev => ({ ...prev, prCenter: { ...prev.prCenter, news: next } })); }, `pr-news-${idx}`)} className="text-[10px]" />
                      </div>
                    ))}
                    <button onClick={() => setData(prev => ({ ...prev, prCenter: { ...prev.prCenter, news: [...(prev.prCenter?.news || []), { title: '신규 뉴스', date: '2024-00-00', summary: '', image: '' }] } }))} className="text-[10px] text-blue-600 font-bold">+ 뉴스 추가</button>
                  </div>
                  <div className="p-3 bg-white border rounded-lg space-y-2">
                    <span className="text-[10px] font-bold block">공지사항 관리</span>
                    {(data.prCenter?.notice || []).map((notice, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input type="text" value={notice.title} onChange={(e) => { const next = [...data.prCenter.notice]; next[idx].title = e.target.value; setData(prev => ({ ...prev, prCenter: { ...prev.prCenter, notice: next } })); }} className="flex-1 p-1 border rounded text-[10px]" />
                        <input type="text" value={notice.date} onChange={(e) => { const next = [...data.prCenter.notice]; next[idx].date = e.target.value; setData(prev => ({ ...prev, prCenter: { ...prev.prCenter, notice: next } })); }} className="w-20 p-1 border rounded text-[10px]" />
                      </div>
                    ))}
                    <button onClick={() => setData(prev => ({ ...prev, prCenter: { ...prev.prCenter, notice: [...(prev.prCenter?.notice || []), { title: '신규 공지', date: '2024-00-00', isImportant: false }] } }))} className="text-[10px] text-blue-600 font-bold">+ 공지 추가</button>
                  </div>
                </div>
              </div>
            </div>

            <div id="edit-section-recruit" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">인재경영</h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">인재상 및 채용</span>
                  <button onClick={() => setActiveSection('recruit')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-500 block">우리가 찾는 인재상</label>
                    <textarea rows={3} value={data.recruit?.talentValue || ''} onChange={(e) => setData(prev => ({ ...prev, recruit: { ...prev.recruit, talentValue: e.target.value } }))} className="w-full p-2 border rounded text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-500 block">복리후생 및 혜택</label>
                    <textarea rows={3} value={data.recruit?.benefitInfo || ''} onChange={(e) => setData(prev => ({ ...prev, recruit: { ...prev.recruit, benefitInfo: e.target.value } }))} className="w-full p-2 border rounded text-xs" />
                  </div>
                  <div className="p-3 bg-white border rounded-lg space-y-2">
                    <span className="text-[10px] font-bold block">채용 공고 관리</span>
                    {(data.recruit?.openPositions || []).map((pos, idx) => (
                      <div key={idx} className="p-2 border rounded-lg space-y-2 mb-3 bg-slate-50">
                        <input type="text" value={pos.title} onChange={(e) => { const next = [...data.recruit.openPositions]; next[idx].title = e.target.value; setData(prev => ({ ...prev, recruit: { ...prev.recruit, openPositions: next } })); }} className="w-full p-1 border rounded text-[10px] font-bold" />
                        <div className="flex gap-2">
                          <input type="text" value={pos.department} onChange={(e) => { const next = [...data.recruit.openPositions]; next[idx].department = e.target.value; setData(prev => ({ ...prev, recruit: { ...prev.recruit, openPositions: next } })); }} className="flex-1 p-1 border rounded text-[10px]" placeholder="부서" />
                          <input type="text" value={pos.deadline} onChange={(e) => { const next = [...data.recruit.openPositions]; next[idx].deadline = e.target.value; setData(prev => ({ ...prev, recruit: { ...prev.recruit, openPositions: next } })); }} className="w-20 p-1 border rounded text-[10px]" placeholder="마감일" />
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setData(prev => ({ ...prev, recruit: { ...prev.recruit, openPositions: [...(prev.recruit?.openPositions || []), { title: '신규 공고', department: '부서', deadline: '2024-00-00', link: '' }] } }))} className="text-[10px] text-blue-600 font-bold">+ 공고 추가</button>
                  </div>
                </div>
              </div>
            </div>

            <div id="edit-section-cs" className="space-y-6">
              <h3 className="font-black text-blue-700 text-sm flex items-center gap-2 border-l-4 border-blue-700 pl-2">고객센터 (CS)</h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">CS 채널 및 FAQ</span>
                  <button onClick={() => setActiveSection('cs')} className="text-[10px] text-blue-600 underline">미리보기</button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-500 block">대표 전화번호</label>
                      <input type="text" value={data.supportPhone || ''} onChange={(e) => setData(prev => ({ ...prev, supportPhone: e.target.value }))} className="w-full p-2 border rounded text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-500 block">카카오톡 링크</label>
                      <input type="text" value={(data as any).kakaoLink || ''} onChange={(e) => setData(prev => ({ ...prev, kakaoLink: e.target.value }))} className="w-full p-2 border rounded text-xs" />
                    </div>
                  </div>
                  <div className="p-3 bg-white border rounded-lg space-y-2">
                    <span className="text-[10px] font-bold block">FAQ 관리</span>
                    {(data.csCenter?.faq || []).map((faq, idx) => (
                      <div key={idx} className="p-2 border rounded-lg space-y-2 mb-3 bg-slate-50">
                        <input type="text" value={faq.question} onChange={(e) => { const next = [...data.csCenter.faq]; next[idx].question = e.target.value; setData(prev => ({ ...prev, csCenter: { ...prev.csCenter, faq: next } })); }} className="w-full p-1 border rounded text-[10px] font-bold" />
                        <textarea rows={2} value={faq.answer} onChange={(e) => { const next = [...data.csCenter.faq]; next[idx].answer = e.target.value; setData(prev => ({ ...prev, csCenter: { ...prev.csCenter, faq: next } })); }} className="w-full p-1 border rounded text-[10px]" />
                      </div>
                    ))}
                    <button onClick={() => setData(prev => ({ ...prev, csCenter: { ...prev.csCenter, faq: [...(prev.csCenter?.faq || []), { question: '질문을 입력하세요', answer: '답변을 입력하세요' }] } }))} className="text-[10px] text-blue-600 font-bold">+ FAQ 추가</button>
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