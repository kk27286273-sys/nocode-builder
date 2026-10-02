'use client';

import React from 'react';
import { B2BTemplateData } from '@/data/templates';

interface EditorSidebarProps {
  data: B2BTemplateData;
  setData: React.Dispatch<React.SetStateAction<B2BTemplateData>>;
}

export default function EditorSidebar({ data, setData }: EditorSidebarProps) {
  const fs = data.fontSizes || {};

  // 기본 정보 수정
  const handleCompanyChange = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      company: { ...prev.company, [field]: value },
    }));
  };

  // 폰트 크기 수정
  const handleFontSizeChange = (key: string, value: number) => {
    setData((prev) => ({
      ...prev,
      fontSizes: {
        ...prev.fontSizes,
        [key]: value,
      },
    }));
  };

  // 히어로 섹션 수정
  const handleHeroChange = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  // 파트너스 섹션 수정
  const handlePartnerChange = (index: number, value: string) => {
    const updated = [...(data.partnersSection?.partners || [])];
    updated[index] = value;
    setData((prev) => ({
      ...prev,
      partnersSection: {
        ...prev.partnersSection,
        title: prev.partnersSection?.title || '',
        enabled: prev.partnersSection?.enabled ?? true,
        partners: updated,
      },
    }));
  };

  const addPartner = () => {
    setData((prev) => ({
      ...prev,
      partnersSection: {
        ...prev.partnersSection,
        title: prev.partnersSection?.title || '',
        enabled: prev.partnersSection?.enabled ?? true,
        partners: [...(prev.partnersSection?.partners || []), '새 협력사'],
      },
    }));
  };

  const removePartner = (index: number) => {
    setData((prev) => ({
      ...prev,
      partnersSection: {
        ...prev.partnersSection,
        title: prev.partnersSection?.title || '',
        enabled: prev.partnersSection?.enabled ?? true,
        partners: (prev.partnersSection?.partners || []).filter((_, i) => i !== index),
      },
    }));
  };

  // 실적 지표 수정
  const handleStatChange = (index: number, field: 'value' | 'label', value: string) => {
    const updated = [...data.stats];
    updated[index] = { ...updated[index], [field]: value };
    setData((prev) => ({ ...prev, stats: updated }));
  };

  const addStat = () => {
    setData((prev) => ({
      ...prev,
      stats: [...prev.stats, { value: '100+', label: '새 지표 항목' }],
    }));
  };

  const removeStat = (index: number) => {
    setData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));
  };

  // 솔루션 / 시공 분야 수정
  const handleSolutionChange = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...data.solutions];
    updated[index] = { ...updated[index], [field]: value };
    setData((prev) => ({ ...prev, solutions: updated }));
  };

  const addSolution = () => {
    setData((prev) => ({
      ...prev,
      solutions: [
        ...prev.solutions,
        { title: '새 시공 솔루션', description: '솔루션에 대한 상세 설명을 입력하세요.' },
      ],
    }));
  };

  const removeSolution = (index: number) => {
    setData((prev) => ({
      ...prev,
      solutions: prev.solutions.filter((_, i) => i !== index),
    }));
  };

  // 고객 후기 수정
  const handleReviewChange = (
    index: number,
    field: 'author' | 'role' | 'content',
    value: string
  ) => {
    const updated = [...data.reviews];
    updated[index] = { ...updated[index], [field]: value };
    setData((prev) => ({ ...prev, reviews: updated }));
  };

  const addReview = () => {
    setData((prev) => ({
      ...prev,
      reviews: [
        ...prev.reviews,
        { author: '고객명', role: '대표 / 직책', content: '서비스 만족 후기를 입력하세요.' },
      ],
    }));
  };

  const removeReview = (index: number) => {
    setData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((_, i) => i !== index),
    }));
  };

  // FAQ 수정
  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...data.faqs];
    updated[index] = { ...updated[index], [field]: value };
    setData((prev) => ({ ...prev, faqs: updated }));
  };

  const addFaq = () => {
    setData((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        { question: '새로운 질문을 입력하세요', answer: '해당 질문에 대한 상세 답변입니다.' },
      ],
    }));
  };

  const removeFaq = (index: number) => {
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  // 푸터 정보 수정
  const handleFooterChange = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      footer: { ...prev.footer, [field]: value },
    }));
  };

  return (
    <aside className="w-80 md:w-96 h-full bg-white border-r border-slate-200 flex flex-col shrink-0 z-30 shadow-sm select-none">
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-bold text-slate-900 text-lg">페이지 설정</h2>
        <p className="text-xs text-slate-500 mt-0.5">실시간으로 사이트 콘텐츠를 수정합니다.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 1. 기본 브랜드 및 색상 설정 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 border-b pb-2">기본 브랜드 설정</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">업체명 (상호)</label>
            <input
              type="text"
              value={data.company.name}
              onChange={(e) => handleCompanyChange('name', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">로고 이미지 URL</label>
            <input
              type="text"
              value={data.company.logoUrl || ''}
              onChange={(e) => handleCompanyChange('logoUrl', e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">대표 문의 전화번호</label>
            <input
              type="text"
              value={data.supportPhone}
              onChange={(e) => setData((prev) => ({ ...prev, supportPhone: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">브랜드 테마 색상</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={data.themeColor || '#0284C7'}
                onChange={(e) => setData((prev) => ({ ...prev, themeColor: e.target.value }))}
                className="w-9 h-9 p-0.5 border border-slate-200 rounded cursor-pointer"
              />
              <span className="text-xs text-slate-600 font-mono">{data.themeColor || '#0284C7'}</span>
            </div>
          </div>
        </div>

        {/* 2. 글자 크기 미세 조절 섹션 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 border-b pb-2">글자 크기 (Font Size)</h3>
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>상단 상호명 크기</span>
              <span>{fs.companyName || 20}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="32"
              value={fs.companyName || 20}
              onChange={(e) => handleFontSizeChange('companyName', Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>메인 타이틀 크기</span>
              <span>{fs.heroTitle || 36}px</span>
            </div>
            <input
              type="range"
              min="24"
              max="60"
              value={fs.heroTitle || 36}
              onChange={(e) => handleFontSizeChange('heroTitle', Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>메인 서브문구 크기</span>
              <span>{fs.heroSubtitle || 18}px</span>
            </div>
            <input
              type="range"
              min="13"
              max="24"
              value={fs.heroSubtitle || 18}
              onChange={(e) => handleFontSizeChange('heroSubtitle', Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>섹션 대표 타이틀 크기</span>
              <span>{fs.sectionTitle || 28}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="40"
              value={fs.sectionTitle || 28}
              onChange={(e) => handleFontSizeChange('sectionTitle', Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>
        </div>

        {/* 3. 메인 히어로 섹션 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 border-b pb-2">메인 히어로 배너</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">뱃지 문구</label>
            <input
              type="text"
              value={data.hero.badge || ''}
              onChange={(e) => handleHeroChange('badge', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">메인 타이틀</label>
            <textarea
              rows={3}
              value={data.hero.title}
              onChange={(e) => handleHeroChange('title', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">서브 설명</label>
            <textarea
              rows={3}
              value={data.hero.subtitle}
              onChange={(e) => handleHeroChange('subtitle', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* 4. 협력사 / 인증 배너 섹션 */}
        {data.partnersSection && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-800">협력사 / 인증 로고</h3>
              <button
                onClick={addPartner}
                className="text-xs text-sky-600 hover:text-sky-700 font-bold"
              >
                + 추가
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">섹션 제목</label>
              <input
                type="text"
                value={data.partnersSection.title}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    partnersSection: {
                      ...prev.partnersSection!,
                      title: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="space-y-2">
              {data.partnersSection.partners.map((partner, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={partner}
                    onChange={(e) => handlePartnerChange(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    onClick={() => removePartner(idx)}
                    className="text-xs text-red-500 hover:text-red-700 px-1"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. 실적 지표 섹션 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold text-slate-800">주요 실적 지표</h3>
            <button
              onClick={addStat}
              className="text-xs text-sky-600 hover:text-sky-700 font-bold"
            >
              + 추가
            </button>
          </div>
          <div className="space-y-3">
            {data.stats.map((stat, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">지표 #{idx + 1}</span>
                  <button
                    onClick={() => removeStat(idx)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="수치 (예: 99.8%, 1,200건)"
                  value={stat.value}
                  onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 font-bold"
                />
                <input
                  type="text"
                  placeholder="항목 설명 (예: 고객 만족도)"
                  value={stat.label}
                  onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 6. 시공 / 솔루션 분야 섹션 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold text-slate-800">시공 / 솔루션 분야</h3>
            <button
              onClick={addSolution}
              className="text-xs text-sky-600 hover:text-sky-700 font-bold"
            >
              + 추가
            </button>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">섹션 제목</label>
            <input
              type="text"
              value={data.solutionsSection?.title || ''}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  solutionsSection: {
                    ...prev.solutionsSection!,
                    title: e.target.value,
                  },
                }))
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="space-y-3">
            {data.solutions.map((sol, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">솔루션 #{idx + 1}</span>
                  <button
                    onClick={() => removeSolution(idx)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="솔루션 명칭"
                  value={sol.title}
                  onChange={(e) => handleSolutionChange(idx, 'title', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 font-bold"
                />
                <textarea
                  rows={2}
                  placeholder="솔루션 상세 설명"
                  value={sol.description}
                  onChange={(e) => handleSolutionChange(idx, 'description', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 7. 고객 후기 섹션 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold text-slate-800">고객 만족 후기</h3>
            <button
              onClick={addReview}
              className="text-xs text-sky-600 hover:text-sky-700 font-bold"
            >
              + 추가
            </button>
          </div>
          <div className="space-y-3">
            {data.reviews.map((rev, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">후기 #{idx + 1}</span>
                  <button
                    onClick={() => removeReview(idx)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
                <textarea
                  rows={2}
                  placeholder="후기 본문 내용"
                  value={rev.content}
                  onChange={(e) => handleReviewChange(idx, 'content', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="작성자명"
                    value={rev.author}
                    onChange={(e) => handleReviewChange(idx, 'author', e.target.value)}
                    className="w-1/2 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <input
                    type="text"
                    placeholder="소속 / 직함"
                    value={rev.role}
                    onChange={(e) => handleReviewChange(idx, 'role', e.target.value)}
                    className="w-1/2 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. 자주 묻는 질문(FAQ) 섹션 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold text-slate-800">자주 묻는 질문 (FAQ)</h3>
            <button
              onClick={addFaq}
              className="text-xs text-sky-600 hover:text-sky-700 font-bold"
            >
              + 추가
            </button>
          </div>
          <div className="space-y-3">
            {data.faqs.map((faq, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">질문 #{idx + 1}</span>
                  <button
                    onClick={() => removeFaq(idx)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="질문 (Q)"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 font-bold"
                />
                <textarea
                  rows={2}
                  placeholder="답변 (A)"
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 9. 하단 푸터 (사업자 정보) 설정 */}
        <div className="space-y-3 pt-2">
          <div className="border-b pb-2">
            <h3 className="text-sm font-bold text-slate-800">하단 푸터 정보</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">전자상거래법 필수 표기 사항</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">푸터 상호명</label>
            <input
              type="text"
              value={data.footer.companyName}
              onChange={(e) => handleFooterChange('companyName', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">대표자명</label>
            <input
              type="text"
              value={data.footer.ownerName}
              onChange={(e) => handleFooterChange('ownerName', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">사업자등록번호</label>
            <input
              type="text"
              value={data.footer.businessNumber}
              onChange={(e) => handleFooterChange('businessNumber', e.target.value)}
              placeholder="000-00-00000"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">사업장 주소</label>
            <input
              type="text"
              value={data.footer.address}
              onChange={(e) => handleFooterChange('address', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">대표 이메일</label>
            <input
              type="email"
              value={data.footer.contactEmail}
              onChange={(e) => handleFooterChange('contactEmail', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}