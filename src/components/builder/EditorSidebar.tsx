'use client';

import React, { useState } from 'react';
import { B2BTemplateData } from '@/data/templates';
import { supabase } from '@/lib/supabase/client';
import { compressImage } from '@/utils/compressImage';

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
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex flex-col">
          <h2 className="text-sm font-extrabold text-slate-900">B2B 웹 빌더 에디터</h2>
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

      <div className="flex-1 overflow-y-auto p-5 space-y-7 text-sm">
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
            <div className="mt-3">
              <label className="text-xs text-slate-500 block mb-1">현장 대표 이미지</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setData(prev => ({ ...prev, siteImage: url })), 'site-main')} className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-slate-100 file:text-slate-700 cursor-pointer" />
            </div>
          </div>
        </section>

        <section className="space-y-3 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">2. GNB 메뉴</h3>
            <button onClick={() => setData(prev => ({ ...prev, navigation: { ...prev.navigation, navLinks: [...(prev.navigation?.navLinks || []), { label: '새 메뉴', targetId: 'stats' }] } }))} className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition">+ 추가</button>
          </div>
          <div className="space-y-2">
            {data.navigation?.navLinks?.map((nav, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input type="text" value={nav.label} onChange={(e) => setData(prev => { const links = [...prev.navigation.navLinks]; links[idx].label = e.target.value; return { ...prev, navigation: { ...prev.navigation, navLinks: links } }; })} className="w-1/2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500" />
                <input type="text" value={nav.targetId} onChange={(e) => setData(prev => { const links = [...prev.navigation.navLinks]; links[idx].targetId = e.target.value; return { ...prev, navigation: { ...prev.navigation, navLinks: links } }; })} className="w-1/2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500" />
                <button onClick={() => setData(prev => ({ ...prev, navigation: { ...prev.navigation, navLinks: prev.navigation.navLinks.filter((_, i) => i !== idx) } }))} className="text-slate-400 hover:text-red-500 p-1 text-sm font-bold transition">✕</button>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">3. 히어로 영역</h3>
          <div className="space-y-3">
            <input type="text" value={data.hero.badge} onChange={(e) => setData(prev => ({ ...prev, hero: { ...prev.hero, badge: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="배지 문구" />
            <FontSizeSlider label="배지 크기" value={data.fontSizes?.heroBadge} min={12} max={20} onChange={(val) => updateFont('heroBadge', val)} />
            <textarea rows={2} value={data.hero.title} onChange={(e) => setData(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="메인 타이틀" />
            <FontSizeSlider label="타이틀 크기" value={data.fontSizes?.heroTitle} min={24} max={64} onChange={(val) => updateFont('heroTitle', val)} />
            <textarea rows={3} value={data.hero.subtitle} onChange={(e) => setData(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="서브 설명" />
            <FontSizeSlider label="서브 크기" value={data.fontSizes?.heroSubtitle} min={12} max={24} onChange={(val) => updateFont('heroSubtitle', val)} />
            <div className="mt-3">
              <label className="text-xs text-slate-500 block mb-1">히어로 사진</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setData(prev => ({ ...prev, hero: { ...prev.hero, mediaUrl: url, mediaType: 'image' } })), 'hero')} className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-slate-100 file:text-slate-700 cursor-pointer" />
            </div>
            <FontSizeSlider label="사진 높이" value={data.heroImageHeight} min={200} max={800} onChange={(val) => setData(prev => ({ ...prev, heroImageHeight: val }))} />
          </div>
        </section>

        <section className="space-y-3 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">4. 파트너 섹션</h3>
            <label className="text-xs flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={data.partnersSection.enabled} onChange={(e) => setData(prev => ({ ...prev, partnersSection: { ...prev.partnersSection, enabled: e.target.checked } }))} /> 활성화
            </label>
          </div>
          <input type="text" value={data.partnersSection.title} onChange={(e) => setData(prev => ({ ...prev, partnersSection: { ...prev.partnersSection, title: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500" />
          <FontSizeSlider label="문구 크기" value={data.fontSizes?.partnersTitle} min={12} max={24} onChange={(val) => updateFont('partnersTitle', val)} />
          <input type="text" value={data.partnersSection.partners.join(', ')} onChange={(e) => setData(prev => ({ ...prev, partnersSection: { ...prev.partnersSection, partners: e.target.value.split(',') } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" placeholder="쉼표로 구분" />
        </section>

        <section className="space-y-3 pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">5. 실적 지표</h3>
          <div className="space-y-2">
            {data.stats.map((stat, idx) => (
              <div key={idx} className="flex gap-2">
                <input type="text" value={stat.value} onChange={(e) => { setData(prev => { const s = [...prev.stats]; s[idx].value = e.target.value; return { ...prev, stats: s }; }); }} className="w-1/3 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold" />
                <input type="text" value={stat.label} onChange={(e) => { setData(prev => { const s = [...prev.stats]; s[idx].label = e.target.value; return { ...prev, stats: s }; }); }} className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">6. 핵심 솔루션</h3>
            <button onClick={() => setData(prev => ({ ...prev, solutions: [...prev.solutions, { title: '새 서비스', description: '내용 입력', image: '' }] }))} className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition">+ 추가</button>
          </div>
          <div className="space-y-3">
            <input type="text" value={data.solutionsSection?.title || ''} onChange={(e) => setData(prev => ({ ...prev, solutionsSection: { ...prev.solutionsSection!, title: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="섹션 제목" />
            <FontSizeSlider label="제목 크기" value={data.fontSizes?.sectionTitle} min={20} max={44} onChange={(val) => updateFont('sectionTitle', val)} />
<textarea rows={2} value={data.solutionsSection?.subtitle || ''} onChange={(e) => setData(prev => ({ ...prev, solutionsSection: { ...prev.solutionsSection!, subtitle: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="서브 문구" />

                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">항목 #{idx + 1}</span>
                  <button onClick={() => setData(prev => ({ ...prev, solutions: prev.solutions.filter((_, i) => i !== idx) }))} className="text-xs text-red-500 hover:underline">삭제</button>
                </div>
                <input type="text" value={sol.title} onChange={(e) => setData(prev => { const s = [...prev.solutions]; s[idx].title = e.target.value; return { ...prev, solutions: s }; })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold" />
                <textarea rows={2} value={sol.description} onChange={(e) => setData(prev => { const s = [...prev.solutions]; s[idx].description = e.target.value; return { ...prev, solutions: s }; })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setData(prev => { const s = [...prev.solutions]; s[idx].image = url; return { ...prev, solutions: s }; }), `sol-${idx}`)} className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-slate-200 file:text-slate-700 cursor-pointer" />
              </div>
            ))}
          </div>
        </section>

        {/* 7. 고객 후기 */}
        <section className="space-y-3 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">7. 고객 후지</h3>
            <button onClick={() => setData(prev => ({ ...prev, reviews: [...prev.reviews, { author: '이름', role: '직책', content: '내용' }] }))} className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition">+ 추가</button>
          </div>
          <textarea rows={2} value={data.reviewsSection?.title || ''} onChange={(e) => setData(prev => ({ ...prev, reviewsSection: { ...prev.reviewsSection!, title: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" placeholder="섹션 문구" />
          <div className="space-y-3 pt-2">
            {data.reviews.map((rev, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">후기 #{idx + 1}</span>
                  <button onClick={() => setData(prev => ({ ...prev, reviews: prev.reviews.filter((_, i) => i !== idx) }))} className="text-xs text-red-500 hover:underline">삭제</button>
                </div>
                <div className="flex gap-2">
                  <input type="text" value={rev.author} onChange={(e) => setData(prev => { const r = [...prev.reviews]; r[idx].author = e.target.value; return { ...prev, reviews: r }; })} className="w-1/2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs" placeholder="작성자" />
                  <input type="text" value={rev.role} onChange={(e) => setData(prev => { const r = [...prev.reviews]; r[idx].role = e.target.value; return { ...prev, reviews: r }; })} className="w-1/2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs" placeholder="직책" />
                </div>
                <textarea rows={2} value={rev.content} onChange={(e) => setData(prev => { const r = [...prev.reviews]; r[idx].content = e.target.value; return { ...prev, reviews: r }; })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" placeholder="내용" />
              </div>
            ))}
          </div>
        </section>

        {/* 8. FAQ */}
        <section className="space-y-3 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">8. FAQ</h3>
            <button onClick={() => setData(prev => ({ ...prev, faqs: [...prev.faqs, { question: '질문', answer: '답변' }] }))} className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition">+ 추가</button>
          </div>
          <FontSizeSlider label="질문 크기" value={data.fontSizes?.faqQuestion} min={14} max={26} onChange={(val) => updateFont('faqQuestion', val)} />
          <FontSizeSlider label="답변 크기" value={data.fontSizes?.faqAnswer} min={12} max={20} onChange={(val) => updateFont('faqAnswer', val)} />
          <div className="space-y-3 pt-2">
            {data.faqs.map((faq, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">질문 #{idx + 1}</span>
                  <button onClick={() => setData(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== idx) }))} className="text-xs text-red-500 hover:underline">삭제</button>
                </div>
                <input type="text" value={faq.question} onChange={(e) => setData(prev => { const f = [...prev.faqs]; f[idx].question = e.target.value; return { ...prev, faqs: f }; })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold" />
                <textarea rows={2} value={faq.answer} onChange={(e) => setData(prev => { const f = [...prev.faqs]; f[idx].answer = e.target.value; return { ...prev, faqs: f }; })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" placeholder="답변" />
              </div>
            ))}
          </div>
        </section>

        {/* 9. 하단 푸터 */}
        <section className="space-y-3 pb-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">9. 하단 푸터</h3>
          <div className="space-y-3">
            {['companyName', 'ownerName', 'businessNumber', 'address', 'contactEmail'].map((field) => (
              <div key={field}>
                <label className="text-xs text-slate-500 block mb-1">{field === 'companyName' ? '상호명' : field === 'ownerName' ? '대표자' : field === 'businessNumber' ? '사업자번호' : field === 'address' ? '주소' : '이메일'}</label>
                <input type="text" value={(data.footer as any)[field]} onChange={(e) => setData(prev => ({ ...prev, footer: { ...prev.footer, [field]: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
              </div>
            ))}
          </div>
        </section>

        {/* 🚀 [신규 추가] 10. 예약 시스템 설정 */}
        <section className="space-y-3 pt-6 pb-4 border-t-2 border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sky-700 text-sm">10. 예약 시스템 설정</h3>
            <label className="text-xs flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={data.booking.enabled} onChange={(e) => setData(prev => ({ ...prev, booking: { ...prev.booking, enabled: e.target.checked } }))} className="rounded text-sky-600" /> 활성화
            </label>
          </div>
          <div className="space-y-3">
            <input type="text" value={data.booking.title} onChange={(e) => setData(prev => ({ ...prev, booking: { ...prev.booking, title: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="예약 섹션 타이틀" />
            <textarea rows={2} value={data.booking.subtitle} onChange={(e) => setData(prev => ({ ...prev, booking: { ...prev.booking, subtitle: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="예약 안내 문구" />
            <div className="mt-3">
              <label className="text-xs text-slate-500 block mb-1">상담 가능 시간 (쉼표로 구분)</label>
              <input type="text" value={data.booking.availableHours.join(', ')} onChange={(e) => setData(prev => ({ ...prev, booking: { ...prev.booking, availableHours: e.target.value.split(',').map(s => s.trim()) } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="10:00, 11:00, 14:00..." />
            </div>
            <textarea rows={2} value={data.booking.bookingMessage} onChange={(e) => setData(prev => ({ ...prev, booking: { ...prev.booking, bookingMessage: e.target.value } }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="예약 완료 후 안내 메시지" />
          </div>
        </section>
      </div>
    </aside>
  );
}