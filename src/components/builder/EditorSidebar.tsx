// src/components/EditorSidebar.tsx

'use client';

import React, { useState } from 'react';
import { InputField, TextAreaField } from './editor/FormControls';
import ImageUploadField from './editor/ImageUploadField';
import NavigationEditor from './editor/NavigationEditor';

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
    if (setActiveSection) setActiveSection(tabId);
    else setCurrentTab(tabId);
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
          : sourceValue && typeof sourceValue === 'object'
          ? { ...sourceValue }
          : {};
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

  // ===== 공통 함수 =====
  const addHistory = () => {
    updateDeep('corporateInfo.history', [...getArray('corporateInfo.history'), { year: '', event: '' }]);
  };
  const removeHistory = (index: number) => {
    updateDeep('corporateInfo.history', getArray('corporateInfo.history').filter((_, i) => i !== index));
  };

  const addOpenPosition = () => {
    updateDeep('recruit.openPositions', [
      ...getArray('recruit.openPositions'),
      { title: '', department: '', deadline: '', link: '' },
    ]);
  };
  const removeOpenPosition = (index: number) => {
    updateDeep('recruit.openPositions', getArray('recruit.openPositions').filter((_, i) => i !== index));
  };

  const addSolutionCard = () => {
    updateDeep('solutions', [
      ...getArray('solutions'),
      { title: '새 솔루션', category: '신규기술', description: '', detailContent: '', image: '' },
    ]);
  };
  const removeSolutionCard = (index: number) => {
    updateDeep('solutions', getArray('solutions').filter((_, i) => i !== index));
  };

  const addProject = () => {
    updateDeep('projects', [
      ...getArray('projects'),
      { name: '새 프로젝트', area: '', tags: [], duration: '', beforeImage: '', afterImage: '', description: '', images: [] },
    ]);
  };
  const removeProject = (index: number) => {
    updateDeep('projects', getArray('projects').filter((_, i) => i !== index));
  };

  const addService = () => {
    updateDeep('services', [
      ...getArray('services'),
      { icon: '🏠', title: '새 서비스', description: '' },
    ]);
  };
  const removeService = (index: number) => {
    updateDeep('services', getArray('services').filter((_, i) => i !== index));
  };

  const addProcess = () => {
    updateDeep('process', [
      ...getArray('process'),
      { step: getArray('process').length + 1, title: '', description: '' },
    ]);
  };
  const removeProcess = (index: number) => {
    updateDeep('process', getArray('process').filter((_, i) => i !== index));
  };

  const addMembership = () => {
    updateDeep('memberships', [
      ...getArray('memberships'),
      { id: Date.now().toString(), name: '새 이용권', price: 0, duration: 1, classes: 0, features: [], popular: false },
    ]);
  };
  const removeMembership = (index: number) => {
    updateDeep('memberships', getArray('memberships').filter((_, i) => i !== index));
  };

  const addSuccessCase = () => {
    updateDeep('successCases', [
      ...getArray('successCases'),
      { category: '신규', title: '새 사례', year: new Date().getFullYear().toString(), result: '', description: '' },
    ]);
  };
  const removeSuccessCase = (index: number) => {
    updateDeep('successCases', getArray('successCases').filter((_, i) => i !== index));
  };

  const addDisclosure = () => {
    updateDeep('corporateInfo.disclosure.certifications', [
      ...getArray('corporateInfo.disclosure.certifications'),
      { name: '새 인증', date: '', image: '' },
    ]);
  };
  const removeDisclosure = (index: number) => {
    updateDeep('corporateInfo.disclosure.certifications', getArray('corporateInfo.disclosure.certifications').filter((_, i) => i !== index));
  };

// ===== 섹션 공개·비공개 토글 (법률형) =====
const VisibilityToggle = ({ sectionKey, label }: { sectionKey: string; label: string }) => {
  const visible = getValue(`sectionsVisible.${sectionKey}`) !== false;
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div>
        <p className="text-xs font-bold text-slate-800">{label} 공개</p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {visible ? '사이트에 노출됩니다.' : '비공개 — 표시되지 않습니다.'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => updateDeep(`sectionsVisible.${sectionKey}`, !visible)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          visible ? 'bg-blue-600' : 'bg-slate-300'
        }`}
        aria-pressed={visible}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            visible ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
};

  // ===== 템플릿 타입 확인 =====
  const templateType = data?.templateType;
  const isInterior = templateType === 'interior' || templateType === 'onepage';

  // ===== 섹션 목록 (템플릿별) =====
  const sections = isInterior
    ? [
        { id: 'main', label: '히어로' },
        { id: 'projects', label: '시공 사례' },
        { id: 'services', label: '서비스' },
        { id: 'process', label: '시공 절차' },
        { id: 'estimate', label: '견적 문의' },
        { id: 'contact', label: '연락처' },
        { id: 'footer', label: '하단 정보' },
      ]
    : templateType === 'legal'
    ? [
        { id: 'main', label: '메인 화면' },
        { id: 'services', label: '서비스' },
        { id: 'successCases', label: '성공 사례' },
        { id: 'contact', label: '연락처' },
        { id: 'footer', label: '하단 정보' },
      ]
    : templateType === 'fitness'
    ? [
        { id: 'main', label: '메인 화면' },
        { id: 'services', label: '클래스' },
        { id: 'memberships', label: '이용권' },
        { id: 'contact', label: '연락처' },
        { id: 'footer', label: '하단 정보' },
        { id: 'visibility', label: '공개·비공개' },
      ]
  : [
      { id: 'main', label: '메인 화면' },
      { id: 'about', label: '회사 소개' },
      { id: 'sol_detail', label: '사업 소개' },
      { id: 'esg', label: '지속가능경영' },
      { id: 'pr', label: '홍보 센터' },
      { id: 'recruit', label: '인재 경영' },
      { id: 'cs', label: '고객 센터' },
      { id: 'navigation', label: '상단 메뉴' },
      { id: 'footer', label: '하단 정보' },
    ];

  return (
    <div className="flex h-full w-full overflow-hidden bg-white">
      {/* 탭 네비게이션 */}
      <div className="flex w-36 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {sections.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setTab(sec.id)}
              className={`w-full rounded-md px-3 py-2.5 text-left text-xs font-bold transition-all ${
                active === sec.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 설정 폼 본문 */}
      <div className="min-w-0 flex-1 overflow-y-auto bg-slate-50 p-4">
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-slate-800">
              {sections.find((s) => s.id === active)?.label} 설정
            </h3>
          </div>

{/* ===== 법률형 섹션 ===== */}
{templateType === 'legal' && (
  <>
    {/* 1. 메인 */}
    {active === 'main' && (
      <div className="space-y-4">
        <VisibilityToggle sectionKey="hero" label="메인 히어로" />

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          <InputField
            label="메인 제목"
            value={getValue('hero.title')}
            onChange={(v) => updateDeep('hero.title', v)}
            placeholder="신뢰할 수 있는 법률 파트너"
          />

          <InputField
            label="메인 뱃지"
            value={getValue('hero.badge')}
            onChange={(v) => updateDeep('hero.badge', v)}
            placeholder="LAW & TAX"
          />

          <TextAreaField
            label="설명"
            value={getValue('hero.subtitle')}
            onChange={(v) => updateDeep('hero.subtitle', v)}
            placeholder="의뢰인의 권리를 지키는 전문적인 법률 서비스"
          />
        </div>
      </div>
    )}

    {/* 2. 서비스 */}
    {active === 'services' && (
      <div className="space-y-4">
        <VisibilityToggle sectionKey="services" label="서비스" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              서비스 목록
            </span>

            <button
              type="button"
              onClick={() =>
                updateDeep('services', [
                  ...getArray('services'),
                  {
                    icon: '⚖️',
                    title: '새 서비스',
                    description: '',
                  },
                ])
              }
              className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
            >
              + 서비스 추가
            </button>
          </div>

          {getArray('services').map((item: any, idx: number) => (
            <div
              key={idx}
              className="relative space-y-2 rounded-xl border border-slate-200 bg-white p-4"
            >
              <button
                type="button"
                onClick={() =>
                  updateDeep(
                    'services',
                    getArray('services').filter((_, i) => i !== idx)
                  )
                }
                className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-500"
              >
                ×
              </button>

              <InputField
                label="아이콘"
                value={item?.icon || ''}
                onChange={(v) =>
                  updateDeep(`services.${idx}.icon`, v)
                }
                placeholder="⚖️"
              />

              <InputField
                label="서비스명"
                value={item?.title || ''}
                onChange={(v) =>
                  updateDeep(`services.${idx}.title`, v)
                }
              />

              <TextAreaField
                label="서비스 설명"
                value={item?.description || ''}
                onChange={(v) =>
                  updateDeep(`services.${idx}.description`, v)
                }
                h="h-20"
              />
            </div>
          ))}
        </div>
      </div>
    )}

    {/* 3. 성공 사례 */}
    {active === 'successCases' && (
      <div className="space-y-4">
        <VisibilityToggle sectionKey="successCases" label="성공 사례" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              성공 사례 목록
            </span>

            <button
              type="button"
              onClick={addSuccessCase}
              className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
            >
              + 사례 추가
            </button>
          </div>

          {getArray('successCases').map((item: any, idx: number) => (
            <div
              key={idx}
              className="relative space-y-2 rounded-xl border border-slate-200 bg-white p-4"
            >
              <button
                type="button"
                onClick={() => removeSuccessCase(idx)}
                className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-500"
              >
                ×
              </button>

              <InputField
                label="분야"
                value={item?.category || ''}
                onChange={(v) =>
                  updateDeep(`successCases.${idx}.category`, v)
                }
                placeholder="세무, 노무, 법무"
              />

              <InputField
                label="사례명"
                value={item?.title || ''}
                onChange={(v) =>
                  updateDeep(`successCases.${idx}.title`, v)
                }
              />

              <InputField
                label="연도"
                value={item?.year || ''}
                onChange={(v) =>
                  updateDeep(`successCases.${idx}.year`, v)
                }
                placeholder="2024"
              />

              <InputField
                label="결과"
                value={item?.result || ''}
                onChange={(v) =>
                  updateDeep(`successCases.${idx}.result`, v)
                }
                placeholder="절세액 3.2억 원"
              />

              <TextAreaField
                label="상세 설명"
                value={item?.description || ''}
                onChange={(v) =>
                  updateDeep(`successCases.${idx}.description`, v)
                }
                h="h-20"
              />
            </div>
          ))}
        </div>
      </div>
    )}

    {/* 4. 연락처 */}
    {active === 'contact' && (
      <div className="space-y-4">
        <VisibilityToggle sectionKey="consult" label="상담 폼" />

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          <InputField
            label="이메일"
            value={getValue('csCenter.contactInfo.email')}
            onChange={(v) => updateDeep('csCenter.contactInfo.email', v)}
          />
          <InputField
            label="전화"
            value={getValue('csCenter.contactInfo.phone')}
            onChange={(v) => updateDeep('csCenter.contactInfo.phone', v)}
          />
          <InputField
            label="주소"
            value={getValue('csCenter.contactInfo.address')}
            onChange={(v) => updateDeep('csCenter.contactInfo.address', v)}
          />
        </div>
      </div>
    )}

    {/* 5. 하단 정보 */}
    {active === 'footer' && (
      <div className="space-y-4">
        <VisibilityToggle sectionKey="footer" label="하단 정보" />

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          <InputField
            label="회사명"
            value={getValue('footer.companyName')}
            onChange={(v) => updateDeep('footer.companyName', v)}
          />
          <InputField
            label="주소"
            value={getValue('footer.address')}
            onChange={(v) => updateDeep('footer.address', v)}
          />
        </div>
      </div>
    )}
  </>
)}
          {/* ===== 피트니스형 섹션 ===== */}
          {templateType === 'fitness' && (
            <>
              {/* 1. 메인 */}
              {active === 'main' && (
                <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                  <InputField
                    label="메인 제목"
                    value={getValue('hero.title')}
                    onChange={(v) => updateDeep('hero.title', v)}
                    placeholder="건강한 변화를 시작하세요"
                  />
                  <TextAreaField
                    label="설명"
                    value={getValue('hero.subtitle')}
                    onChange={(v) => updateDeep('hero.subtitle', v)}
                    placeholder="전문 코치와 함께하는 맞춤형 운동 프로그램"
                  />
                </div>
              )}

              {/* 2. 클래스 */}
              {active === 'services' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">클래스</span>
                    <button
                      type="button"
                      onClick={addService}
                      className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
                    >
                      + 클래스 추가
                    </button>
                  </div>
                  {getArray('services').map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="relative space-y-2 rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <button
                        type="button"
                        onClick={() => removeService(idx)}
                        className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-500"
                      >
                        ×
                      </button>
                      <InputField
                        label="클래스명"
                        value={item.title}
                        onChange={(v) => updateDeep(`services.${idx}.title`, v)}
                      />
                      <TextAreaField
                        label="설명"
                        value={item.description}
                        onChange={(v) => updateDeep(`services.${idx}.description`, v)}
                        h="h-16"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 3. 이용권 */}
              {active === 'memberships' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">이용권</span>
                    <button
                      type="button"
                      onClick={addMembership}
                      className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
                    >
                      + 이용권 추가
                    </button>
                  </div>
                  {getArray('memberships').map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="relative space-y-2 rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <button
                        type="button"
                        onClick={() => removeMembership(idx)}
                        className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-500"
                      >
                        ×
                      </button>

                      <InputField
                        label="이용권명"
                        value={item?.name || ''}
                        onChange={(v) =>
                          updateDeep(`memberships.${idx}.name`, v)
                        }
                        placeholder="월간 기본"
                      />

                      <InputField
                        label="가격 (원)"
                        type="number"
                        value={item?.price || 0}
                        onChange={(v) =>
                          updateDeep(`memberships.${idx}.price`, parseInt(v) || 0)
                        }
                      />

                      <InputField
                        label="기간 (개월)"
                        type="number"
                        value={item?.duration || 1}
                        onChange={(v) =>
                          updateDeep(`memberships.${idx}.duration`, parseInt(v) || 1)
                        }
                      />

                      <InputField
                        label="클래스 횟수"
                        type="number"
                        value={item?.classes || 0}
                        onChange={(v) =>
                          updateDeep(`memberships.${idx}.classes`, parseInt(v) || 0)
                        }
                        placeholder="무제한은 999"
                      />

                      <TextAreaField
                        label="특징 (줄바꿈으로 구분)"
                        value={(item?.features || []).join('\n')}
                        onChange={(v) =>
                          updateDeep(
                            `memberships.${idx}.features`,
                            v.split('\n').filter((f: string) => f.trim())
                          )
                        }
                        h="h-20"
                        placeholder="무제한 시설 이용&#10;월 12회 클래스&#10;기본 운동 상담"
                      />

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item?.popular || false}
                          onChange={(e) =>
                            updateDeep(`memberships.${idx}.popular`, e.target.checked)
                          }
                          className="rounded"
                        />
                        <span className="text-xs font-semibold text-slate-700">인기 이용권으로 표시</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. 연락처 */}
              {active === 'contact' && (
                <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                  <InputField
                    label="이메일"
                    value={getValue('csCenter.contactInfo.email')}
                    onChange={(v) => updateDeep('csCenter.contactInfo.email', v)}
                  />
                  <InputField
                    label="전화"
                    value={getValue('csCenter.contactInfo.phone')}
                    onChange={(v) => updateDeep('csCenter.contactInfo.phone', v)}
                  />
                  <InputField
                    label="주소"
                    value={getValue('csCenter.contactInfo.address')}
                    onChange={(v) => updateDeep('csCenter.contactInfo.address', v)}
                  />
                </div>
              )}

              {/* 5. 섹션 공개·비공개 설정 */}
              {active === 'visibility' && (
                <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs text-slate-600 mb-4">
                    각 섹션의 공개 여부를 설정하세요. 비공개로 설정한 섹션은 뷰어에 표시되지 않습니다.
                  </p>
                  <div className="space-y-3">
                    {[
                      { key: 'hero', label: '메인 화면' },
                      { key: 'about', label: '소개' },
                      { key: 'classes', label: '클래스' },
                      { key: 'memberships', label: '이용권' },
                      { key: 'schedule', label: '운영 시간' },
                      { key: 'location', label: '위치 & 연락처' },
                      { key: 'cta', label: '최종 CTA' },
                      { key: 'footer', label: '푸터' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={getValue(`sectionsVisible.${item.key}`) !== false}
                          onChange={(e) =>
                            updateDeep(`sectionsVisible.${item.key}`, e.target.checked ? true : false)
                          }
                          className="rounded w-4 h-4"
                        />
                        <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. 하단 정보 */}
              {active === 'footer' && (
                <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                  <InputField
                    label="회사명"
                    value={getValue('footer.companyName')}
                    onChange={(v) => updateDeep('footer.companyName', v)}
                  />
                  <InputField
                    label="주소"
                    value={getValue('footer.address')}
                    onChange={(v) => updateDeep('footer.address', v)}
                  />
                </div>
              )}
            </>
          )}

{/* ===== 인테리어/원페이지 섹션 ===== */}
{isInterior && (
  <>
    {/* 1. 히어로 */}
    {active === 'main' && (
      <div className="space-y-4">
        <VisibilityToggle sectionKey="hero" label="메인 히어로" />

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          <InputField
            label="메인 제목"
            value={getValue('hero.title')}
            onChange={(v) => updateDeep('hero.title', v)}
            placeholder="당신의 꿈의 공간을 만듭니다"
          />
          <TextAreaField
            label="설명"
            value={getValue('hero.subtitle')}
            onChange={(v) => updateDeep('hero.subtitle', v)}
            placeholder="전문적인 시공으로 가치 있는 인테리어"
          />
          <ImageUploadField
            label="히어로 배경 이미지"
            value={getValue('hero.mediaUrl') || ''}
            onChange={(result) => updateDeep('hero.mediaUrl', result?.url || '')}
            siteId={siteId}
            purpose="general"
          />
        </div>
      </div>
    )}

    {/* 2. 시공 사례 */}
    {active === 'projects' && (
      <div className="space-y-4">
        <VisibilityToggle sectionKey="projects" label="시공 사례" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">시공 사례</span>
            <button
              type="button"
              onClick={addProject}
              className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
            >
              + 사례 추가
            </button>
          </div>
          {getArray('projects').map((item: any, idx: number) => (
            <div
              key={idx}
              className="relative space-y-2 rounded-xl border border-slate-200 bg-white p-4"
            >
              <button
                type="button"
                onClick={() => removeProject(idx)}
                className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-500"
              >
                ×
              </button>
              <InputField
                label="프로젝트명"
                value={item.name}
                onChange={(v) => updateDeep(`projects.${idx}.name`, v)}
              />
              <InputField
                label="평수"
                value={item.area}
                onChange={(v) => updateDeep(`projects.${idx}.area`, v)}
                placeholder="예: 84㎡"
              />
              <InputField
                label="시공 기간"
                value={item.duration}
                onChange={(v) => updateDeep(`projects.${idx}.duration`, v)}
                placeholder="예: 3개월"
              />
              <InputField
                label="태그 (쉼표로 구분)"
                value={(item.tags || []).join(', ')}
                onChange={(v) => updateDeep(`projects.${idx}.tags`, v.split(',').map((t: string) => t.trim()))}
                placeholder="풀리모델링, 거실"
              />
              <TextAreaField
                label="설명"
                value={item.description || ''}
                onChange={(v) => updateDeep(`projects.${idx}.description`, v)}
                h="h-16"
              />
              <ImageUploadField
                label="Before 이미지"
                value={item.beforeImage || ''}
                onChange={(result) => updateDeep(`projects.${idx}.beforeImage`, result?.url || '')}
                siteId={siteId}
                purpose="general"
              />
              <ImageUploadField
                label="After 이미지"
                value={item.afterImage || ''}
                onChange={(result) => updateDeep(`projects.${idx}.afterImage`, result?.url || '')}
                siteId={siteId}
                purpose="general"
              />
            </div>
          ))}
        </div>
      </div>
    )}

    {/* 3. 서비스 */}
    {active === 'services' && (
      <div className="space-y-4">
        <VisibilityToggle sectionKey="services" label="서비스" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">서비스</span>
            <button
              type="button"
              onClick={addService}
              className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
            >
              + 서비스 추가
            </button>
          </div>
          {getArray('services').map((item: any, idx: number) => (
            <div
              key={idx}
              className="relative space-y-2 rounded-xl border border-slate-200 bg-white p-4"
            >
              <button
                type="button"
                onClick={() => removeService(idx)}
                className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-500"
              >
                ×
              </button>
              <InputField
                label="아이콘 (이모지)"
                value={item.icon || ''}
                onChange={(v) => updateDeep(`services.${idx}.icon`, v)}
                placeholder="🏠"
              />
              <InputField
                label="제목"
                value={item.title}
                onChange={(v) => updateDeep(`services.${idx}.title`, v)}
              />
              <TextAreaField
                label="설명"
                value={item.description}
                onChange={(v) => updateDeep(`services.${idx}.description`, v)}
                h="h-16"
              />
            </div>
          ))}
        </div>
      </div>
    )}

    {/* 4. 시공 절차 */}
    {active === 'process' && (
      <div className="space-y-4">
        <VisibilityToggle sectionKey="process" label="시공 절차" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">시공 절차</span>
            <button
              type="button"
              onClick={addProcess}
              className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
            >
              + 단계 추가
            </button>
          </div>
          {getArray('process').map((item: any, idx: number) => (
            <div
              key={idx}
              className="relative space-y-2 rounded-xl border border-slate-200 bg-white p-4"
            >
              <button
                type="button"
                onClick={() => removeProcess(idx)}
                className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-500"
              >
                ×
              </button>
              <InputField
                label="단계 번호"
                type="number"
                value={item.step}
                onChange={(v) => updateDeep(`process.${idx}.step`, parseInt(v))}
              />
              <InputField
                label="제목"
                value={item.title}
                onChange={(v) => updateDeep(`process.${idx}.title`, v)}
              />
              <TextAreaField
                label="설명"
                value={item.description}
                onChange={(v) => updateDeep(`process.${idx}.description`, v)}
                h="h-16"
              />
            </div>
          ))}
        </div>
      </div>
    )}

    {/* 5. 견적 문의 */}
    {active === 'estimate' && (
      <div className="space-y-4">
        <VisibilityToggle sectionKey="estimate" label="견적 문의 폼" />

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-600">
            견적 문의 폼은 프리뷰에서 자동으로 렌더링됩니다. 추가 설정이 필요하면 알려주세요.
          </p>
        </div>
      </div>
    )}

    {/* 6. 연락처 */}
    {active === 'contact' && (
      <div className="space-y-4">
        <VisibilityToggle sectionKey="contact" label="연락처" />

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          <InputField
            label="이메일"
            value={getValue('csCenter.contactInfo.email')}
            onChange={(v) => updateDeep('csCenter.contactInfo.email', v)}
          />
          <InputField
            label="전화"
            value={getValue('csCenter.contactInfo.phone')}
            onChange={(v) => updateDeep('csCenter.contactInfo.phone', v)}
          />
          <InputField
            label="주소"
            value={getValue('csCenter.contactInfo.address')}
            onChange={(v) => updateDeep('csCenter.contactInfo.address', v)}
          />
        </div>
      </div>
    )}

    {/* 7. 하단 정보 */}
    {active === 'footer' && (
      <div className="space-y-4">
        <VisibilityToggle sectionKey="footer" label="하단 정보" />

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          <InputField
            label="회사명"
            value={getValue('footer.companyName')}
            onChange={(v) => updateDeep('footer.companyName', v)}
          />
          <InputField
            label="주소"
            value={getValue('footer.address')}
            onChange={(v) => updateDeep('footer.address', v)}
          />
          <InputField
            label="사업자등록번호"
            value={getValue('footer.businessNumber')}
            onChange={(v) => updateDeep('footer.businessNumber', v)}
          />
        </div>
      </div>
    )}
  </>
)}
          {/* ===== 기업형 섹션 ===== */}
          {!isInterior && templateType !== 'legal' && templateType !== 'fitness' && (
            <>
              {/* 1. 메인 */}
              {active === 'main' && (
                <div className="space-y-4">
                  <VisibilityToggle sectionKey="hero" label="메인 히어로" />
                  <VisibilityToggle sectionKey="mainSolutions" label="홈 - Solutions 영역" />

                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField label="메인 배지" value={getValue('hero.badge')} onChange={(v) => updateDeep('hero.badge', v)} />
                    <InputField label="메인 타이틀" value={getValue('hero.title')} onChange={(v) => updateDeep('hero.title', v)} />
                    <TextAreaField label="메인 서브 타이틀" value={getValue('hero.subtitle')} onChange={(v) => updateDeep('hero.subtitle', v)} />
                    <ImageUploadField
                      label="메인 히어로 배경 이미지"
                      value={getValue('hero.mediaUrl') || ''}
                      onChange={(result) => {
                        updateDeep('hero.mediaUrl', result?.url || '');
                        updateDeep('hero.mediaSrcSet', result?.srcSet || '');
                      }}
                      siteId={siteId}
                      purpose="general"
                    />
                  </div>
                </div>
              )}

              {/* 2. 회사 소개 */}
              {active === 'about' && (
                <div className="space-y-4">
                  <VisibilityToggle sectionKey="corporateInfo" label="기업 소개" />

                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField label="회사명" value={getValue('company.name')} onChange={(v) => updateDeep('company.name', v)} />
                    <InputField
                      label="대표이사 성명"
                      value={getValue('corporateInfo.representativeName') || getValue('footer.ownerName')}
                      onChange={(v) => {
                        updateDeep('corporateInfo.representativeName', v);
                        updateDeep('corporateInfo.ceoGreeting.name', v);
                        updateDeep('footer.ownerName', v);
                      }}
                    />
                    <ImageUploadField
                      label="회사 로고 (GNB)"
                      value={getValue('company.logoUrl') || ''}
                      onChange={(result) => {
                        updateDeep('company.logoUrl', result?.url || '');
                        updateDeep('company.logoSrcSet', result?.srcSet || '');
                      }}
                      siteId={siteId}
                      purpose="logo"
                    />
                    <ImageUploadField
                      label="대표이사 사진 (소개 페이지)"
                      value={getValue('corporateInfo.ceoGreeting.image') || ''}
                      onChange={(result) => updateDeep('corporateInfo.ceoGreeting.image', result?.url || '')}
                      siteId={siteId}
                      purpose="general"
                    />
                    <InputField label="슬로건" value={getValue('corporateInfo.about')} onChange={(v) => updateDeep('corporateInfo.about', v)} />
                    <InputField
                      label="핵심 비전"
                      value={getValue('corporateInfo.vision') || getValue('corporateInfo.missionVision.vision')}
                      onChange={(v) => {
                        updateDeep('corporateInfo.vision', v);
                        updateDeep('corporateInfo.missionVision.vision', v);
                      }}
                    />
                    <TextAreaField
                      label="대표 인사말"
                      value={getValue('corporateInfo.ceoMessage') || getValue('corporateInfo.ceoGreeting.content')}
                      onChange={(v) => {
                        updateDeep('corporateInfo.ceoMessage', v);
                        updateDeep('corporateInfo.ceoGreeting.content', v);
                      }}
                      h="h-32"
                    />

                    {/* 연혁 섹션 */}
                    <div className="space-y-3 border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-700">회사 연혁</h4>
                        <button type="button" onClick={addHistory} className="rounded bg-blue-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-blue-700">
                          + 연혁 추가
                        </button>
                      </div>
                      {getArray('corporateInfo.history').map((item: any, idx: number) => (
                        <div key={idx} className="relative space-y-2 rounded-lg border border-slate-200 p-3">
                          <button type="button" onClick={() => removeHistory(idx)} className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-600">
                            삭제
                          </button>
                          <InputField label="연도" value={item?.year} onChange={(v) => updateDeep(`corporateInfo.history.${idx}.year`, v)} />
                          <TextAreaField label="내용" value={item?.event} onChange={(v) => updateDeep(`corporateInfo.history.${idx}.event`, v)} h="h-16" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. 사업 소개 */}
              {active === 'sol_detail' && (
                <div className="space-y-4">
                  <VisibilityToggle sectionKey="solutions" label="사업 소개" />

                  <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField label="대표 제목" value={getValue('solutionMain.title')} onChange={(v) => updateDeep('solutionMain.title', v)} />
                    <TextAreaField label="대표 요약" value={getValue('solutionMain.description')} onChange={(v) => updateDeep('solutionMain.description', v)} />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">솔루션 카드 목록</span>
                      <button type="button" onClick={addSolutionCard} className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700">
                        + 카드 추가
                      </button>
                    </div>
                    {getArray('solutions').map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="relative space-y-2 rounded-xl border border-slate-200 bg-white p-4"
                      >
                        <button
                          type="button"
                          onClick={() => removeSolutionCard(idx)}
                          className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-500"
                        >
                          ×
                        </button>

                        <InputField
                          label="카드 제목"
                          value={item.title}
                          onChange={(v) => updateDeep(`solutions.${idx}.title`, v)}
                        />

                        <TextAreaField
                          label="요약 설명"
                          value={item.description}
                          onChange={(v) => updateDeep(`solutions.${idx}.description`, v)}
                          h="h-16"
                        />

                        <TextAreaField
                          label="상세 설명"
                          value={item.detailContent || ''}
                          onChange={(v) => updateDeep(`solutions.${idx}.detailContent`, v)}
                        />

                        <ImageUploadField
                          label="솔루션 이미지"
                          value={item.image || ''}
                          onChange={(result) => {
                            updateDeep(`solutions.${idx}.image`, result?.url || '');
                            updateDeep(`solutions.${idx}.imageSrcSet`, result?.srcSet || '');
                          }}
                          siteId={siteId}
                          purpose="solution"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. 공시 정보 */}
              {active === 'disclosure' && (
                <div className="space-y-4">
                  <VisibilityToggle sectionKey="disclosure" label="공시 정보" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">인증 및 공시</span>
                      <button type="button" onClick={addDisclosure} className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700">
                        + 인증 추가
                      </button>
                    </div>
                    {getArray('corporateInfo.disclosure.certifications').map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="relative space-y-2 rounded-xl border border-slate-200 bg-white p-4"
                      >
                        <button
                          type="button"
                          onClick={() => removeDisclosure(idx)}
                          className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-500"
                        >
                          ×
                        </button>

                        <InputField
                          label="인증명"
                          value={item.name || ''}
                          onChange={(v) => updateDeep(`corporateInfo.disclosure.certifications.${idx}.name`, v)}
                        />

                        <InputField
                          label="인증 연도/기간"
                          value={item.date || ''}
                          onChange={(v) => updateDeep(`corporateInfo.disclosure.certifications.${idx}.date`, v)}
                        />

                        <ImageUploadField
                          label="인증서 이미지"
                          value={item.image || ''}
                          onChange={(result) => updateDeep(`corporateInfo.disclosure.certifications.${idx}.image`, result?.url || '')}
                          siteId={siteId}
                          purpose="general"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. ESG */}
              {active === 'esg' && (
                <div className="space-y-4">
                  <VisibilityToggle sectionKey="esg" label="지속가능경영" />

                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField
                      label="페이지 제목"
                      value={getValue('corporateInfo.esg.mainTitle')}
                      onChange={(v) => updateDeep('corporateInfo.esg.mainTitle', v)}
                    />

                    <TextAreaField
                      label="페이지 설명"
                      value={getValue('corporateInfo.esg.mainDesc')}
                      onChange={(v) => updateDeep('corporateInfo.esg.mainDesc', v)}
                      h="h-20"
                    />

                    <InputField label="환경경영 영문 라벨" value={getValue('corporateInfo.esg.goals.0.label')} onChange={(v) => updateDeep('corporateInfo.esg.goals.0.label', v)} />
                    <InputField label="환경경영 제목" value={getValue('corporateInfo.esg.goals.0.title')} onChange={(v) => updateDeep('corporateInfo.esg.goals.0.title', v)} />
                    <TextAreaField label="환경경영 내용" value={getValue('corporateInfo.esg.goals.0.content')} onChange={(v) => updateDeep('corporateInfo.esg.goals.0.content', v)} />

                    <InputField label="사회공헌 영문 라벨" value={getValue('corporateInfo.esg.goals.1.label')} onChange={(v) => updateDeep('corporateInfo.esg.goals.1.label', v)} />
                    <InputField label="사회공헌 제목" value={getValue('corporateInfo.esg.goals.1.title')} onChange={(v) => updateDeep('corporateInfo.esg.goals.1.title', v)} />
                    <TextAreaField label="사회공헌 내용" value={getValue('corporateInfo.esg.goals.1.content')} onChange={(v) => updateDeep('corporateInfo.esg.goals.1.content', v)} />

                    <InputField label="지배구조 영문 라벨" value={getValue('corporateInfo.esg.goals.2.label')} onChange={(v) => updateDeep('corporateInfo.esg.goals.2.label', v)} />
                    <InputField label="투명경영 제목" value={getValue('corporateInfo.esg.goals.2.title')} onChange={(v) => updateDeep('corporateInfo.esg.goals.2.title', v)} />
                    <TextAreaField label="투명경영 내용" value={getValue('corporateInfo.esg.goals.2.content')} onChange={(v) => updateDeep('corporateInfo.esg.goals.2.content', v)} />
                  </div>
                </div>
              )}

              {/* 6. PR 센터 */}
              {active === 'pr' && (
                <div className="space-y-4">
                  <VisibilityToggle sectionKey="pr" label="홍보 센터" />

                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField label="뉴스 대표 제목" value={getValue('prCenter.news.0.title')} onChange={(v) => updateDeep('prCenter.news.0.title', v)} />
                    <TextAreaField label="뉴스 대표 요약" value={getValue('prCenter.news.0.summary')} onChange={(v) => updateDeep('prCenter.news.0.summary', v)} />
                  </div>
                </div>
              )}

              {/* 7. 인재 경영 */}
              {active === 'recruit' && (
                <div className="space-y-4">
                  <VisibilityToggle sectionKey="recruit" label="인재 경영" />

                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <TextAreaField
                      label="인재상"
                      value={getValue('recruit.talentValue') || getValue('talentValue')}
                      onChange={(v) => {
                        updateDeep('recruit.talentValue', v);
                        updateDeep('talentValue', v);
                      }}
                    />
                    <TextAreaField
                      label="복리후생"
                      value={getValue('recruit.benefitInfo') || getValue('benefitInfo')}
                      onChange={(v) => {
                        updateDeep('recruit.benefitInfo', v);
                        updateDeep('benefitInfo', v);
                      }}
                    />

                    {/* 채용 공고 섹션 */}
                    <div className="space-y-3 border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-700">채용 포지션</h4>
                        <button type="button" onClick={addOpenPosition} className="rounded bg-blue-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-blue-700">
                          + 포지션 추가
                        </button>
                      </div>
                      {getArray('recruit.openPositions').map((item: any, idx: number) => (
                        <div key={idx} className="relative space-y-2 rounded-lg border border-slate-200 p-3">
                          <button type="button" onClick={() => removeOpenPosition(idx)} className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-600">
                            삭제
                          </button>
                          <InputField label="직무명" value={item?.title} onChange={(v) => updateDeep(`recruit.openPositions.${idx}.title`, v)} />
                          <InputField label="부서" value={item?.department} onChange={(v) => updateDeep(`recruit.openPositions.${idx}.department`, v)} />
                          <InputField label="마감일" value={item?.deadline} onChange={(v) => updateDeep(`recruit.openPositions.${idx}.deadline`, v)} />
                          <InputField label="지원 링크" value={item?.link} onChange={(v) => updateDeep(`recruit.openPositions.${idx}.link`, v)} placeholder="https://" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 7-1. 상단 메뉴 */}
              {active === 'navigation' && (
                <NavigationEditor data={data} setData={setData} />
              )}

              {/* 8. 고객 센터 */}
              {active === 'cs' && (
                <div className="space-y-4">
                  <VisibilityToggle sectionKey="cs" label="고객 센터" />

                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField
                      label="대표 전화번호"
                      value={
                        getValue('supportPhone') ||
                        getValue('csCenter.contactInfo.phone')
                      }
                      onChange={(v) => {
                        updateDeep('supportPhone', v);
                        updateDeep('csCenter.contactInfo.phone', v);
                      }}
                      placeholder="02-000-0000"
                    />

                    <InputField
                      label="고객센터 이메일"
                      value={getValue('csCenter.contactInfo.email')}
                      onChange={(v) => {
                        updateDeep('csCenter.contactInfo.email', v);
                        updateDeep('footer.contactEmail', v);
                      }}
                      placeholder="info@example.com"
                    />

                    <InputField
                      label="사업장 주소"
                      value={
                        getValue('corporateInfo.location.headOffice.address') ||
                        getValue('footer.address')
                      }
                      onChange={(v) => {
                        updateDeep('corporateInfo.location.headOffice.address', v);
                        updateDeep('csCenter.contactInfo.address', v);
                        updateDeep('footer.address', v);
                      }}
                      placeholder="주소를 입력해주세요."
                    />

                    <InputField
                      label="네이버 지도 링크"
                      value={getValue('corporateInfo.location.headOffice.mapUrl')}
                      onChange={(v) =>
                        updateDeep('corporateInfo.location.headOffice.mapUrl', v)
                      }
                      placeholder="https://map.naver.com/"
                    />

                    <InputField
                      label="문의 안내 문구"
                      value={getValue('csGuide')}
                      onChange={(v) => updateDeep('csGuide', v)}
                      placeholder="문의 내용을 남겨주시면 빠르게 답변드리겠습니다."
                    />
                  </div>
                </div>
              )}

              {/* 9. 하단 정보 */}
              {active === 'footer' && (
                <div className="space-y-4">
                  <VisibilityToggle sectionKey="footer" label="하단 정보" />

                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField label="사업자등록번호" value={getValue('footer.businessNumber')} onChange={(v) => updateDeep('footer.businessNumber', v)} />
                    <InputField
                      label="대표자 성명"
                      value={getValue('footer.ownerName')}
                      onChange={(v) => {
                        updateDeep('footer.ownerName', v);
                        updateDeep('corporateInfo.representativeName', v);
                        updateDeep('corporateInfo.ceoGreeting.name', v);
                      }}
                    />
                    <InputField label="사업장 주소" value={getValue('footer.address')} onChange={(v) => updateDeep('footer.address', v)} />
                    <InputField label="대표 이메일" value={getValue('footer.contactEmail')} onChange={(v) => updateDeep('footer.contactEmail', v)} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}