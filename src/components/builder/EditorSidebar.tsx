'use client';

import React, { useState } from 'react';
import { B2BTemplateData, TemplateType } from '@/types/template';
import { supabase } from '@/lib/supabase/client';
import { compressImage } from '@/utils/compressImage';
import { TemplateSelector } from './TemplateSelector';

interface EditorSidebarProps {
  data: B2BTemplateData;
  setData: React.Dispatch<React.SetStateAction<B2BTemplateData>>;
  siteId: string | null;
  setIsPaymentOpen?: (open: boolean) => void;
  refreshSites?: () => void;
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
export default function EditorSidebar({ data, setData, siteId, setIsPaymentOpen, refreshSites }: EditorSidebarProps) {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleTemplateChange = (type: TemplateType) => {
    setData(prev => ({ ...prev, templateType: type }));
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
      <div className="p-4 border-b border-slate-200 flex flex-col gap-4 bg-slate-50 shrink-0">
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
        <TemplateSelector 
          currentType={data.templateType || 'one-page'} 
          onTypeChange={handleTemplateChange} 
        />
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-7 text-sm pb-24">
        <div className="space-y-7">
          <section className="space-y-3 pb-4 border-b border-slate-100">
            <label className="text-xs font-bold text-slate-500 uppercase">브랜드 테마 컬러</label>
            <div className="flex items-center gap-3">
              <input type="color" value={data.themeColor} onChange={(e) => setData(prev => ({ ...prev, themeColor: e.target.value }))} className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer" />
              <input type="text" value={data.themeColor} onChange={(e) => setData(prev => ({ ...prev, themeColor: e.target.value }))} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500" />
            </div>
          </section>
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

        <div className="pt-4 border-t-2 border-slate-200 space-y-7">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 bg-sky-100 text-sky-700 text-[10px] font-bold rounded uppercase">
              {data.templateType || 'one-page'} 전용 설정
            </span>
          </div>

          {/* 1. 원페이지형 설정 */}
          {(data.templateType === 'one-page' || !data.templateType) && (
            <div className="space-y-7">
              <section className="space-y-3 pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">히어로 영역</h3>
                <input type="text" value={data.hero.badge} onChange={(e) => setData(prev => ({ ...prev, hero: { ...prev.hero, badge: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" placeholder="배지 문구" />
                <textarea rows={2} value={data.hero.title} onChange={(e) => setData(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" placeholder="메인 타이틀" />
              </section>
            </div>
          )}

          {/* 2. 기업형 설정 */}
          {data.templateType === 'corporate' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <section className="space-y-3 pb-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-1 h-4 bg-sky-600 rounded-full"></span> 회사 소개
                </h3>
                <textarea rows={5} value={(data.specifics as any)?.about?.greeting || ''} onChange={(e) => setData(prev => ({ ...prev, specifics: { ...prev.specifics, about: { greeting: e.target.value } } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 outline-none" placeholder="인사말 입력" />
              </section>
              <section className="space-y-3 pb-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-1 h-4 bg-sky-600 rounded-full"></span> 사업 영역
                  </h3>
                  <button onClick={() => setData(prev => ({ ...prev, specifics: { ...prev.specifics, businessAreas: [...(prev.specifics as any).businessAreas || [], { title: '새 사업', description: '설명', image: 'https://via.placeholder.com/300' }] } }))} className="text-[10px] font-bold text-sky-600">+ 추가</button>
                </div>
                <div className="space-y-4">
                  {(data.specifics as any)?.businessAreas?.map((area: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group">
                      <button onClick={() => setData(prev => ({ ...prev, specifics: { ...prev.specifics, businessAreas: (prev.specifics as any).businessAreas.filter((_, i) => i !== idx) } }))} className="absolute top-2 right-2 text-slate-300 hover:text-red-500">✕</button>
                      <input type="text" value={area.title} onChange={(e) => { const newA = [...(data.specifics as any).businessAreas]; newA[idx].title = e.target.value; setData(prev => ({ ...prev, specifics: { ...prev.specifics, businessAreas: newA } })); }} className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-xs font-bold" />
                      <textarea rows={2} value={area.description} onChange={(e) => { const newA = [...(data.specifics as any).businessAreas]; newA[idx].description = e.target.value; setData(prev => ({ ...prev, specifics: { ...prev.specifics, businessAreas: newA } })); }} className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-[11px]" />
                    </div>
                  ))}
                </div>
              </section>
              <section className="space-y-3 pb-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-1 h-4 bg-sky-600 rounded-full"></span> 기업 연혁
                  </h3>
                  <button onClick={() => setData(prev => ({ ...prev, specifics: { ...prev.specifics, history: [...(prev.specifics as any).history || [], { year: '2026', title: '성과', content: '내용' }] } }))} className="text-[10px] font-bold text-sky-600">+ 추가</button>
                </div>
                <div className="space-y-3">
                  {(data.specifics as any)?.history?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-2 items-start p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <input type="text" value={item.year} onChange={(e) => { const newH = [...(data.specifics as any).history]; newH[idx].year = e.target.value; setData(prev => ({ ...prev, specifics: { ...prev.specifics, history: newH } })); }} className="w-16 px-1 py-1 border border-slate-200 rounded bg-white text-xs font-bold text-center" />
                      <div className="flex-1 space-y-1">
                        <input type="text" value={item.title} onChange={(e) => { const newH = [...(data.specifics as any).history]; newH[idx].title = e.target.value; setData(prev => ({ ...prev, specifics: { ...prev.specifics, history: newH } })); }} className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-xs" />
                        <input type="text" value={item.content} onChange={(e) => { const newH = [...(data.specifics as any).history]; newH[idx].content = e.target.value; setData(prev => ({ ...prev, specifics: { ...prev.specifics, history: newH } })); }} className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-[11px] text-slate-500" />
                      </div>
                      <button onClick={() => setData(prev => ({ ...prev, specifics: { ...prev.specifics, history: (prev.specifics as any).history.filter((_, i) => i !== idx) } }))} className="text-slate-300 hover:text-red-500 p-1">✕</button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* 3. 렌탈/쇼핑몰 설정 */}
          {data.templateType === 'rental-shop' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <section className="space-y-3 pb-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-1 h-4 bg-sky-600 rounded-full"></span> 상품 관리
                  </h3>
                  <button onClick={() => setData(prev => ({ ...prev, specifics: { ...prev.specifics, products: [...(prev.specifics as any).products || [], { name: '상품', price: '0', rentalPeriod: '월', image: 'https://via.placeholder.com/300' }] } }))} className="text-[10px] font-bold text-sky-600">+ 추가</button>
                </div>
                <div className="space-y-4">
                  {(data.specifics as any)?.products?.map((prod: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group">
                      <button onClick={() => setData(prev => ({ ...prev, specifics: { ...prev.specifics, products: (prev.specifics as any).products.filter((_, i) => i !== idx) } }))} className="absolute top-2 right-2 text-slate-300 hover:text-red-500">✕</button>
                      <input type="text" value={prod.name} onChange={(e) => { const newP = [...(data.specifics as any).products]; newP[idx].name = e.target.value; setData(prev => ({ ...prev, specifics: { ...prev.specifics, products: newP } })); }} className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-xs font-bold" />
                      <div className="flex gap-2">
                        <input type="text" value={prod.price} onChange={(e) => { const newP = [...(data.specifics as any).products]; newP[idx].price = e.target.value; setData(prev => ({ ...prev, specifics: { ...prev.specifics, products: newP } })); }} className="w-1/2 px-2 py-1 border border-slate-200 rounded bg-white text-xs" />
                        <input type="text" value={prod.rentalPeriod} onChange={(e) => { const newP = [...(data.specifics as any).products]; newP[idx].rentalPeriod = e.target.value; setData(prev => ({ ...prev, specifics: { ...prev.specifics, products: newP } })); }} className="w-1/2 px-2 py-1 border border-slate-200 rounded bg-white text-xs" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
          {/* 4. 포트폴리오 설정 */}
          {data.templateType === 'portfolio' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <section className="space-y-3 pb-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-1 h-4 bg-sky-600 rounded-full"></span> 갤러리 관리
                </h3>
                <button onClick={() => setData(prev => ({ ...prev, specifics: { ...prev.specifics, gallery: [...(prev.specifics as any).gallery || [], { title: '작품', category: '웹', date: '2026', thumbnail: 'https://via.placeholder.com/400' }] } }))} className="text-[10px] font-bold text-sky-600 mb-3 block">+ 추가</button>
                <div className="space-y-4">
                  {(data.specifics as any)?.gallery?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group">
                      <button onClick={() => setData(prev => ({ ...prev, specifics: { ...prev.specifics, gallery: (prev.specifics as any).gallery.filter((_, i) => i !== idx) } }))} className="absolute top-2 right-2 text-slate-300 hover:text-red-500">✕</button>
                      <input type="text" value={item.title} onChange={(e) => { const newG = [...(data.specifics as any).gallery]; newG[idx].title = e.target.value; setData(prev => ({ ...prev, specifics: { ...prev.specifics, gallery: newG } })); }} className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-xs font-bold" />
                      <div className="flex gap-2">
                        <input type="text" value={item.category} onChange={(e) => { const newG = [...(data.specifics as any).gallery]; newG[idx].category = e.target.value; setData(prev => ({ ...prev, specifics: { ...prev.specifics, gallery: newG } })); }} className="w-1/2 px-2 py-1 border border-slate-200 rounded bg-white text-[11px]" />
                        <input type="text" value={item.date} onChange={(e) => { const newG = [...(data.specifics as any).gallery]; newG[idx].date = e.target.value; setData(prev => ({ ...prev, specifics: { ...prev.specifics, gallery: newG } })); }} className="w-1/2 px-2 py-1 border border-slate-200 rounded bg-white text-[11px]" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* 5. 공통 기본 설정 */}
          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-slate-400 rounded-full"></span> 기본 설정
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">사이트 제목</label>
                <input type="text" value={data.company.name} onChange={(e) => setData(prev => ({ ...prev, company: { ...prev.company, name: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
}