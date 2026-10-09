'use client';

import React, { useState } from 'react';

const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }: any) => (
  <div className="space-y-1">
    <label className="text-[11px] text-slate-500 font-medium">{label}</label>
    <input
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2 border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500 bg-white"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder = '', h = 'h-20' }: any) => (
  <div className="space-y-1">
    <label className="text-[11px] text-slate-500 font-medium">{label}</label>
    <textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full p-2 border border-slate-200 rounded text-xs ${h} resize-y outline-none focus:ring-1 focus:ring-blue-500 bg-white`}
    />
  </div>
);

interface EditorSidebarProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  siteId?: string | null;
  refreshSites?: () => void;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
}

export default function EditorSidebar({
  data,
  setData,
  siteId,
  activeSection = 'main',
  setActiveSection,
}: EditorSidebarProps) {
  const [currentTab, setCurrentTab] = useState('main');

  const active = setActiveSection ? activeSection : currentTab;
  const setTab = (tabId: string) => {
    if (setActiveSection) {
      setActiveSection(tabId);
    } else {
      setCurrentTab(tabId);
    }
  };

  const updateDeep = (path: string, value: any) => {
    const keys = path.split('.');
    setData((prev: any) => {
      const next = { ...(prev || {}) };
      let source: any = prev || {};
      let target: any = next;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const sourceValue = source?.[key];
        target[key] = Array.isArray(sourceValue)
          ? [...sourceValue]
          : { ...(sourceValue || {}) };
        source = sourceValue || {};
        target = target[key];
      }

      target[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const getValue = (path: string) =>
    path.split('.').reduce((val: any, k) => val?.[k], data);

  const getArray = (path: string): any[] => {
    const val = getValue(path);
    return Array.isArray(val) ? val : [];
  };

  const addSolutionCard = () => {
    const currentList = getArray('solutions');
    const newCard = {
      title: '새 솔루션',
      category: '신규기술',
      description: '솔루션에 대한 핵심 요약 설명을 입력하세요.',
      detailContent: '솔루션 상세 내용을 상세하게 입력하세요.',
      image: '',
    };
    updateDeep('solutions', [...currentList, newCard]);
  };

  const removeSolutionCard = (index: number) => {
    const currentList = getArray('solutions');
    updateDeep('solutions', currentList.filter((_, idx) => idx !== index));
  };

  const sections = [
    { id: 'main', label: '메인 화면' },
    { id: 'about', label: '회사 소개' },
    { id: 'sol_detail', label: '사업 소개' },
    { id: 'esg', label: '지속가능경영' },
    { id: 'pr', label: '홍보 센터' },
    { id: 'recruit', label: '인재 경영' },
    { id: 'cs', label: '고객 센터' },
    { id: 'footer', label: '하단 정보' },
  ];

  return (
    <div className="flex w-full h-full bg-white overflow-hidden">
      {/* 탭 네비게이션 */}
      <div className="w-36 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setTab(section.id)}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-bold transition-all ${
                active === section.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 설정 폼 영역 */}
      <div className="flex-1 min-w-0 overflow-y-auto p-4 bg-slate-50">
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-slate-800">
              {sections.find((sec) => sec.id === active)?.label} 설정
            </h3>
          </div>

          {/* 1. 메인 화면 */}
          {active === 'main' && (
            <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200">
              <InputField
                label="메인 배지"
                value={getValue('hero.badge')}
                onChange={(val: string) => updateDeep('hero.badge', val)}
              />
              <InputField
                label="메인 타이틀"
                value={getValue('hero.title')}
                onChange={(val: string) => updateDeep('hero.title', val)}
              />
              <TextAreaField
                label="메인 서브 타이틀"
                value={getValue('hero.subtitle')}
                onChange={(val: string) => updateDeep('hero.subtitle', val)}
                h="h-20"
              />
            </div>
          )}

          {/* 2. 회사 소개 */}
          {active === 'about' && (
            <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200">
              <InputField
                label="회사명"
                value={getValue('company.name')}
                onChange={(val: string) => updateDeep('company.name', val)}
              />
              <InputField
                label="회사 로고 URL"
                value={getValue('company.logoUrl')}
                onChange={(val: string) => updateDeep('company.logoUrl', val)}
              />
              <InputField
                label="대표자 인사말 타이틀"
                value={getValue('corporateInfo.ceoGreeting.title')}
                onChange={(val: string) => updateDeep('corporateInfo.ceoGreeting.title', val)}
              />
              <TextAreaField
                label="대표자 인사말 본문"
                value={getValue('corporateInfo.ceoGreeting.content')}
                onChange={(val: string) => updateDeep('corporateInfo.ceoGreeting.content', val)}
                h="h-28"
              />
              <InputField
                label="핵심 비전"
                value={getValue('corporateInfo.missionVision.vision')}
                onChange={(val: string) => updateDeep('corporateInfo.missionVision.vision', val)}
              />
            </div>
          )}

          {/* 3. 사업 소개 (솔루션) */}
          {active === 'sol_detail' && (
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-xs text-blue-600">사업 소개 상단 대표 정보</div>
                <InputField
                  label="상단 대표 제목"
                  value={getValue('solutionMain.title')}
                  onChange={(val: string) => updateDeep('solutionMain.title', val)}
                />
                <TextAreaField
                  label="상단 요약 설명"
                  value={getValue('solutionMain.description')}
                  onChange={(val: string) => updateDeep('solutionMain.description', val)}
                />
                <TextAreaField
                  label="상세 대표 내용"
                  value={getValue('solutionMain.detailContent')}
                  onChange={(val: string) => updateDeep('solutionMain.detailContent', val)}
                  h="h-24"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-xs text-slate-700">하단 카드 목록</div>
                  <button
                    type="button"
                    onClick={addSolutionCard}
                    className="text-[11px] bg-blue-600 text-white px-2.5 py-1 rounded font-bold hover:bg-blue-700"
                  >
                    + 카드 추가
                  </button>
                </div>

                {getArray('solutions').map((solution: any, idx: number) => (
                  <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => removeSolutionCard(idx)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 text-xs font-bold"
                    >
                      ✕
                    </button>
                    <div className="font-bold text-[11px] text-blue-600">카드 {idx + 1}</div>
                    <InputField
                      label="카드 제목"
                      value={solution.title}
                      onChange={(val: string) => updateDeep(`solutions.${idx}.title`, val)}
                    />
                    <TextAreaField
                      label="카드 요약 설명"
                      value={solution.description}
                      onChange={(val: string) => updateDeep(`solutions.${idx}.description`, val)}
                      h="h-16"
                    />
                    <TextAreaField
                      label="카드 상세 내용"
                      value={solution.detailContent || solution.detailedFeatures?.[0]?.featureContent || ''}
                      onChange={(val: string) => updateDeep(`solutions.${idx}.detailContent`, val)}
                      h="h-24"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. 지속가능경영 */}
          {active === 'esg' && (
            <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200">
              <InputField
                label="환경경영 제목"
                value={getValue('corporateInfo.esg.environmental.title')}
                onChange={(val: string) => updateDeep('corporateInfo.esg.environmental.title', val)}
              />
              <TextAreaField
                label="환경경영 내용"
                value={getValue('corporateInfo.esg.environmental.content')}
                onChange={(val: string) => updateDeep('corporateInfo.esg.environmental.content', val)}
              />
              <InputField
                label="사회공헌 제목"
                value={getValue('corporateInfo.esg.social.title')}
                onChange={(val: string) => updateDeep('corporateInfo.esg.social.title', val)}
              />
              <TextAreaField
                label="사회공헌 내용"
                value={getValue('corporateInfo.esg.social.content')}
                onChange={(val: string) => updateDeep('corporateInfo.esg.social.content', val)}
              />
            </div>
          )}

          {/* 5. 홍보 센터 */}
          {active === 'pr' && (
            <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500">홍보센터 뉴스 및 공지사항 데이터가 표시됩니다.</div>
              <InputField
                label="최신 뉴스 대표 제목"
                value={getValue('prCenter.news.0.title')}
                onChange={(val: string) => updateDeep('prCenter.news.0.title', val)}
              />
              <TextAreaField
                label="최신 뉴스 대표 요약"
                value={getValue('prCenter.news.0.summary')}
                onChange={(val: string) => updateDeep('prCenter.news.0.summary', val)}
              />
              <InputField
                label="대표 공지사항 제목"
                value={getValue('prCenter.notice.0.title')}
                onChange={(val: string) => updateDeep('prCenter.notice.0.title', val)}
              />
            </div>
          )}

          {/* 6. 인재 경영 */}
          {active === 'recruit' && (
            <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200">
              <TextAreaField
                label="인재상"
                value={getValue('recruit.talentValue') || getValue('talentValue')}
                onChange={(val: string) => {
                  updateDeep('recruit.talentValue', val);
                  updateDeep('talentValue', val);
                }}
                h="h-28"
              />
              <TextAreaField
                label="복지 및 혜택"
                value={getValue('recruit.benefitInfo') || getValue('benefitInfo')}
                onChange={(val: string) => {
                  updateDeep('recruit.benefitInfo', val);
                  updateDeep('benefitInfo', val);
                }}
                h="h-28"
              />
            </div>
          )}

          {/* 7. 고객 센터 */}
          {active === 'cs' && (
            <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200">
              <InputField
                label="고객센터 전화번호"
                value={getValue('supportPhone') || getValue('csCenter.contactInfo.phone')}
                onChange={(val: string) => {
                  updateDeep('supportPhone', val);
                  updateDeep('csCenter.contactInfo.phone', val);
                }}
              />
              <InputField
                label="상담 가능 시간 가이드"
                value={getValue('csGuide')}
                onChange={(val: string) => updateDeep('csGuide', val)}
              />
            </div>
          )}

          {/* 8. 하단 정보 */}
          {active === 'footer' && (
            <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200">
              <InputField
                label="사업자 등록번호"
                value={getValue('footer.businessNumber')}
                onChange={(val: string) => updateDeep('footer.businessNumber', val)}
              />
              <InputField
                label="대표자명"
                value={getValue('footer.ownerName')}
                onChange={(val: string) => updateDeep('footer.ownerName', val)}
              />
              <InputField
                label="사업장 주소"
                value={getValue('footer.address')}
                onChange={(val: string) => updateDeep('footer.address', val)}
              />
              <InputField
                label="대표 이메일"
                value={getValue('footer.contactEmail')}
                onChange={(val: string) => updateDeep('footer.contactEmail', val)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}