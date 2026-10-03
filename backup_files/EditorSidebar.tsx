'use client';

import React, { useState } from 'react';
import {
  B2BTemplateData,
  NavItem,
  SolutionItem,
  ReviewItem,
  FaqItem,
} from '@/data/templates';
import { supabase } from '@/lib/supabase/client';
import { compressImage } from '@/utils/compressImage';

interface EditorSidebarProps {
  data: B2BTemplateData;
  setData: React.Dispatch<React.SetStateAction<B2BTemplateData>>;
  onPublish: () => void;
  saving?: boolean;
  setIsPaymentOpen?: (open: boolean) => void;
  uploadingImage?: boolean;
  handleImageUpload?: any;
  onOpenPayment?: () => void;
  [key: string]: any;
}

function FontSizeSlider({
  label,
  value,
  min = 12,
  max = 60,
  onChange,
}: {
  label: string;
  value?: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
}) {
  const currentVal = value || min;
  return (
    <div className="flex items-center justify-between gap-2 mt-2 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
      <span className="text-xs text-slate-600 font-medium">{label} 크기</span>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          value={currentVal}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
        />
        <span className="text-xs font-bold text-slate-800 w-9 text-right font-mono">
          {currentVal}px
        </span>
      </div>
    </div>
  );
}

export default function EditorSidebar({
  data,
  setData,
  onPublish,
  saving = false,
  setIsPaymentOpen,
}: EditorSidebarProps) {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

  const updateFont = (
    key: keyof NonNullable<B2BTemplateData['fontSizes']>,
    val: number
  ) => {
    setData((prev) => ({
      ...prev,
      fontSizes: {
        ...prev.fontSizes,
        [key]: val,
      },
    }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void,
    key: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading((prev) => ({ ...prev, [key]: true }));
      const compressed = await compressImage(file);
      const fileExt = compressed.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, compressed);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      callback(publicUrlData.publicUrl);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  // 1. 네비게이션 제어
  const addNavLink = () => {
    const newLinks = [...(data.navigation?.navLinks || []), { label: '새 메뉴', targetId: 'stats' }];
    setData({ ...data, navigation: { navLinks: newLinks } });
  };

  const updateNavLink = (index: number, field: keyof NavItem, value: string) => {
    const newLinks = [...(data.navigation?.navLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setData({ ...data, navigation: { navLinks: newLinks } });
  };

  const removeNavLink = (index: number) => {
    const newLinks = (data.navigation?.navLinks || []).filter((_, idx) => idx !== index);
    setData({ ...data, navigation: { navLinks: newLinks } });
  };

  // 2. 솔루션 제어
  const addSolution = () => {
    const newSol: SolutionItem = {
      title: '새 전문 서비스',
      description: '제공하는 핵심 서비스 상세 내용을 입력하세요.',
      image: '',
    };
    setData({ ...data, solutions: [...data.solutions, newSol] });
  };

  const updateSolution = (index: number, field: keyof SolutionItem, value: string) => {
    const newSol = [...data.solutions];
    newSol[index] = { ...newSol[index], [field]: value };
    setData({ ...data, solutions: newSol });
  };

  const removeSolution = (index: number) => {
    setData({ ...data, solutions: data.solutions.filter((_, idx) => idx !== index) });
  };

  // 3. 후기 제어
  const addReview = () => {
    const newRev: ReviewItem = {
      author: '고객명/기업명',
      role: '직책 또는 지역',
      content: '서비스 시공 및 도입에 대한 만족스러운 평가 내용을 입력하세요.',
    };
    setData({ ...data, reviews: [...data.reviews, newRev] });
  };

  const updateReview = (index: number, field: keyof ReviewItem, value: string) => {
    const newRev = [...data.reviews];
    newRev[index] = { ...newRev[index], [field]: value };
    setData({ ...data, reviews: newRev });
  };

  const removeReview = (index: number) => {
    setData({ ...data, reviews: data.reviews.filter((_, idx) => idx !== index) });
  };

  // 4. FAQ 제어
  const addFaq = () => {
    const newFaq: FaqItem = {
      question: '자주 묻는 질문을 입력하세요',
      answer: '질문에 대한 명확하고 친절한 답변을 작성하세요.',
    };
    setData({ ...data, faqs: [...data.faqs, newFaq] });
  };

  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
    const newFaqs = [...data.faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setData({ ...data, faqs: newFaqs });
  };

  const removeFaq = (index: number) => {
    setData({ ...data, faqs: data.faqs.filter((_, idx) => idx !== index) });
  };

  // 5. 푸터 정보 수정
  const updateFooter = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        [field]: value,
      },
    }));
  };

  return (
    <aside className="w-[430px] h-full bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-xl">
      {/* 헤더 액션 바 */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
            B2B 웹 빌더 에디터
          </h2>
          <span className="text-xs text-slate-500 font-medium">실시간 통합 디자인 스튜디오</span>
        </div>
        <div className="flex items-center gap-2">
          {setIsPaymentOpen && (
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              대행 결제
            </button>
          )}
          <button
            onClick={onPublish}
            disabled={saving}
            style={{ backgroundColor: data.themeColor || '#0284C7' }}
            className="px-4 py-2 text-xs font-bold text-white rounded-lg shadow hover:opacity-90 disabled:opacity-50 transition"
          >
            {saving ? '발행 중...' : '사이트 발행'}
          </button>
        </div>
      </div>

      {/* 설정 폼 스크롤 바디 */}
      <div className="flex-1 overflow-y-auto p-5 space-y-7 text-sm text-slate-800">
        {/* 테마 컬러 팔레트 */}
        <section className="space-y-3 pb-4 border-b border-slate-100">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            브랜드 테마 컬러
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={data.themeColor || '#0284C7'}
              onChange={(e) => setData({ ...data, themeColor: e.target.value })}
              className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={data.themeColor || '#0284C7'}
              onChange={(e) => setData({ ...data, themeColor: e.target.value })}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
            />
          </div>
        </section>

        {/* 1. 기업 기본 정보 */}
        <section className="space-y-3 pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">1. 기업 기본 정보</h3>
          <div>
            <label className="text-xs text-slate-500 block mb-1">회사명 / 상호명</label>
            <input
              type="text"
              value={data.company.name}
              onChange={(e) =>
                setData({ ...data, company: { ...data.company, name: e.target.value } })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <FontSizeSlider
            label="회사명 글자"
            value={data.fontSizes?.companyName}
            min={14}
            max={32}
            onChange={(val) => updateFont('companyName', val)}
          />
          <div>
            <label className="text-xs text-slate-500 block mb-1">고객센터 대표번호</label>
            <input
              type="text"
              value={data.supportPhone}
              onChange={(e) => setData({ ...data, supportPhone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">상단 기업 로고 이미지</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImageUpload(
                  e,
                  (url) => setData({ ...data, company: { ...data.company, logoUrl: url } }),
                  'logo'
                )
              }
              className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
            />
            {uploading['logo'] && <span className="text-xs text-sky-600 block mt-1">업로드 중...</span>}
          </div>
        </section>

        {/* 2. 상단 네비게이션 메뉴 (GNB) */}
        <section className="space-y-3 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">2. GNB 네비게이션 메뉴</h3>
            <button
              onClick={addNavLink}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700"
            >
              + 메뉴 추가
            </button>
          </div>
          <div className="space-y-2">
            {data.navigation?.navLinks?.map((nav, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={nav.label}
                  placeholder="메뉴명"
                  onChange={(e) => updateNavLink(idx, 'label', e.target.value)}
                  className="w-1/2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="text"
                  value={nav.targetId}
                  placeholder="이동 ID (예: stats)"
                  onChange={(e) => updateNavLink(idx, 'targetId', e.target.value)}
                  className="w-1/2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                />
                <button
                  onClick={() => removeNavLink(idx)}
                  className="text-slate-400 hover:text-red-500 p-1 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 메인 히어로 영역 */}
        <section className="space-y-3 pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">3. 메인 히어로 영역</h3>
          <div>
            <label className="text-xs text-slate-500 block mb-1">상단 슬로건 배지</label>
            <input
              type="text"
              value={data.hero.badge}
              onChange={(e) =>
                setData({ ...data, hero: { ...data.hero, badge: e.target.value } })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <FontSizeSlider
            label="배지 문구"
            value={data.fontSizes?.heroBadge}
            min={12}
            max={20}
            onChange={(val) => updateFont('heroBadge', val)}
          />

          <div>
            <label className="text-xs text-slate-500 block mb-1">메인 헤드라인 타이틀</label>
            <textarea
              rows={2}
              value={data.hero.title}
              onChange={(e) =>
                setData({ ...data, hero: { ...data.hero, title: e.target.value } })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <FontSizeSlider
            label="헤드라인 제목"
            value={data.fontSizes?.heroTitle}
            min={24}
            max={64}
            onChange={(val) => updateFont('heroTitle', val)}
          />

          <div>
            <label className="text-xs text-slate-500 block mb-1">서브 설명 문구</label>
            <textarea
              rows={3}
              value={data.hero.subtitle}
              onChange={(e) =>
                setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <FontSizeSlider
            label="서브 설명 문구"
            value={data.fontSizes?.heroSubtitle}
            min={12}
            max={24}
            onChange={(val) => updateFont('heroSubtitle', val)}
          />

          <div>
            <label className="text-xs text-slate-500 block mb-1">히어로 대표 사진/배너</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImageUpload(
                  e,
                  (url) =>
                    setData({
                      ...data,
                      hero: { ...data.hero, mediaUrl: url, mediaType: 'image' },
                    }),
                  'hero'
                )
              }
              className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
            />
            {uploading['hero'] && <span className="text-xs text-sky-600 block mt-1">업로드 중...</span>}
          </div>
        </section>

        {/* 4. 파트너사 및 인증 보증 */}
        {data.partnersSection && (
          <section className="space-y-3 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">4. 파트너사 / 보증 섹션</h3>
              <label className="text-xs flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.partnersSection.enabled}
                  onChange={(e) =>
                    setData({
                      ...data,
                      partnersSection: {
                        ...data.partnersSection!,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-sky-600"
                />
                영역 활성화
              </label>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">섹션 안내 문구</label>
              <input
                type="text"
                value={data.partnersSection.title}
                onChange={(e) =>
                  setData({
                    ...data,
                    partnersSection: {
                      ...data.partnersSection!,
                      title: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <FontSizeSlider
              label="안내 문구"
              value={data.fontSizes?.partnersTitle}
              min={12}
              max={24}
              onChange={(val) => updateFont('partnersTitle', val)}
            />
            <div>
              <label className="text-xs text-slate-500 block mb-1">
                파트너/보증 항목 (쉼표로 구분)
              </label>
              <input
                type="text"
                value={data.partnersSection.partners.join(', ')}
                onChange={(e) =>
                  setData({
                    ...data,
                    partnersSection: {
                      ...data.partnersSection!,
                      partners: e.target.value.split(',').map((p) => p.trim()),
                    },
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </section>
        )}

        {/* 5. 주요 실적 지표 */}
        <section className="space-y-3 pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">5. 주요 실적 지표</h3>
          <FontSizeSlider
            label="지표 숫자"
            value={data.fontSizes?.statsValue}
            min={20}
            max={52}
            onChange={(val) => updateFont('statsValue', val)}
          />
          <FontSizeSlider
            label="지표 설명 라벨"
            value={data.fontSizes?.statsLabel}
            min={12}
            max={20}
            onChange={(val) => updateFont('statsLabel', val)}
          />
          <div className="space-y-2">
            {data.stats.map((stat, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => {
                    const newStats = [...data.stats];
                    newStats[idx].value = e.target.value;
                    setData({ ...data, stats: newStats });
                  }}
                  className="w-1/3 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold"
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => {
                    const newStats = [...data.stats];
                    newStats[idx].label = e.target.value;
                    setData({ ...data, stats: newStats });
                  }}
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 6. 솔루션 / 핵심 시공 분야 */}
        <section className="space-y-3 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">6. 핵심 솔루션 / 시공 분야</h3>
            <button
              onClick={addSolution}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700"
            >
              + 항목 추가
            </button>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">섹션 제목</label>
            <input
              type="text"
              value={data.solutionsSection?.title || ''}
              onChange={(e) =>
                setData({
                  ...data,
                  solutionsSection: {
                    ...data.solutionsSection,
                    title: e.target.value,
                    subtitle: data.solutionsSection?.subtitle || '',
                  },
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <FontSizeSlider
            label="섹션 메인 제목"
            value={data.fontSizes?.sectionTitle}
            min={20}
            max={44}
            onChange={(val) => updateFont('sectionTitle', val)}
          />
          <div>
            <label className="text-xs text-slate-500 block mb-1">섹션 부제목</label>
            <input
              type="text"
              value={data.solutionsSection?.subtitle || ''}
              onChange={(e) =>
                setData({
                  ...data,
                  solutionsSection: {
                    ...data.solutionsSection,
                    title: data.solutionsSection?.title || '',
                    subtitle: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <FontSizeSlider
            label="섹션 부제목"
            value={data.fontSizes?.sectionSubtitle}
            min={12}
            max={22}
            onChange={(val) => updateFont('sectionSubtitle', val)}
          />
          <div className="space-y-4 pt-2">
            {data.solutions.map((sol, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">항목 #{idx + 1}</span>
                  <button
                    onClick={() => removeSolution(idx)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </div>
                <input
                  type="text"
                  value={sol.title}
                  placeholder="제목"
                  onChange={(e) => updateSolution(idx, 'title', e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold"
                />
                <textarea
                  rows={2}
                  value={sol.description}
                  placeholder="설명"
                  onChange={(e) => updateSolution(idx, 'description', e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(
                        e,
                        (url) => updateSolution(idx, 'image', url),
                        `sol-${idx}`
                      )
                    }
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 cursor-pointer"
                  />
                  {uploading[`sol-${idx}`] && (
                    <span className="text-xs text-sky-600 block mt-1">업로드 중...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. 고객사 평가 및 후기 */}
        <section className="space-y-3 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">7. 고객 평가 / 후기</h3>
            <button
              onClick={addReview}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700"
            >
              + 후기 추가
            </button>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">섹션 제목</label>
            <input
              type="text"
              value={data.reviewsSection?.title || ''}
              onChange={(e) =>
                setData({
                  ...data,
                  reviewsSection: {
                    ...data.reviewsSection,
                    title: e.target.value,
                    subtitle: data.reviewsSection?.subtitle || '',
                  },
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div className="space-y-3 pt-2">
            {data.reviews.map((rev, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">후기 #{idx + 1}</span>
                  <button
                    onClick={() => removeReview(idx)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={rev.author}
                    placeholder="작성자/업체명"
                    onChange={(e) => updateReview(idx, 'author', e.target.value)}
                    className="w-1/2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={rev.role}
                    placeholder="직책/분야"
                    onChange={(e) => updateReview(idx, 'role', e.target.value)}
                    className="w-1/2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <textarea
                  rows={2}
                  value={rev.content}
                  placeholder="후기 본문 내용"
                  onChange={(e) => updateReview(idx, 'content', e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 8. 자주 묻는 질문 (FAQ) */}
        <section className="space-y-3 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">8. 자주 묻는 질문 (FAQ)</h3>
            <button
              onClick={addFaq}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700"
            >
              + 질문 추가
            </button>
          </div>
          <FontSizeSlider
            label="질문 텍스트"
            value={data.fontSizes?.faqQuestion}
            min={14}
            max={26}
            onChange={(val) => updateFont('faqQuestion', val)}
          />
          <FontSizeSlider
            label="답변 텍스트"
            value={data.fontSizes?.faqAnswer}
            min={12}
            max={20}
            onChange={(val) => updateFont('faqAnswer', val)}
          />
          <div className="space-y-3 pt-2">
            {data.faqs.map((faq, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">질문 #{idx + 1}</span>
                  <button
                    onClick={() => removeFaq(idx)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </div>
                <input
                  type="text"
                  value={faq.question}
                  placeholder="질문"
                  onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold"
                />
                <textarea
                  rows={2}
                  value={faq.answer}
                  placeholder="답변"
                  onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 9. 하단 푸터 (사업자 정보) 설정 */}
        <section className="space-y-3 pb-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm">9. 하단 푸터 (사업자 정보)</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">전자상거래법 필수 표기 사항</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">푸터 상호명</label>
            <input
              type="text"
              value={data.footer.companyName}
              onChange={(e) => updateFooter('companyName', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">대표자명</label>
            <input
              type="text"
              value={data.footer.ownerName}
              onChange={(e) => updateFooter('ownerName', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">사업자등록번호</label>
            <input
              type="text"
              value={data.footer.businessNumber}
              onChange={(e) => updateFooter('businessNumber', e.target.value)}
              placeholder="000-00-00000"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">사업장 주소</label>
            <input
              type="text"
              value={data.footer.address}
              onChange={(e) => updateFooter('address', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">대표 이메일</label>
            <input
              type="email"
              value={data.footer.contactEmail}
              onChange={(e) => updateFooter('contactEmail', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>
        </section>
      </div>
    </aside>
  );
}