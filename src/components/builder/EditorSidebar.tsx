'use client';

import React, { useState } from 'react';
import { B2BTemplateData, TemplateType } from '@/types/template'; // 타입 경로 확인 필요
import { supabase } from '@/lib/supabase/client';
import { compressImage } from '@/utils/compressImage';
import { TemplateSelector } from './TemplateSelector'; // 새로 만든 컴포넌트 임포트

interface EditorSidebarProps {
  data: B2BTemplateData;
  setData: React.Dispatch<React.SetStateAction<B2BTemplateData>>;
  siteId: string | null;
  setIsPaymentOpen?: (open: boolean) => void;
  refreshSites?: () => void;
}

// --- 내부 보조 컴포넌트 (FontSizeSlider) ---
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

export default function EditorSidebar({ data, setData, siteId, setIsPaymentOpen, refreshSites }: EditorSidebarProps) {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [isSaving, setIsSaving] = useState(false);

  // 템플릿 타입 변경 핸들러
  const handleTemplateChange = (type: TemplateType) => {
    setData(prev => ({ ...prev, templateType: type }));
    // 여기서 필요시 타입별 기본값(Default)을 넣어주는 로직을 추가할 수 있습니다.
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(prev => ({ ...prev, [key]: true }));
      let processedFile = file;
      if (typeof compressImage === 'function') {
        processedFile = await compressImage(file);
      }
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${key}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('site-images').upload(filePath, processedFile, { upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('site-images').getPublicUrl(filePath);
      callback(publicUrl);
      alert('이미지가 성공적으로 업로드되었습니다!');
    } catch (err: any) { 
      console.error("업로드 에러:", err);
      alert('업로드 실패: ' + err.message); 
    } finally { 
      setUploading(prev => ({ ...prev, [key]: false })); 
    }
  };

  const handlePublish = async () => {
    if (!siteId) return alert("사이트 ID가 없습니다.");
    const newWindow = window.open('about:blank', '_blank');
    if (!newWindow) return alert("팝업이 차단되었습니다.");
    try {
      setIsSaving(true);
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: siteId, name: data.company?.name || '이름 없는 사이트', content: data }),
      });
      if (!res.ok) throw new Error('발행 중 오류 발생');
      alert('발행 성공!');
      if (typeof refreshSites === 'function') refreshSites();
      newWindow.location.href = `/p/${siteId}`;
    } catch (error: any) {
      alert(`발행 실패: ${error.message}`);
      newWindow.close();
    } finally { setIsSaving(false); }
  };

  const updateFont = (key: any, val: number) => setData(prev => ({ ...prev, fontSizes: { ...prev.fontSizes, [key]: val } }));

  return (
    <aside className="w-[430px] h-full bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-xl">
      {/* 상단 헤더 */}
      <div className="p-4 border-b border-slate-200 flex flex-col gap-4 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-sm font-extrabold text-slate-900">통합 웹 빌더 에디터</h2>
            <span className="text-[10px] text-slate-500">실시간 통합 디자인 스튜디오</span>
          </div>
          <div className="flex items-center gap-2">
            {setIsPaymentOpen && (
              <button onClick={() => setIsPaymentOpen(true)} className="px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition">
                대행 결제
              </button>
            )}
            <button onClick={handlePublish} disabled={isSaving} style={{ backgroundColor: data.themeColor }} className="px-4 py-2 text-xs font-bold text-white rounded-lg shadow disabled:opacity-50 hover:opacity-90 transition">
              {isSaving ? '발행 중...' : '사이트 발행'}
            </button>
          </div>
        </div>

        {/* 템플릿 선택 드롭다운 추가 */}
        <TemplateSelector 
          currentType={data.templateType || 'one-page'} 
          onTypeChange={handleTemplateChange} 
        />
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-7 text-sm">
        
        {/* [구역 1] 모든 템플릿 공통 설정 */}
        <div className="space-y-7">
          <section className="space-y-3 pb-4 border-b border-slate-100">
            <label className="text-xs font-bold text-slate-500 uppercase">브랜드 테마 컬러</label>
            <div className="flex items-center gap-3">
              <input type="color" value={data.themeColor} onChange={(e) => setData(prev => ({ ...prev, themeColor: e.target.value }))} className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer" />
              <input type="text" value={data.themeColor} onChange={(e) => setData(prev => ({ ...prev, themeColor: e.target.value }))} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500" />
            </div>
          </section>

          <section className="space-y-3 pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">1. 기업 기본 정보</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">회사명</label>
                <input type="text" value={data.company.name} onChange={(e) => setData(prev => ({ ...prev, company: { ...prev.company, name: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500" />
              </div>
              <FontSizeSlider label="회사명 글자" value={data.fontSizes?.companyName} min={14} max={32} onChange={(val) => updateFont('companyName', val)} />
              {/* ... (대표번호, 로고, 대표이미지 등 기존 코드 동일하게 유지) ... */}
              <div>
                <label className="text-xs text-slate-500 block mb-1">대표번호</label>
                <input type="text" value={data.supportPhone} onChange={(e) => setData(prev => ({ ...prev, supportPhone: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500" />
              </div>
              <div className="mt-3">
                <label className="text-xs text-slate-500 block mb-1">로고 이미지</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setData(prev => ({ ...prev, company: { ...prev.company, logoUrl: url } })), 'logo')} className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-slate-100 file:text-slate-700 cursor-pointer" />
              </div>
            </div>
          </section>
        </div>

        {/* [구역 2] 템플릿별 전용 설정 (분기 처리) */}
        <div className="pt-4 border-t-2 border-slate-200 space-y-7">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 bg-sky-100 text-sky-700 text-[10px] font-bold rounded uppercase">
              {data.templateType || 'one-page'} 전용 설정
            </span>
          </div>

          {/* 1. 원페이지형(B2B 기본) 설정 */}
          {(data.templateType === 'one-page' || !data.templateType) && (
            <div className="space-y-7">
              {/* 기존의 히어로, 파트너, 실적, 솔루션, 후기, FAQ 섹션들을 여기에 그대로 배치 */}
              <section className="space-y-3 pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">히어로 영역</h3>
                {/* ... 기존 히어로 설정 코드 ... */}
                <input type="text" value={data.hero.badge} onChange={(e) => setData(prev => ({ ...prev, hero: { ...prev.hero, badge: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" placeholder="배지 문구" />
                <textarea rows={2} value={data.hero.title} onChange={(e) => setData(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" placeholder="메인 타이틀" />
              </section>
              {/* 실적, 솔루션, 후기 등 기존 섹션들 계속... */}
            </div>
          )}

{/* 2. 기업형 설정 (Corporate Settings) */}
{data.templateType === 'corporate' && (
  <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
    
    {/* [기업형] 회사 소개/인사말 */}
    <section className="space-y-3 pb-6 border-b border-slate-100">
      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
        <span className="w-1 h-4 bg-sky-600 rounded-full"></span> 회사 소개
      </h3>
      <div>
        <label className="text-xs text-slate-500 block mb-1">대표 인사말 / 비전</label>
        <textarea 
          rows={5} 
          value={(data.specifics as any)?.about?.greeting || ''} 
          onChange={(e) => setData(prev => ({ 
            ...prev, 
            specifics: { ...prev.specifics, about: { greeting: e.target.value } } 
          }))} 
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 outline-none" 
          placeholder="고객에게 전달할 신뢰감 있는 인사말을 입력하세요."
        />
      </div>
    </section>

    {/* [기업형] 사업 영역 관리 (추가/삭제/수정) */}
    <section className="space-y-3 pb-6 border-b border-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <span className="w-1 h-4 bg-sky-600 rounded-full"></span> 사업 영역
        </h3>
        <button 
          onClick={() => setData(prev => ({ 
            ...prev, 
            specifics: { 
              ...prev.specifics, 
              businessAreas: [...(prev.specifics as any).businessAreas || [], { title: '새 사업분야', description: '설명을 입력하세요', image: 'https://via.placeholder.com/300', details: ['상세내용 1'] }] 
            } 
          }))} 
          className="text-[10px] font-bold text-sky-600 hover:text-sky-700 transition"
        >
          + 항목 추가
        </button>
      </div>

      <div className="space-y-4">
        {(data.specifics as any)?.businessAreas?.map((area: any, idx: number) => (
          <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group">
            <button 
              onClick={() => setData(prev => ({ 
                ...prev, 
                specifics: { ...prev.specifics, businessAreas: (prev.specifics as any).businessAreas.filter((_, i) => i !== idx) } 
              }))} 
              className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition"
            >
              ✕
            </button>
            <input 
              type="text" 
              value={area.title} 
              onChange={(e) => {
                const newAreas = [...(data.specifics as any).businessAreas];
                newAreas[idx].title = e.target.value;
                setData(prev => ({ ...prev, specifics: { ...prev.specifics, businessAreas: newAreas } }));
              }} 
              className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-xs font-bold" 
            />
            <textarea 
              rows={2} 
              value={area.description} 
              onChange={(e) => {
                const newAreas = [...(data.specifics as any).businessAreas];
                newAreas[idx].description = e.target.value;
                setData(prev => ({ ...prev, specifics: { ...prev.specifics, businessAreas: newAreas } }));
              }} 
              className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-[11px]" 
            />
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-slate-400">이미지 URL</label>
              <input 
                type="text" 
                value={area.image} 
                onChange={(e) => {
                  const newAreas = [...(data.specifics as any).businessAreas];
                  newAreas[idx].image = e.target.value;
                  setData(prev => ({ ...prev, specifics: { ...prev.specifics, businessAreas: newAreas } }));
                }} 
                className="flex-1 px-2 py-1 border border-slate-200 rounded bg-white text-[10px]" 
              />
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* [기업형] 연혁 관리 */}
    <section className="space-y-3 pb-6 border-b border-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <span className="w-1 h-4 bg-sky-600 rounded-full"></span> 기업 연혁
        </h3>
        <button 
          onClick={() => setData(prev => ({ 
            ...prev, 
            specifics: { 
              ...prev.specifics, 
              history: [...(prev.specifics as any).history || [], { year: '2026', title: '신규 성과', content: '내용을 입력하세요' }] 
            } 
          }))} 
          className="text-[10px] font-bold text-sky-600 hover:text-sky-700 transition"
        >
          + 연도 추가
        </button>
      </div>

      <div className="space-y-3">
        {(data.specifics as any)?.history?.map((item: any, idx: number) => (
          <div key={idx} className="flex gap-2 items-start p-2 bg-slate-50 rounded-lg border border-slate-200">
            <input 
              type="text" 
              value={item.year} 
              onChange={(e) => {
                const newHist = [...(data.specifics as any).history];
                newHist[idx].year = e.target.value;
                setData(prev => ({ ...prev, specifics: { ...prev.specifics, history: newHist } }));
              }} 
              className="w-20 px-2 py-1 border border-slate-200 rounded bg-white text-xs font-bold text-center" 
            />
            <div className="flex-1 space-y-1">
              <input 
                type="text" 
                value={item.title} 
                onChange={(e) => {
                  const newHist = [...(data.specifics as any).history];
                  newHist[idx].title = e.target.value;
                  setData(prev => ({ ...prev, specifics: { ...prev.specifics, history: newHist } }));
                }} 
                className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-xs" 
              />
              <input 
                type="text" 
                value={item.content} 
                onChange={(e) => {
                  const newHist = [...(data.specifics as any).history];
                  newHist[idx].content = e.target.value;
                  setData(prev => ({ ...prev, specifics: { ...prev.specifics, history: newHist } }));
                }} 
                className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-[11px] text-slate-500" 
              />
            </div>
            <button 
              onClick={() => setData(prev => ({ 
                ...prev, 
                specifics: { ...prev.specifics, history: (prev.specifics as any).history.filter((_, i) => i !== idx) } 
              }))} 
              className="text-slate-300 hover:text-red-500 p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </section>
  </div>
)}

{/* 3. 렌탈/쇼핑몰 설정 (Rental Shop Settings) */}
{data.templateType === 'rental-shop' && (
  <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
    
    {/* [렌탈] 상품 리스트 관리 */}
    <section className="space-y-3 pb-6 border-b border-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <span className="w-1 h-4 bg-sky-600 rounded-full"></span> 판매/렌탈 상품
        </h3>
        <button 
          onClick={() => setData(prev => ({ 
            ...prev, 
            specifics: { 
              ...prev.specifics, 
              products: [...(prev.specifics as any).products || [], { name: '신규 상품', price: '0', rentalPeriod: '월', image: 'https://via.placeholder.com/300', tags: ['추천'] }] 
            } 
          }))} 
          className="text-[10px] font-bold text-sky-600 hover:text-sky-700 transition"
        >
          + 상품 추가
        </button>
      </div >

      <div className="space-y-4">
        {(data.specifics as any)?.products?.map((prod: any, idx: number) => (
          <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group">
            <button 
              onClick={() => setData(prev => ({ 
                ...prev, 
                specifics: { ...prev.specifics, products: (prev.specifics as any).products.filter((_, i) => i !== idx) } 
              }))} 
              className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition"
            >
              ✕
            </button>
            <input 
              type="text" 
              value={prod.name} 
              onChange={(e) => {
                const newProds = [...(data.specifics as any).products];
                newProds[idx].name = e.target.value;
                setData(prev => ({ ...prev, specifics: { ...prev.specifics, products: newProds } }));
              }} 
              className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-xs font-bold" 
            />
            <div className="flex gap-2">
              <input 
                type="text" 
                value={prod.price} 
                onChange={(e) => {
                  const newProds = [...(data.specifics as any).products];
                  newProds[idx].price = e.target.value;
                  setData(prev => ({ ...prev, specifics: { ...prev.specifics, products: newProds } }));
                }} 
                className="w-1/2 px-2 py-1 border border-slate-200 rounded bg-white text-xs" 
                placeholder="가격"
              />
              <input 
                type="text" 
                value={prod.rentalPeriod} 
                onChange={(e) => {
                  const newProds = [...(data.specifics as any).products];
                  newProds[idx].rentalPeriod = e.target.value;
                  setData(prev => ({ ...prev, specifics: { ...prev.specifics, products: newProds } }));
                }} 
                className="w-1/2 px-2 py-1 border border-slate-200 rounded bg-white text-xs" 
                placeholder="기간 (예: 월)"
              />
            </div >
            <input 
              type="text" 
              value={prod.image} 
              onChange={(e) => {
                const newProds = [...(data.specifics as any).products];
                newProds[idx].image = e.target.value;
                setData(prev => ({ ...prev, specifics: { ...prev.specifics, products: newProds } }));
              }} 
              className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-[10px]" 
              placeholder="이미지 URL"
            />
          </div >
        ))}
      </div >
    </section>

    {/* [렌탈] 신청 프로세스 단계 관리 */}
    <section className="space-y-3 pb-6 border-b border-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <span className="w-1 h-4 bg-sky-600 rounded-full"></span> 신청 프로세스
        </h3>
        <button 
          onClick={() => setData(prev => ({ 
            ...prev, 
            specifics: { 
              ...prev.specifics, 
              rentalProcess: [...(prev.specifics as any).rentalProcess || [], { step: '1', title: '상담신청', description: '전문가 상담' }] 
            } 
          }))} 
          className="text-[10px] font-bold text-sky-600 hover:text-sky-700 transition"
        >
          + 단계 추가
        </button>
      </div >

      <div className="space-y-3">
        {(data.specifics as any)?.rentalProcess?.map((step: any, idx: number) => (
          <div key={idx} className="flex gap-2 items-start p-2 bg-slate-50 rounded-lg border border-slate-200">
            <input 
              type="text" 
              value={step.step} 
              onChange={(e) => {
                const newSteps = [...(data.specifics as any).rentalProcess];
                newSteps[idx].step = e.target.value;
                setData(prev => ({ ...prev, specifics: { ...prev.specifics, rentalProcess: newSteps } }));
              }} 
              className="w-12 px-1 py-1 border border-slate-200 rounded bg-white text-xs font-bold text-center" 
            />
            <div className="flex-1 space-y-1">
              <input 
                type="text" 
                value={step.title} 
                onChange={(e) => {
                  const newSteps = [...(data.specifics as any).rentalProcess];
                  newSteps[idx].title = e.target.value;
                  setData(prev => ({ ...prev, specifics: { ...prev.specifics, rentalProcess: newSteps } }));
                }} 
                className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-xs" 
              />
              <input 
                type="text" 
                value={step.description} 
                onChange={(e) => {
                  const newSteps = [...(data.specifics as any).rentalProcess];
                  newSteps[idx].description = e.target.value;
                  setData(prev => ({ ...prev, specifics: { ...prev.specifics, rentalProcess: newSteps } }));
                }} 
                className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-[11px] text-slate-500" 
              />
            </div >
            <button 
              onClick={() => setData(prev => ({ 
                ...prev, 
                specifics: { ...prev.specifics, rentalProcess: (prev.specifics as any).rentalProcess.filter((_, i) => i !== idx) } 
              }))} 
              className="text-slate-300 hover:text-red-500 p-1"
            >
              ✕
            </button>
          </div >
        ))}
      </div >
    </section>
  </div >
)}

{/* 4. 포트폴리오 설정 (Portfolio Settings) */}
{data.templateType === 'portfolio' && (
  <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
    
    {/* [포트폴리오] 필터 태그 관리 */}
    <section className="space-y-3 pb-6 border-b border-slate-100">
      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
        <span className="w-1 h-4 bg-sky-600 rounded-full"></span> 카테고리 태그
      </h3>
      <div className="flex flex-wrap gap-2">
        {(data.specifics as any)?.filterTags?.map((tag: string, idx: number) => (
          <div key={idx} className="flex items-center gap-1 px-2 py-1 bg-slate-100 border border-slate-200 rounded-full">
            <input 
              type="text" 
              value={tag} 
              onChange={(e) => {
                const newTags = [...(data.specifics as any).filterTags];
                newTags[idx] = e.target.value;
                setData(prev => ({ ...prev, specifics: { ...prev.specifics, filterTags: newTags } }));
              }} 
              className="bg-transparent text-[11px] font-bold outline-none w-16" 
            />
            <button 
              onClick={() => setData(prev => ({ 
                ...prev, 
                specifics: { ...prev.specifics, filterTags: (prev.specifics as any).filterTags.filter((_, i) => i !== idx) } 
              }))} 
              className="text-slate-400 hover:text-red-500 text-[10px]"
            >
              ✕
            </button>
          </div >
        ))}
        <button 
          onClick={() => setData(prev => ({ 
            ...prev, 
            specifics: { 
              ...prev.specifics, 
              filterTags: [...(prev.specifics as any).filterTags || [], '신규태그'] 
            } 
          }))} 
          className="px-2 py-1 border border-dashed border-slate-300 rounded-full text-[10px] text-slate-500 hover:bg-slate-50"
        >
          + 태그 추가
        </button>
      </div >
    </section>

    {/* [포트폴리오] 작품 갤러리 관리 */}
    <section className="space-y-3 pb-6 border-b border-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <span className="w-1 h-4 bg-sky-600 rounded-full"></span> 작품 갤러리
        </h3>
        <button 
          onClick={() => setData(prev => ({ 
            ...prev, 
            specifics: { 
              ...prev.specifics, 
              gallery: [...(prev.specifics as any).gallery || [], { title: '작품 제목', category: '웹디자인', date: '2026', thumbnail: 'https://via.placeholder.com/400' }] 
            } 
          }))} 
          className="text-[10px] font-bold text-sky-600 hover:text-sky-700 transition"
        >
          + 작품 추가
        </button>
      </div >

      <div className="space-y-4">
        {(data.specifics as any)?.gallery?.map((item: any, idx: number) => (
          <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group">
            <button 
              onClick={() => setData(prev => ({ 
                ...prev, 
                specifics: { ...prev.specifics, gallery: (prev.specifics as any).gallery.filter((_, i) => i !== idx) } 
              }))} 
              className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition"
            >
              ✕
            </button>
            <input 
              type="text" 
              value={item.title} 
              onChange={(e) => {
                const newGal = [...(data.specifics as any).gallery];
                newGal[idx].title = e.target.value;
                setData(prev => ({ ...prev, specifics: { ...prev.specifics, gallery: newGal } }));
              }} 
              className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-xs font-bold" 
            />
            <div className="flex gap-2">
              <input 
                type="text" 
                value={item.category} 
                onChange={(e) => {
                  const newGal = [...(data.specifics as any).gallery];
                  newGal[idx].category = e.target.value;
                  setData(prev => ({ ...prev, specifics: { ...prev.specifics, gallery: newGal } }));
                }} 
                className="w-1/2 px-2 py-1 border border-slate-200 rounded bg-white text-[11px]" 
                placeholder="카테고리"
              />
              <input 
                type="text" 
                value={item.date} 
                onChange={(e) => {
                  const newGal = [...(data.specifics as any).gallery];
                  newGal[idx].date = e.target.value;
                  setData(prev => ({ ...prev, specifics: { ...prev.specifics, gallery: newGal } }));
                }} 
                className="w-1/2 px-2 py-1 border border-slate-200 rounded bg-white text-[11px]" 
                placeholder="날짜"
              />
            </div >
            <input 
              type="text" 
              value={item.thumbnail} 
              onChange={(e) => {
                const newGal = [...(data.specifics as any).gallery];
                newGal[idx].thumbnail = e.target.value;
                setData(prev => ({ ...prev, specifics: { ...prev.specifics, gallery: newGal } }));
              }} 
              className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-[10px]" 
              placeholder="썸네일 이미지 URL"
            />
          </div >
        ))}
      </div >
    </section>
  </div >
)}

        {/* [구역 3] 공통 하단 설정 (푸터) */}
        <section className="space-y-3 pt-6 pb-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">하단 푸터</h3>
          <div className="space-y-3">
            {['companyName', 'ownerName', 'businessNumber', 'address', 'contactEmail'].map((field) => (
              <div key={field}>
                <label className="text-xs text-slate-500 block mb-1">{field === 'companyName' ? '상호명' : field === 'ownerName' ? '대표자' : field === 'businessNumber' ? '사업자번호' : field === 'address' ? '주소' : '이메일'}</label>
                <input type="text" value={(data.footer as any)[field]} onChange={(e) => setData(prev => ({ ...prev, footer: { ...prev.footer, [field]: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}