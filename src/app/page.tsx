'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { PageData, StoryItem, TEMPLATES } from '@/data/templates';
import PaymentModal from '@/components/PaymentModal';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function BuilderPage() {
  const [pageData, setPageData] = useState<PageData>({
    siteId: 'my-shop',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
    backgroundColor: '#ffffff',
    title: '당신의 비즈니스를 한눈에 보여주세요',
    titleColor: '#0f172a',
    titleFont: 'sans',
    titleSizePx: 22,
    subtitle: '코딩 없이 3분 만에 완성하는 나만의 전문 랜딩페이지입니다.',
    subtitleColor: '#475569',
    subtitleFont: 'sans',
    subtitleSizePx: 13,
    featureAlign: 'left',
    featureFont: 'sans',
    featureTitleSizePx: 13,
    featureDescSizePx: 11,
    feature1Title: '빠른 속도',
    feature1Desc: '단 몇 분 만에 사이트가 완성됩니다.',
    feature2Title: '모바일 최적화',
    feature2Desc: '어떤 기기에서도 완벽하게 보입니다.',
    feature3Title: '데이터 실시간 관리',
    feature3Desc: '간편하게 수정하고 배포하세요.',
    stories: [
      {
        id: '1',
        title: '우리 브랜드 이야기',
        content: '고객에게 전달하고 싶은 브랜드 철학과 제품/서비스에 대한 상세한 이야기를 적어보세요.',
        images: [],
      }
    ],
    faq1Q: '주문 후 배송까지 얼마나 걸리나요?',
    faq1A: '결제 완료 후 평일 기준 2~3일 이내에 안전하게 발송됩니다.',
    faq2Q: '교환 및 환불 정책은 어떻게 되나요?',
    faq2A: '수령 후 7일 이내에 문의해 주시면 신속히 처리해 드립니다.',
    faq3Q: '',
    faq3A: '',
    buttonText: '지금 바로 문의하기',
    buttonLink: 'https://google.com',
    primaryColor: '#2563eb',
    buttonFont: 'sans',
    buttonSizePx: 14,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingStoryImageId, setUploadingStoryImageId] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);

  const handleChange = (key: keyof PageData, value: any) => {
    setPageData((prev) => ({ ...prev, [key]: value }));
  };

  const addStory = () => {
    const newStory: StoryItem = {
      id: Date.now().toString(),
      title: '새로운 소개 섹션',
      content: '내용을 입력하세요.',
      images: [],
    };
    setPageData((prev) => ({ ...prev, stories: [...prev.stories, newStory] }));
  };

  const removeStory = (id: string) => {
    setPageData((prev) => ({
      ...prev,
      stories: prev.stories.filter((item) => item.id !== id),
    }));
  };

  const updateStory = (id: string, field: 'title' | 'content', value: string) => {
    setPageData((prev) => ({
      ...prev,
      stories: prev.stories.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleStoryImageUpload = async (storyId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentStory = pageData.stories.find((s) => s.id === storyId);
    if (!currentStory) return;

    if (currentStory.images.length + files.length > 5) {
      alert('사진은 섹션당 최대 5장까지만 첨부할 수 있습니다.');
      return;
    }

    try {
      setUploadingStoryImageId(storyId);
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        newUrls.push(data.publicUrl);
      }

      setPageData((prev) => ({
        ...prev,
        stories: prev.stories.map((s) =>
          s.id === storyId ? { ...s, images: [...s.images, ...newUrls] } : s
        ),
      }));
    } catch (err: any) {
      alert('스토리 사진 업로드 실패: ' + err.message);
    } finally {
      setUploadingStoryImageId(null);
      e.target.value = '';
    }
  };

  const removeStoryImage = (storyId: string, indexToRemove: number) => {
    setPageData((prev) => ({
      ...prev,
      stories: prev.stories.map((s) =>
        s.id === storyId
          ? { ...s, images: s.images.filter((_, idx) => idx !== indexToRemove) }
          : s
      ),
    }));
  };

  const applyTemplate = (key: string) => {
    const template = TEMPLATES[key];
    if (template) {
      setPageData((prev) => ({ ...prev, ...template }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      handleChange('imageUrl', data.publicUrl);
    } catch (err: any) {
      alert('이미지 업로드 실패: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePublish = async () => {
    if (!pageData.siteId.trim()) {
      alert('사이트 고유 주소(ID)를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from('sites').upsert({
      id: pageData.siteId.trim().toLowerCase(),
      image_url: pageData.imageUrl,
      background_color: pageData.backgroundColor,
      title: pageData.title,
      title_color: pageData.titleColor,
      title_font: pageData.titleFont,
      title_size_px: pageData.titleSizePx,
      subtitle: pageData.subtitle,
      subtitle_color: pageData.subtitleColor,
      subtitle_font: pageData.subtitleFont,
      subtitle_size_px: pageData.subtitleSizePx,
      feature_align: pageData.featureAlign,
      feature_font: pageData.featureFont,
      feature_title_size_px: pageData.featureTitleSizePx,
      feature_desc_size_px: pageData.featureDescSizePx,
      feature1_title: pageData.feature1Title,
      feature1_desc: pageData.feature1Desc,
      feature2_title: pageData.feature2Title,
      feature2_desc: pageData.feature2Desc,
      feature3_title: pageData.feature3Title,
      feature3_desc: pageData.feature3Desc,
      stories: pageData.stories,
      faq1_q: pageData.faq1Q,
      faq1_a: pageData.faq1A,
      faq2_q: pageData.faq2Q,
      faq2_a: pageData.faq2A,
      faq3_q: pageData.faq3Q,
      faq3_a: pageData.faq3A,
      button_text: pageData.buttonText,
      button_link: pageData.buttonLink,
      primary_color: pageData.primaryColor,
      button_font: pageData.buttonFont,
      button_size_px: pageData.buttonSizePx,
    });

    setIsLoading(false);

    if (error) {
      alert('발행 실패: ' + error.message);
    } else {
      setShowPayModal(true);
    }
  };

  const getFontFamilyClass = (font: string) => {
    if (font === 'serif') return 'font-serif';
    if (font === 'mono') return 'font-mono';
    return 'font-sans';
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen w-full bg-slate-100 font-sans relative">
      
      {/* 1. 편집기 영역 */}
      <aside className="w-full md:w-[420px] bg-white border-r border-slate-200 flex flex-col md:h-full shadow-lg z-10 shrink-0">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h1 className="text-base md:text-lg font-bold text-slate-800">페이지 에디터</h1>
            <p className="text-[11px] text-slate-400">아래로 스크롤하면 실시간 미리보기가 나옵니다.</p>
          </div>
          <button
            onClick={() => setShowPayModal(true)}
            className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[11px] rounded-full shadow-xs animate-pulse hover:opacity-90 transition cursor-pointer"
          >
            👑 첫 달 100원
          </button>
        </div>

        <div className="p-4 md:p-5 overflow-y-auto space-y-6 flex-1 pb-36 md:pb-36">
          {/* 원클릭 템플릿 */}
          <div>
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">원클릭 템플릿 프리셋</h3>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => applyTemplate('market')}
                className="p-2 border border-amber-200 bg-amber-50/50 hover:bg-amber-100/50 rounded-lg text-left transition cursor-pointer"
              >
                <div className="text-xs font-bold text-amber-900">공구/마켓</div>
                <div className="text-[10px] text-amber-700 mt-0.5">따뜻한 감성</div>
              </button>
              <button
                onClick={() => applyTemplate('consulting')}
                className="p-2 border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 rounded-lg text-left transition cursor-pointer"
              >
                <div className="text-xs font-bold text-blue-900">전문가/상담</div>
                <div className="text-[10px] text-blue-700 mt-0.5">신뢰감 고딕</div>
              </button>
              <button
                onClick={() => applyTemplate('waitlist')}
                className="p-2 border border-slate-700 bg-slate-900 hover:bg-slate-800 rounded-lg text-left transition cursor-pointer"
              >
                <div className="text-xs font-bold text-white">사전예약</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">다크 모노</div>
              </button>
            </div>
          </div>

          {/* 기본 설정 */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">기본 설정</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">사이트 고유 주소 (ID)</label>
              <div className="flex items-center text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-2">
                <span>/p/</span>
                <input
                  type="text"
                  value={pageData.siteId}
                  onChange={(e) => handleChange('siteId', e.target.value)}
                  className="w-full bg-transparent p-2 text-slate-800 font-medium outline-none text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">대표 이미지 첨부</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploadingImage}
                className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer mb-2"
              />
              <input
                type="text"
                value={pageData.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                placeholder="또는 이미지 URL 직접 입력"
                className="w-full text-xs border border-slate-300 rounded-lg p-2 outline-none text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">배경 색상</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={pageData.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
                <span className="text-xs text-slate-500">{pageData.backgroundColor}</span>
              </div>
            </div>
          </div>

          {/* 메인 제목 */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">메인 제목</h3>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
              <input
                type="text"
                value={pageData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full text-sm border border-slate-300 rounded p-1.5 outline-none bg-white font-medium"
              />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">글꼴</label>
                  <select
                    value={pageData.titleFont}
                    onChange={(e) => handleChange('titleFont', e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 bg-white outline-none"
                  >
                    <option value="sans">고딕 (Sans)</option>
                    <option value="serif">명조 (Serif)</option>
                    <option value="mono">고정폭 (Mono)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">색상</label>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="color"
                      value={pageData.titleColor}
                      onChange={(e) => handleChange('titleColor', e.target.value)}
                      className="w-6 h-6 rounded border cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-500">{pageData.titleColor}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>크기 (px)</span>
                  <input
                    type="number"
                    value={pageData.titleSizePx}
                    onChange={(e) => handleChange('titleSizePx', Number(e.target.value))}
                    className="w-12 text-right border border-slate-300 rounded px-1 text-xs"
                  />
                </div>
                <input
                  type="range"
                  min="16"
                  max="48"
                  value={pageData.titleSizePx}
                  onChange={(e) => handleChange('titleSizePx', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 부제목 */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">부제목</h3>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
              <textarea
                rows={2}
                value={pageData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full text-xs border border-slate-300 rounded p-1.5 outline-none bg-white"
              />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">글꼴</label>
                  <select
                    value={pageData.subtitleFont}
                    onChange={(e) => handleChange('subtitleFont', e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 bg-white outline-none"
                  >
                    <option value="sans">고딕 (Sans)</option>
                    <option value="serif">명조 (Serif)</option>
                    <option value="mono">고정폭 (Mono)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">색상</label>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="color"
                      value={pageData.subtitleColor}
                      onChange={(e) => handleChange('subtitleColor', e.target.value)}
                      className="w-6 h-6 rounded border cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-500">{pageData.subtitleColor}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>크기 (px)</span>
                  <input
                    type="number"
                    value={pageData.subtitleSizePx}
                    onChange={(e) => handleChange('subtitleSizePx', Number(e.target.value))}
                    className="w-12 text-right border border-slate-300 rounded px-1 text-xs"
                  />
                </div>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={pageData.subtitleSizePx}
                  onChange={(e) => handleChange('subtitleSizePx', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 특징 블록 */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">특징 블록</h3>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => handleChange('featureAlign', align)}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded cursor-pointer ${
                      pageData.featureAlign === align ? 'bg-white shadow text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {align === 'left' ? '좌' : align === 'center' ? '중' : '우'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex gap-2 text-xs">
                <div className="flex-1">
                  <label className="block text-[11px] text-slate-500 mb-1">글꼴</label>
                  <select
                    value={pageData.featureFont}
                    onChange={(e) => handleChange('featureFont', e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 bg-white outline-none"
                  >
                    <option value="sans">고딕 (Sans)</option>
                    <option value="serif">명조 (Serif)</option>
                    <option value="mono">고정폭 (Mono)</option>
                  </select>
                </div>
                <div className="w-20">
                  <label className="block text-[11px] text-slate-500 mb-1">제목(px)</label>
                  <input
                    type="number"
                    value={pageData.featureTitleSizePx}
                    onChange={(e) => handleChange('featureTitleSizePx', Number(e.target.value))}
                    className="w-full border border-slate-300 rounded p-1.5 text-xs text-center bg-white"
                  />
                </div>
                <div className="w-20">
                  <label className="block text-[11px] text-slate-500 mb-1">설명(px)</label>
                  <input
                    type="number"
                    value={pageData.featureDescSizePx}
                    onChange={(e) => handleChange('featureDescSizePx', Number(e.target.value))}
                    className="w-full border border-slate-300 rounded p-1.5 text-xs text-center bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="space-y-1 border-t border-slate-200 pt-1.5">
                    <span className="text-[10px] font-bold text-slate-400">항목 {num}</span>
                    <input
                      type="text"
                      value={(pageData as any)[`feature${num}Title`]}
                      onChange={(e) => handleChange(`feature${num}Title` as any, e.target.value)}
                      placeholder="제목"
                      className="w-full text-xs border border-slate-300 rounded p-1.5 outline-none bg-white"
                    />
                    <input
                      type="text"
                      value={(pageData as any)[`feature${num}Desc`]}
                      onChange={(e) => handleChange(`feature${num}Desc` as any, e.target.value)}
                      placeholder="설명"
                      className="w-full text-xs border border-slate-300 rounded p-1.5 outline-none bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 상세 소개 (사진 최대 5장 첨부 기능) */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                상세 소개 ({pageData.stories.length}개)
              </h3>
              <button
                type="button"
                onClick={addStory}
                className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-md transition cursor-pointer"
              >
                + 섹션 추가
              </button>
            </div>

            <div className="space-y-3">
              {pageData.stories.map((story, index) => (
                <div key={story.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-500">섹션 {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeStory(story.id)}
                      className="text-[11px] text-red-500 hover:underline p-1 cursor-pointer"
                    >
                      삭제
                    </button>
                  </div>
                  <input
                    type="text"
                    value={story.title}
                    onChange={(e) => updateStory(story.id, 'title', e.target.value)}
                    placeholder="소제목"
                    className="w-full text-xs border border-slate-300 rounded p-1.5 outline-none bg-white font-medium"
                  />
                  <textarea
                    rows={3}
                    value={story.content}
                    onChange={(e) => updateStory(story.id, 'content', e.target.value)}
                    placeholder="상세 내용을 적어주세요."
                    className="w-full text-xs border border-slate-300 rounded p-1.5 outline-none bg-white leading-relaxed"
                  />

                  {/* 사진 첨부 (최대 5장) */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-200">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-semibold text-slate-600">
                        설명 사진 첨부 (최대 5장: {story.images?.length || 0}/5)
                      </label>
                      {uploadingStoryImageId === story.id && (
                        <span className="text-[10px] text-blue-500 animate-pulse font-bold">업로드 중...</span>
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={uploadingStoryImageId === story.id || (story.images?.length || 0) >= 5}
                      onChange={(e) => handleStoryImageUpload(story.id, e)}
                      className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:opacity-40"
                    />

                    {/* 등록된 사진 썸네일 */}
                    {story.images && story.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {story.images.map((imgUrl, imgIdx) => (
                          <div key={imgIdx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-300 group shrink-0">
                            <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeStoryImage(story.id, imgIdx)}
                              className="absolute inset-0 bg-black/60 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ 블록 */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">자주 묻는 질문 (FAQ)</h3>
            <div className="space-y-2">
              {[1, 2, 3].map((num) => (
                <div key={num} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400">Q&A {num}</span>
                  <input
                    type="text"
                    value={(pageData as any)[`faq${num}Q`]}
                    onChange={(e) => handleChange(`faq${num}Q` as any, e.target.value)}
                    placeholder={`질문 ${num}`}
                    className="w-full text-xs border border-slate-300 rounded p-1 outline-none bg-white font-medium"
                  />
                  <textarea
                    rows={2}
                    value={(pageData as any)[`faq${num}A`]}
                    onChange={(e) => handleChange(`faq${num}A` as any, e.target.value)}
                    placeholder={`답변 ${num}`}
                    className="w-full text-xs border border-slate-300 rounded p-1 outline-none bg-white text-slate-600"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CTA 버튼 설정 */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">CTA 버튼 설정</h3>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
              <input
                type="text"
                value={pageData.buttonText}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                placeholder="버튼 문구"
                className="w-full text-sm border border-slate-300 rounded p-1.5 outline-none bg-white font-medium"
              />
              <input
                type="text"
                value={pageData.buttonLink}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
                placeholder="연결 URL (https://...)"
                className="w-full text-xs border border-slate-300 rounded p-1.5 outline-none bg-white"
              />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">버튼 글꼴</label>
                  <select
                    value={pageData.buttonFont}
                    onChange={(e) => handleChange('buttonFont', e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 bg-white outline-none"
                  >
                    <option value="sans">고딕 (Sans)</option>
                    <option value="serif">명조 (Serif)</option>
                    <option value="mono">고정폭 (Mono)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">버튼 색상</label>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="color"
                      value={pageData.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="w-6 h-6 rounded border cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-500">{pageData.primaryColor}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>글자 크기 (px)</span>
                  <input
                    type="number"
                    value={pageData.buttonSizePx}
                    onChange={(e) => handleChange('buttonSizePx', Number(e.target.value))}
                    className="w-12 text-right border border-slate-300 rounded px-1 text-xs"
                  />
                </div>
                <input
                  type="range"
                  min="11"
                  max="24"
                  value={pageData.buttonSizePx}
                  onChange={(e) => handleChange('buttonSizePx', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 고정 발행 버튼 */}
        <div className="p-3 md:p-4 border-t border-slate-100 bg-white md:bg-slate-50 fixed bottom-0 left-0 w-full md:w-[420px] z-30 shadow-lg">
          <button
            onClick={handlePublish}
            disabled={isLoading || uploadingImage}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-xl text-sm shadow-md transition cursor-pointer"
          >
            {isLoading ? '저장 중...' : '사이트 발행하기 (Publish)'}
          </button>
        </div>
      </aside>

      {/* 2. 실시간 미리보기 영역 */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto flex items-center justify-center relative pb-36 md:pb-12">
        <div className="w-full max-w-sm flex flex-col items-center">
          <div className="w-full text-center mb-2 md:hidden">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">▼ 실시간 미리보기 (Live Canvas)</span>
          </div>

          <div 
            className="w-full rounded-[36px] shadow-2xl border-4 border-slate-800 flex flex-col justify-start p-5 transition-all duration-300 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ backgroundColor: pageData.backgroundColor }}
          >
            {pageData.imageUrl && (
              <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-sm">
                <img
                  src={pageData.imageUrl}
                  alt="Main"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>
            )}

            {/* 메인 텍스트 */}
            <div className="space-y-2 text-center">
              <h2 
                className={`font-extrabold leading-tight break-keep ${getFontFamilyClass(pageData.titleFont)}`}
                style={{ color: pageData.titleColor, fontSize: `${pageData.titleSizePx}px` }}
              >
                {pageData.title || '제목을 입력하세요'}
              </h2>
              <p 
                className={`break-keep leading-relaxed ${getFontFamilyClass(pageData.subtitleFont)}`}
                style={{ color: pageData.subtitleColor, fontSize: `${pageData.subtitleSizePx}px` }}
              >
                {pageData.subtitle || '부제목을 입력하세요'}
              </p>
            </div>

            {/* 특징 카드 3종 */}
            <div className="space-y-2">
              {[
                { title: pageData.feature1Title, desc: pageData.feature1Desc },
                { title: pageData.feature2Title, desc: pageData.feature2Desc },
                { title: pageData.feature3Title, desc: pageData.feature3Desc },
              ].map((f, i) => f.title && (
                <div 
                  key={i} 
                  className={`p-2.5 bg-white/70 backdrop-blur border border-slate-200/60 rounded-xl shadow-xs ${getFontFamilyClass(pageData.featureFont)} ${
                    pageData.featureAlign === 'center' ? 'text-center' : pageData.featureAlign === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className="font-bold text-slate-800" style={{ fontSize: `${pageData.featureTitleSizePx}px` }}>
                    {f.title}
                  </div>
                  <div className="text-slate-500 mt-0.5" style={{ fontSize: `${pageData.featureDescSizePx}px` }}>
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* 다중 스토리 미리보기 (수직 한 줄 세로 사진 리스트) */}
            {pageData.stories.length > 0 && (
              <div className="space-y-3">
                {pageData.stories.map((story) => (
                  <div key={story.id} className="p-3.5 bg-white/60 backdrop-blur rounded-2xl border border-slate-200/50 text-left space-y-2.5 shadow-xs">
                    {story.title && (
                      <div className="text-xs font-bold text-slate-900">{story.title}</div>
                    )}

                    {story.images && story.images.length > 0 && (
                      <div className="flex flex-col space-y-2 pt-1">
                        {story.images.map((imgUrl, imgIdx) => (
                          <div key={imgIdx} className="w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/70 shadow-xs">
                            <img
                              src={imgUrl}
                              alt={`Story visual ${imgIdx + 1}`}
                              className="w-full h-auto object-cover max-h-56"
                              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {story.content}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FAQ 아코디언 미리보기 */}
            {(pageData.faq1Q || pageData.faq2Q) && (
              <div className="space-y-1.5 text-left">
                <div className="text-xs font-bold text-slate-700 mb-1 px-1">자주 묻는 질문</div>
                {[
                  { q: pageData.faq1Q, a: pageData.faq1A },
                  { q: pageData.faq2Q, a: pageData.faq2A },
                  { q: pageData.faq3Q, a: pageData.faq3A },
                ].map((item, idx) => item.q && (
                  <div key={idx} className="bg-white/80 border border-slate-200/70 rounded-xl overflow-hidden shadow-xs">
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full p-2.5 text-left flex justify-between items-center text-xs font-semibold text-slate-800 cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <span className="text-[10px] text-slate-400">{openFaqIndex === idx ? '▲' : '▼'}</span>
                    </button>
                    {openFaqIndex === idx && item.a && (
                      <div className="px-2.5 pb-2.5 text-[11px] text-slate-500 border-t border-slate-100 pt-1.5">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* CTA 버튼 */}
            <div className="pt-2">
              <a
                href={pageData.buttonLink}
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: pageData.primaryColor, fontSize: `${pageData.buttonSizePx}px` }}
                className={`inline-block w-full py-3 px-6 text-white font-bold rounded-xl shadow-md transition text-center ${getFontFamilyClass(pageData.buttonFont)}`}
              >
                {pageData.buttonText || '버튼 문구'}
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* 우측 하단 문의 플로팅 버튼 */}
      <a
        href="mailto:contact@mybuilder.com"
        target="_blank"
        rel="noreferrer"
        className="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-full shadow-2xl text-xs font-bold transition transform hover:scale-105"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        개발자에게 문의하기
      </a>

      {/* 포트원 결제 모달 팝업 컴포넌트 */}
      <PaymentModal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
      />

    </div>
  );
}