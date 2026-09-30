'use client';

import React from 'react';
import { B2BTemplateData, NavItem, StatItem, SolutionItem, ReviewItem, FaqItem } from '@/data/templates';

interface EditorSidebarProps {
  data: B2BTemplateData;
  setData: React.Dispatch<React.SetStateAction<B2BTemplateData>>;
  uploadingImage: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, targetKey: 'solution' | 'logo' | 'hero', index?: number) => void;
  publishedUrl: string | null;
  lastSavedTime: Date | null;
  saving: boolean;
  siteId: string | null;
  onPublish: () => void;
  onOpenPayment: () => void;
}

export default function EditorSidebar({
  data,
  setData,
  uploadingImage,
  handleImageUpload,
  publishedUrl,
  lastSavedTime,
  saving,
  siteId,
  onPublish,
  onOpenPayment,
}: EditorSidebarProps) {
  // 네비게이션 명칭 및 타겟 수정
  const handleNavChange = (idx: number, field: keyof NavItem, val: string) => {
    setData((prev) => {
      const next = [...(prev.navigation?.navLinks || [])];
      next[idx] = { ...next[idx], [field]: val };
      return { ...prev, navigation: { ...prev.navigation, navLinks: next } };
    });
  };

  // 네비게이션 순서 변경 (위/아래)
  const handleMoveNav = (index: number, direction: 'up' | 'down') => {
    setData((prev) => {
      const links = [...(prev.navigation?.navLinks || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= links.length) return prev;
      const temp = links[index];
      links[index] = links[targetIndex];
      links[targetIndex] = temp;
      return { ...prev, navigation: { ...prev.navigation, navLinks: links } };
    });
  };

  // 네비게이션 메뉴 추가
  const handleAddNav = () => {
    setData((prev) => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        navLinks: [...(prev.navigation?.navLinks || []), { label: '새 메뉴', targetId: 'solutions' }],
      },
    }));
  };

  // 네비게이션 메뉴 삭제
  const handleRemoveNav = (idx: number) => {
    setData((prev) => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        navLinks: (prev.navigation?.navLinks || []).filter((_, i) => i !== idx),
      },
    }));
  };

  // 실적 지표 핸들러
  const handleStatChange = (idx: number, field: keyof StatItem, val: string) => {
    setData((prev) => {
      const next = [...(prev.stats || [])];
      next[idx] = { ...next[idx], [field]: val };
      return { ...prev, stats: next };
    });
  };

  // 솔루션 핸들러
  const handleSolutionChange = (idx: number, field: keyof SolutionItem, val: string) => {
    setData((prev) => {
      const next = [...(prev.solutions || [])];
      next[idx] = { ...next[idx], [field]: val };
      return { ...prev, solutions: next };
    });
  };

  const handleAddSolution = () => {
    setData((prev) => ({
      ...prev,
      solutions: [...(prev.solutions || []), { title: '새 솔루션 명칭', description: '솔루션 상세 설명을 작성하세요.', image: '' }],
    }));
  };

  const handleRemoveSolution = (idx: number) => {
    setData((prev) => ({
      ...prev,
      solutions: (prev.solutions || []).filter((_, i) => i !== idx),
    }));
  };

  // 고객 후기 핸들러
  const handleReviewChange = (idx: number, field: keyof ReviewItem, val: string) => {
    setData((prev) => {
      const next = [...(prev.reviews || [])];
      next[idx] = { ...next[idx], [field]: val };
      return { ...prev, reviews: next };
    });
  };

  const handleAddReview = () => {
    setData((prev) => ({
      ...prev,
      reviews: [...(prev.reviews || []), { author: '고객명', role: '직함 / 기업명', content: '도입 후 큰 효율 개선을 경험했습니다.' }],
    }));
  };

  const handleRemoveReview = (idx: number) => {
    setData((prev) => ({
      ...prev,
      reviews: (prev.reviews || []).filter((_, i) => i !== idx),
    }));
  };

  // FAQ 핸들러
  const handleFaqChange = (idx: number, field: keyof FaqItem, val: string) => {
    setData((prev) => {
      const next = [...(prev.faqs || [])];
      next[idx] = { ...next[idx], [field]: val };
      return { ...prev, faqs: next };
    });
  };

  const handleAddFaq = () => {
    setData((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: '새로운 질문입니다.', answer: '질문에 대한 명확한 답변을 기재하세요.' }],
    }));
  };

  const handleRemoveFaq = (idx: number) => {
    setData((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== idx),
    }));
  };

  return (
    <aside className="w-[450px] h-full bg-white border-r border-gray-200 flex flex-col z-20 shadow-sm shrink-0">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
        <div>
          <h1 className="text-base font-bold text-gray-900">B2B 기업형 웹 빌더</h1>
          <p className="text-[11px] text-gray-500">
            {lastSavedTime ? `임시 저장됨 (${lastSavedTime.toLocaleTimeString()})` : '실시간 커스텀 & 배포 관리 대행'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPayment}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors"
          >
            대행 구독 결제
          </button>
          <button
            onClick={onPublish}
            disabled={saving}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? '저장 중...' : siteId ? '수정사항 반영' : '사이트 발행'}
          </button>
        </div>
      </div>

      {publishedUrl && (
        <div className="p-3 bg-blue-50 border-b border-blue-200 text-xs flex flex-col gap-1 shrink-0">
          <span className="font-semibold text-blue-900">공개 발행 URL:</span>
          <a href={publishedUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline truncate">
            {publishedUrl}
          </a>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
        {/* 테마 컬러 */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-800 border-b pb-1">브랜드 테마 컬러</h2>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={data?.themeColor || '#2563EB'}
              onChange={(e) => setData((prev) => ({ ...prev, themeColor: e.target.value }))}
              className="w-9 h-9 p-0.5 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={data?.themeColor || '#2563EB'}
              onChange={(e) => setData((prev) => ({ ...prev, themeColor: e.target.value }))}
              className="flex-1 p-2 border rounded border-gray-300 font-mono text-xs"
            />
          </div>
        </section>

        {/* 1. 기업 정보 */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-800 border-b pb-1">1. 기업 기본 정보</h2>
          <div>
            <label className="font-medium text-gray-600 block mb-1">회사명 / 브랜드명</label>
            <input
              type="text"
              value={data?.company?.name || ''}
              onChange={(e) => setData((prev) => ({ ...prev, company: { ...prev.company, name: e.target.value } }))}
              className="w-full p-2 border rounded border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="font-medium text-gray-600 block mb-1">고객센터 대표번호</label>
            <input
              type="text"
              value={data?.supportPhone || ''}
              onChange={(e) => setData((prev) => ({ ...prev, supportPhone: e.target.value }))}
              className="w-full p-2 border rounded border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-500 block mb-1">상단 기업 로고 이미지</label>
            <input
              type="file"
              accept="image/*"
              disabled={uploadingImage}
              onChange={(e) => handleImageUpload(e, 'logo')}
              className="w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:bg-gray-200"
            />
            {data.company?.logoUrl && (
              <div className="mt-2 flex items-center gap-2">
                <img src={data.company.logoUrl} alt="logo" className="h-8 max-w-[120px] object-contain border p-1 rounded" />
                <button
                  type="button"
                  onClick={() => setData((p) => ({ ...p, company: { ...p.company, logoUrl: '' } }))}
                  className="text-red-500 hover:underline text-[11px]"
                >
                  로고 삭제
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 2. 우측 상단 네비게이션 바 & 카테고리 관리 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b pb-1">
            <div>
              <h2 className="text-sm font-bold text-gray-800">2. 우측 상단 네비게이션 메뉴</h2>
              <p className="text-[11px] text-gray-500">GNB 메뉴명 및 클릭 시 이동할 섹션 지정</p>
            </div>
            <button
              type="button"
              onClick={handleAddNav}
              className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
            >
              + 메뉴 추가
            </button>
          </div>
          <div className="space-y-2">
            {(data?.navigation?.navLinks || []).map((nav, idx) => (
              <div key={idx} className="p-2.5 bg-gray-50 border rounded-lg flex items-center gap-2">
                {/* 순서 이동 버튼 */}
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveNav(idx, 'up')}
                    className="text-[10px] text-gray-500 hover:text-black disabled:opacity-20 px-1 leading-none"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={idx === (data.navigation?.navLinks?.length || 0) - 1}
                    onClick={() => handleMoveNav(idx, 'down')}
                    className="text-[10px] text-gray-500 hover:text-black disabled:opacity-20 px-1 leading-none"
                  >
                    ▼
                  </button>
                </div>

                {/* 메뉴명 수정 인풋 */}
                <input
                  type="text"
                  value={nav.label}
                  onChange={(e) => handleNavChange(idx, 'label', e.target.value)}
                  placeholder="메뉴명 (예: 솔루션)"
                  className="flex-1 p-1.5 border rounded bg-white text-xs font-medium text-gray-800"
                />

                {/* 연결 대상 섹션 선택 */}
                <select
                  value={nav.targetId}
                  onChange={(e) => handleNavChange(idx, 'targetId', e.target.value)}
                  className="p-1.5 border rounded bg-white text-xs text-gray-600"
                >
                  <option value="stats">실적 지표</option>
                  <option value="solutions">솔루션</option>
                  <option value="reviews">고객 후기</option>
                  <option value="faqs">자주 묻는 질문</option>
                  <option value="contact">상담 신청 폼</option>
                </select>

                {/* 삭제 버튼 */}
                <button
                  type="button"
                  onClick={() => handleRemoveNav(idx)}
                  className="text-red-500 hover:text-red-700 px-1 text-xs font-bold"
                  title="메뉴 삭제"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 메인 히어로 */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-800 border-b pb-1">3. 메인 히어로 영역</h2>
          <div>
            <label className="font-medium text-gray-600 block mb-1">상단 배지 슬로건 문구</label>
            <input
              type="text"
              value={data?.hero?.badge || ''}
              onChange={(e) => setData((prev) => ({ ...prev, hero: { ...prev.hero, badge: e.target.value } }))}
              placeholder="예: Enterprise Professional Service"
              className="w-full p-2 border rounded border-gray-300 font-medium text-blue-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="font-medium text-gray-600 block mb-1">헤드라인 타이틀</label>
            <textarea
              rows={2}
              value={data?.hero?.title || ''}
              onChange={(e) => setData((prev) => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))}
              className="w-full p-2 border rounded border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="font-medium text-gray-600 block mb-1">서브 설명 문구</label>
            <textarea
              rows={3}
              value={data?.hero?.subtitle || ''}
              onChange={(e) => setData((prev) => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))}
              className="w-full p-2 border rounded border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg space-y-2">
            <label className="font-bold text-gray-700 block">히어로 대표 사진 / 배너 첨부</label>
            <input
              type="file"
              accept="image/*"
              disabled={uploadingImage}
              onChange={(e) => handleImageUpload(e, 'hero')}
              className="w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:bg-blue-600 file:text-white"
            />
            {data.hero?.mediaUrl && (
              <div className="relative mt-2 border rounded overflow-hidden">
                <img src={data.hero.mediaUrl} alt="Hero Banner" className="w-full h-32 object-cover" />
                <button
                  type="button"
                  onClick={() => setData((p) => ({ ...p, hero: { ...p.hero, mediaUrl: '' } }))}
                  className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded shadow"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 4. 파트너사 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b pb-1">
            <h2 className="text-sm font-bold text-gray-800">4. 파트너사 영역</h2>
            <label className="flex items-center gap-1.5 cursor-pointer text-gray-600 font-medium">
              <input
                type="checkbox"
                checked={data?.partnersSection?.enabled ?? true}
                onChange={(e) => setData((prev) => ({ ...prev, partnersSection: { ...prev.partnersSection!, enabled: e.target.checked } }))}
              />
              영역 활성화
            </label>
          </div>
          <div>
            <label className="font-medium text-gray-600 block mb-1">안내 문구</label>
            <input
              type="text"
              value={data?.partnersSection?.title || ''}
              onChange={(e) => setData((prev) => ({ ...prev, partnersSection: { ...prev.partnersSection!, title: e.target.value } }))}
              className="w-full p-2 border rounded border-gray-300"
            />
          </div>
          <div>
            <label className="font-medium text-gray-600 block mb-1">파트너사 명칭 (쉼표 구분)</label>
            <input
              type="text"
              value={(data?.partnersSection?.partners || []).join(', ')}
              onChange={(e) => {
                const arr = e.target.value.split(',').map((s) => s.trim());
                setData((prev) => ({ ...prev, partnersSection: { ...prev.partnersSection!, partners: arr } }));
              }}
              className="w-full p-2 border rounded border-gray-300"
            />
          </div>
        </section>

        {/* 5. 실적 지표 */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-800 border-b pb-1">5. 주요 실적 지표</h2>
          <div className="grid grid-cols-2 gap-2">
            {(data?.stats || []).map((stat, idx) => (
              <div key={idx} className="p-2 border border-gray-200 rounded bg-gray-50 space-y-1">
                <input
                  type="text"
                  value={stat?.value || ''}
                  onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                  placeholder="수치 (예: 99.8%)"
                  className="w-full p-1.5 border rounded bg-white text-xs"
                />
                <input
                  type="text"
                  value={stat?.label || ''}
                  onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                  placeholder="라벨 (예: 가동률)"
                  className="w-full p-1.5 border rounded bg-white text-[11px]"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 6. 솔루션 라인업 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b pb-1">
            <h2 className="text-sm font-bold text-gray-800">6. 솔루션 라인업</h2>
            <button type="button" onClick={handleAddSolution} className="text-blue-600 hover:text-blue-800 font-semibold">
              + 항목 추가
            </button>
          </div>
          <div className="p-2.5 bg-gray-50 border rounded space-y-2">
            <div>
              <label className="text-[11px] font-medium text-gray-600 block mb-0.5">섹션 메인 제목</label>
              <input
                type="text"
                value={data?.solutionsSection?.title || ''}
                onChange={(e) => setData((prev) => ({
                  ...prev,
                  solutionsSection: { ...prev.solutionsSection, title: e.target.value }
                }))}
                className="w-full p-1.5 border rounded bg-white font-medium"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-600 block mb-0.5">섹션 서브 설명</label>
              <input
                type="text"
                value={data?.solutionsSection?.subtitle || ''}
                onChange={(e) => setData((prev) => ({
                  ...prev,
                  solutionsSection: { ...prev.solutionsSection, subtitle: e.target.value }
                }))}
                className="w-full p-1.5 border rounded bg-white"
              />
            </div>
          </div>
          {(data?.solutions || []).map((sol, idx) => (
            <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">솔루션 #{idx + 1}</span>
                <button type="button" onClick={() => handleRemoveSolution(idx)} className="text-red-500 hover:text-red-700 font-medium">
                  삭제
                </button>
              </div>
              <input
                type="text"
                placeholder="솔루션 명칭"
                value={sol?.title || ''}
                onChange={(e) => handleSolutionChange(idx, 'title', e.target.value)}
                className="w-full p-1.5 border rounded bg-white"
              />
              <textarea
                rows={2}
                placeholder="솔루션 세부 설명"
                value={sol?.description || ''}
                onChange={(e) => handleSolutionChange(idx, 'description', e.target.value)}
                className="w-full p-1.5 border rounded bg-white"
              />
              <div>
                <label className="text-[11px] text-gray-500 block mb-1">솔루션 대표 이미지 첨부</label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={(e) => handleImageUpload(e, 'solution', idx)}
                  className="w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:bg-gray-200 hover:file:bg-gray-300"
                />
                {sol?.image && (
                  <img src={sol.image} alt="preview" className="mt-2 h-16 w-full object-cover rounded border" />
                )}
              </div>
            </div>
          ))}
        </section>

        {/* 7. 고객사 평가 및 후기 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b pb-1">
            <h2 className="text-sm font-bold text-gray-800">7. 고객사 평가 및 후기</h2>
            <button type="button" onClick={handleAddReview} className="text-blue-600 hover:text-blue-800 font-semibold">
              + 항목 추가
            </button>
          </div>
          <div className="p-2.5 bg-gray-50 border rounded space-y-2">
            <div>
              <label className="text-[11px] font-medium text-gray-600 block mb-0.5">섹션 메인 제목</label>
              <input
                type="text"
                value={data?.reviewsSection?.title || ''}
                onChange={(e) => setData((prev) => ({
                  ...prev,
                  reviewsSection: { ...prev.reviewsSection, title: e.target.value }
                }))}
                className="w-full p-1.5 border rounded bg-white font-medium"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-600 block mb-0.5">섹션 서브 설명</label>
              <input
                type="text"
                value={data?.reviewsSection?.subtitle || ''}
                onChange={(e) => setData((prev) => ({
                  ...prev,
                  reviewsSection: { ...prev.reviewsSection, subtitle: e.target.value }
                }))}
                className="w-full p-1.5 border rounded bg-white"
              />
            </div>
          </div>
          {(data?.reviews || []).map((rev, idx) => (
            <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">후기 #{idx + 1}</span>
                <button type="button" onClick={() => handleRemoveReview(idx)} className="text-red-500 hover:text-red-700 font-medium">
                  삭제
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="담당자명"
                  value={rev?.author || ''}
                  onChange={(e) => handleReviewChange(idx, 'author', e.target.value)}
                  className="w-full p-1.5 border rounded bg-white"
                />
                <input
                  type="text"
                  placeholder="직함 / 기업명"
                  value={rev?.role || ''}
                  onChange={(e) => handleReviewChange(idx, 'role', e.target.value)}
                  className="w-full p-1.5 border rounded bg-white"
                />
              </div>
              <textarea
                rows={2}
                placeholder="후기 본문 내용"
                value={rev?.content || ''}
                onChange={(e) => handleReviewChange(idx, 'content', e.target.value)}
                className="w-full p-1.5 border rounded bg-white"
              />
            </div>
          ))}
        </section>

        {/* 8. FAQ */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b pb-1">
            <h2 className="text-sm font-bold text-gray-800">8. 자주 묻는 질문 (FAQ)</h2>
            <button type="button" onClick={handleAddFaq} className="text-blue-600 hover:text-blue-800 font-semibold">
              + 질문 추가
            </button>
          </div>
          {(data?.faqs || []).map((faq, idx) => (
            <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">질문 #{idx + 1}</span>
                <button type="button" onClick={() => handleRemoveFaq(idx)} className="text-red-500 hover:text-red-700 font-medium">
                  삭제
                </button>
              </div>
              <input
                type="text"
                placeholder="질문 제목"
                value={faq?.question || ''}
                onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                className="w-full p-1.5 border rounded bg-white"
              />
              <textarea
                rows={2}
                placeholder="답변 본문"
                value={faq?.answer || ''}
                onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                className="w-full p-1.5 border rounded bg-white"
              />
            </div>
          ))}
        </section>

        {/* 9. 푸터 정보 */}
        <section className="space-y-3 pb-8">
          <h2 className="text-sm font-bold text-gray-800 border-b pb-1">9. 사업자 법적 표기 정보</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-gray-500 block mb-1">상호명</label>
              <input
                type="text"
                value={data?.footer?.companyName || ''}
                onChange={(e) => setData((prev) => ({ ...prev, footer: { ...prev.footer, companyName: e.target.value } }))}
                className="w-full p-1.5 border rounded bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 block mb-1">대표자 성명</label>
              <input
                type="text"
                value={data?.footer?.ownerName || ''}
                onChange={(e) => setData((prev) => ({ ...prev, footer: { ...prev.footer, ownerName: e.target.value } }))}
                className="w-full p-1.5 border rounded bg-white"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-500 block mb-1">사업자등록번호</label>
            <input
              type="text"
              value={data?.footer?.businessNumber || ''}
              onChange={(e) => setData((prev) => ({ ...prev, footer: { ...prev.footer, businessNumber: e.target.value } }))}
              className="w-full p-1.5 border rounded bg-white"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-500 block mb-1">사업장 소재지 주소</label>
            <input
              type="text"
              value={data?.footer?.address || ''}
              onChange={(e) => setData((prev) => ({ ...prev, footer: { ...prev.footer, address: e.target.value } }))}
              className="w-full p-1.5 border rounded bg-white"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-500 block mb-1">공식 문의 이메일</label>
            <input
              type="text"
              value={data?.footer?.contactEmail || ''}
              onChange={(e) => setData((prev) => ({ ...prev, footer: { ...prev.footer, contactEmail: e.target.value } }))}
              className="w-full p-1.5 border rounded bg-white"
            />
          </div>
        </section>
      </div>
    </aside>
  );
}