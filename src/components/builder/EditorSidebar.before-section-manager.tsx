'use client';

import React, { useState } from 'react';
import { InputField, TextAreaField } from './editor/FormControls';
import ImageUploadField from './editor/ImageUploadField';
import SectionManager from './SectionManager';

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

    setData((previous: any) => {
      const next = { ...(previous || {}) };

      let source: any = previous || {};
      let target: any = next;

      for (let index = 0; index < keys.length - 1; index += 1) {
        const key = keys[index];
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
    path
      .split('.')
      .reduce((value: any, key) => value?.[key], data);

  const getArray = (path: string): any[] => {
    const value = getValue(path);

    return Array.isArray(value) ? value : [];
  };

  const addHistory = () => {
    updateDeep('corporateInfo.history', [
      ...getArray('corporateInfo.history'),
      {
        year: '',
        event: '',
      },
    ]);
  };

  const removeHistory = (index: number) => {
    updateDeep(
      'corporateInfo.history',
      getArray('corporateInfo.history').filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    );
  };

  const addOpenPosition = () => {
    updateDeep('recruit.openPositions', [
      ...getArray('recruit.openPositions'),
      {
        title: '',
        department: '',
        deadline: '',
        link: '',
      },
    ]);
  };

  const removeOpenPosition = (index: number) => {
    updateDeep(
      'recruit.openPositions',
      getArray('recruit.openPositions').filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    );
  };

  const addSolutionCard = () => {
    updateDeep('solutions', [
      ...getArray('solutions'),
      {
        title: '새 솔루션',
        category: '신규기술',
        description: '',
        detailContent: '',
        image: '',
      },
    ]);
  };

  const removeSolutionCard = (index: number) => {
    updateDeep(
      'solutions',
      getArray('solutions').filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    );
  };

  const addProject = () => {
    updateDeep('projects', [
      ...getArray('projects'),
      {
        name: '새 프로젝트',
        area: '',
        tags: [],
        duration: '',
        beforeImage: '',
        afterImage: '',
        description: '',
        images: [],
      },
    ]);
  };

  const removeProject = (index: number) => {
    updateDeep(
      'projects',
      getArray('projects').filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    );
  };

  const addService = () => {
    updateDeep('services', [
      ...getArray('services'),
      {
        icon: '🏠',
        title: '새 서비스',
        description: '',
      },
    ]);
  };

  const removeService = (index: number) => {
    updateDeep(
      'services',
      getArray('services').filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    );
  };

  const addProcess = () => {
    updateDeep('process', [
      ...getArray('process'),
      {
        step: getArray('process').length + 1,
        title: '',
        description: '',
      },
    ]);
  };

  const removeProcess = (index: number) => {
    updateDeep(
      'process',
      getArray('process').filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    );
  };

  const templateType = data?.templateType;
  const isInterior =
    templateType === 'interior' || templateType === 'onepage';
  const isCorporate = templateType === 'corporate';

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
          { id: 'contact', label: '연락처' },
          { id: 'footer', label: '하단 정보' },
        ]
      : templateType === 'fitness'
        ? [
            { id: 'main', label: '메인 화면' },
            { id: 'services', label: '클래스' },
            { id: 'contact', label: '연락처' },
            { id: 'footer', label: '하단 정보' },
          ]
        : [
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
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      {isCorporate && (
        <SectionManager
          data={data}
          setData={setData}
          activeSection={active}
          setActiveSection={setTab}
        />
      )}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex w-36 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
          <nav className="flex-1 space-y-1 overflow-y-auto p-2">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setTab(section.id)}
                className={`w-full rounded-md px-3 py-2.5 text-left text-xs font-bold transition-all ${
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

        <div className="min-w-0 flex-1 overflow-y-auto bg-slate-50 p-4">
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-800">
                {sections.find((section) => section.id === active)
                  ?.label || '섹션'}{' '}
                설정
              </h3>
            </div>

            {templateType === 'legal' && (
              <>
                {active === 'main' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField
                      label="메인 제목"
                      value={getValue('hero.title')}
                      onChange={(value) =>
                        updateDeep('hero.title', value)
                      }
                      placeholder="신뢰할 수 있는 법률 파트너"
                    />

                    <TextAreaField
                      label="설명"
                      value={getValue('hero.subtitle')}
                      onChange={(value) =>
                        updateDeep('hero.subtitle', value)
                      }
                      h="h-24"
                      placeholder="의뢰인의 권리를 지키는 전문적인 법률 서비스"
                    />
                  </div>
                )}

                {active === 'contact' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField
                      label="이메일"
                      value={getValue(
                        'csCenter.contactInfo.email',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'csCenter.contactInfo.email',
                          value,
                        )
                      }
                    />

                    <InputField
                      label="전화"
                      value={getValue(
                        'csCenter.contactInfo.phone',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'csCenter.contactInfo.phone',
                          value,
                        )
                      }
                    />

                    <InputField
                      label="주소"
                      value={getValue(
                        'csCenter.contactInfo.address',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'csCenter.contactInfo.address',
                          value,
                        )
                      }
                    />
                  </div>
                )}

                {active === 'footer' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField
                      label="회사명"
                      value={getValue('footer.companyName')}
                      onChange={(value) =>
                        updateDeep('footer.companyName', value)
                      }
                    />

                    <InputField
                      label="주소"
                      value={getValue('footer.address')}
                      onChange={(value) =>
                        updateDeep('footer.address', value)
                      }
                    />
                  </div>
                )}
              </>
            )}

            {templateType === 'fitness' && (
              <>
                {active === 'main' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField
                      label="메인 제목"
                      value={getValue('hero.title')}
                      onChange={(value) =>
                        updateDeep('hero.title', value)
                      }
                      placeholder="건강한 변화를 시작하세요"
                    />

                    <TextAreaField
                      label="설명"
                      value={getValue('hero.subtitle')}
                      onChange={(value) =>
                        updateDeep('hero.subtitle', value)
                      }
                      h="h-24"
                      placeholder="전문 코치와 함께하는 맞춤형 운동 프로그램"
                    />
                  </div>
                )}

                {active === 'services' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        클래스
                      </span>

                      <button
                        type="button"
                        onClick={addService}
                        className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
                      >
                        + 클래스 추가
                      </button>
                    </div>

                    {getArray('services').map(
                      (item: any, index: number) => (
                        <div
                          key={index}
                          className="relative space-y-2 rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <button
                            type="button"
                            onClick={() => removeService(index)}
                            className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-500"
                          >
                            ×
                          </button>

                          <InputField
                            label="클래스명"
                            value={item.title}
                            onChange={(value) =>
                              updateDeep(
                                `services.${index}.title`,
                                value,
                              )
                            }
                          />

                          <TextAreaField
                            label="설명"
                            value={item.description}
                            onChange={(value) =>
                              updateDeep(
                                `services.${index}.description`,
                                value,
                              )
                            }
                            h="h-16"
                          />
                        </div>
                      ),
                    )}
                  </div>
                )}

                {active === 'contact' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField
                      label="이메일"
                      value={getValue(
                        'csCenter.contactInfo.email',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'csCenter.contactInfo.email',
                          value,
                        )
                      }
                    />

                    <InputField
                      label="전화"
                      value={getValue(
                        'csCenter.contactInfo.phone',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'csCenter.contactInfo.phone',
                          value,
                        )
                      }
                    />

                    <InputField
                      label="주소"
                      value={getValue(
                        'csCenter.contactInfo.address',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'csCenter.contactInfo.address',
                          value,
                        )
                      }
                    />
                  </div>
                )}

                {active === 'footer' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField
                      label="회사명"
                      value={getValue('footer.companyName')}
                      onChange={(value) =>
                        updateDeep('footer.companyName', value)
                      }
                    />

                    <InputField
                      label="주소"
                      value={getValue('footer.address')}
                      onChange={(value) =>
                        updateDeep('footer.address', value)
                      }
                    />
                  </div>
                )}
              </>
            )}

            {isInterior && (
              <>
                {active === 'main' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField
                      label="메인 제목"
                      value={getValue('hero.title')}
                      onChange={(value) =>
                        updateDeep('hero.title', value)
                      }
                      placeholder="당신의 꿈의 공간을 만듭니다"
                    />

                    <TextAreaField
                      label="설명"
                      value={getValue('hero.subtitle')}
                      onChange={(value) =>
                        updateDeep('hero.subtitle', value)
                      }
                      h="h-24"
                      placeholder="전문적인 시공으로 가치 있는 인테리어"
                    />

                    <ImageUploadField
                      label="히어로 배경 이미지"
                      value={getValue('hero.mediaUrl') || ''}
                      onChange={(result) =>
                        updateDeep(
                          'hero.mediaUrl',
                          result?.url || '',
                        )
                      }
                      siteId={siteId}
                      purpose="general"
                    />
                  </div>
                )}

                {active === 'projects' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        시공 사례
                      </span>

                      <button
                        type="button"
                        onClick={addProject}
                        className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
                      >
                        + 사례 추가
                      </button>
                    </div>

                    {getArray('projects').map(
                      (item: any, index: number) => (
                        <div
                          key={index}
                          className="relative space-y-2 rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <button
                            type="button"
                            onClick={() => removeProject(index)}
                            className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-500"
                          >
                            ×
                          </button>

                          <InputField
                            label="프로젝트명"
                            value={item.name}
                            onChange={(value) =>
                              updateDeep(
                                `projects.${index}.name`,
                                value,
                              )
                            }
                          />

                          <InputField
                            label="평수"
                            value={item.area}
                            onChange={(value) =>
                              updateDeep(
                                `projects.${index}.area`,
                                value,
                              )
                            }
                            placeholder="예: 84㎡"
                          />

                          <InputField
                            label="시공 기간"
                            value={item.duration}
                            onChange={(value) =>
                              updateDeep(
                                `projects.${index}.duration`,
                                value,
                              )
                            }
                            placeholder="예: 3개월"
                          />

                          <InputField
                            label="태그 (쉼표로 구분)"
                            value={(item.tags || []).join(', ')}
                            onChange={(value) =>
                              updateDeep(
                                `projects.${index}.tags`,
                                value
                                  .split(',')
                                  .map((tag: string) =>
                                    tag.trim(),
                                  )
                                  .filter(Boolean),
                              )
                            }
                            placeholder="풀리모델링, 거실"
                          />

                          <TextAreaField
                            label="설명"
                            value={item.description || ''}
                            onChange={(value) =>
                              updateDeep(
                                `projects.${index}.description`,
                                value,
                              )
                            }
                            h="h-16"
                          />

                          <ImageUploadField
                            label="Before 이미지"
                            value={item.beforeImage || ''}
                            onChange={(result) =>
                              updateDeep(
                                `projects.${index}.beforeImage`,
                                result?.url || '',
                              )
                            }
                            siteId={siteId}
                            purpose="general"
                          />

                          <ImageUploadField
                            label="After 이미지"
                            value={item.afterImage || ''}
                            onChange={(result) =>
                              updateDeep(
                                `projects.${index}.afterImage`,
                                result?.url || '',
                              )
                            }
                            siteId={siteId}
                            purpose="general"
                          />
                        </div>
                      ),
                    )}
                  </div>
                )}

                {active === 'services' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        서비스
                      </span>

                      <button
                        type="button"
                        onClick={addService}
                        className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
                      >
                        + 서비스 추가
                      </button>
                    </div>

                    {getArray('services').map(
                      (item: any, index: number) => (
                        <div
                          key={index}
                          className="relative space-y-2 rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <button
                            type="button"
                            onClick={() => removeService(index)}
                            className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-500"
                          >
                            ×
                          </button>

                          <InputField
                            label="아이콘 (이모지)"
                            value={item.icon || ''}
                            onChange={(value) =>
                              updateDeep(
                                `services.${index}.icon`,
                                value,
                              )
                            }
                            placeholder="🏠"
                          />

                          <InputField
                            label="제목"
                            value={item.title}
                            onChange={(value) =>
                              updateDeep(
                                `services.${index}.title`,
                                value,
                              )
                            }
                          />

                          <TextAreaField
                            label="설명"
                            value={item.description}
                            onChange={(value) =>
                              updateDeep(
                                `services.${index}.description`,
                                value,
                              )
                            }
                            h="h-16"
                          />
                        </div>
                      ),
                    )}
                  </div>
                )}

                {active === 'process' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        시공 절차
                      </span>

                      <button
                        type="button"
                        onClick={addProcess}
                        className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
                      >
                        + 단계 추가
                      </button>
                    </div>

                    {getArray('process').map(
                      (item: any, index: number) => (
                        <div
                          key={index}
                          className="relative space-y-2 rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <button
                            type="button"
                            onClick={() => removeProcess(index)}
                            className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-500"
                          >
                            ×
                          </button>

                          <InputField
                            label="단계 번호"
                            type="number"
                            value={item.step}
                            onChange={(value) =>
                              updateDeep(
                                `process.${index}.step`,
                                Number.parseInt(value, 10) || 0,
                              )
                            }
                          />

                          <InputField
                            label="제목"
                            value={item.title}
                            onChange={(value) =>
                              updateDeep(
                                `process.${index}.title`,
                                value,
                              )
                            }
                          />

                          <TextAreaField
                            label="설명"
                            value={item.description}
                            onChange={(value) =>
                              updateDeep(
                                `process.${index}.description`,
                                value,
                              )
                            }
                            h="h-16"
                          />
                        </div>
                      ),
                    )}
                  </div>
                )}

                {active === 'estimate' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs leading-5 text-slate-600">
                      견적 문의 폼은 프리뷰에서 자동으로
                      렌더링됩니다.
                    </p>
                  </div>
                )}

                {active === 'contact' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField
                      label="이메일"
                      value={getValue(
                        'csCenter.contactInfo.email',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'csCenter.contactInfo.email',
                          value,
                        )
                      }
                    />

                    <InputField
                      label="전화"
                      value={getValue(
                        'csCenter.contactInfo.phone',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'csCenter.contactInfo.phone',
                          value,
                        )
                      }
                    />

                    <InputField
                      label="주소"
                      value={getValue(
                        'csCenter.contactInfo.address',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'csCenter.contactInfo.address',
                          value,
                        )
                      }
                    />
                  </div>
                )}

                {active === 'footer' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField
                      label="회사명"
                      value={getValue('footer.companyName')}
                      onChange={(value) =>
                        updateDeep('footer.companyName', value)
                      }
                    />

                    <InputField
                      label="주소"
                      value={getValue('footer.address')}
                      onChange={(value) =>
                        updateDeep('footer.address', value)
                      }
                    />

                    <InputField
                      label="사업자등록번호"
                      value={getValue('footer.businessNumber')}
                      onChange={(value) =>
                        updateDeep(
                          'footer.businessNumber',
                          value,
                        )
                      }
                    />
                  </div>
                )}
              </>
            )}

            {isCorporate && (
              <>
                {active === 'main' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField
                      label="메인 배지"
                      value={getValue('hero.badge')}
                      onChange={(value) =>
                        updateDeep('hero.badge', value)
                      }
                    />

                    <InputField
                      label="메인 타이틀"
                      value={getValue('hero.title')}
                      onChange={(value) =>
                        updateDeep('hero.title', value)
                      }
                    />

                    <TextAreaField
                      label="메인 서브 타이틀"
                      value={getValue('hero.subtitle')}
                      onChange={(value) =>
                        updateDeep('hero.subtitle', value)
                      }
                    />

                    <ImageUploadField
                      label="메인 히어로 배경 이미지"
                      value={getValue('hero.mediaUrl') || ''}
                      onChange={(result) => {
                        updateDeep(
                          'hero.mediaUrl',
                          result?.url || '',
                        );
                        updateDeep(
                          'hero.mediaSrcSet',
                          result?.srcSet || '',
                        );
                      }}
                      siteId={siteId}
                      purpose="general"
                    />
                  </div>
                )}

                {active === 'about' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField
                      label="회사명"
                      value={getValue('company.name')}
                      onChange={(value) =>
                        updateDeep('company.name', value)
                      }
                    />

                    <InputField
                      label="대표이사 성명"
                      value={
                        getValue(
                          'corporateInfo.representativeName',
                        ) || getValue('footer.ownerName')
                      }
                      onChange={(value) => {
                        updateDeep(
                          'corporateInfo.representativeName',
                          value,
                        );
                        updateDeep(
                          'corporateInfo.ceoGreeting.name',
                          value,
                        );
                        updateDeep('footer.ownerName', value);
                      }}
                    />

                    <ImageUploadField
                      label="회사 로고 (GNB)"
                      value={getValue('company.logoUrl') || ''}
                      onChange={(result) => {
                        updateDeep(
                          'company.logoUrl',
                          result?.url || '',
                        );
                        updateDeep(
                          'company.logoSrcSet',
                          result?.srcSet || '',
                        );
                      }}
                      siteId={siteId}
                      purpose="logo"
                    />

                    <ImageUploadField
                      label="대표이사 사진 (소개 페이지)"
                      value={
                        getValue(
                          'corporateInfo.ceoGreeting.image',
                        ) || ''
                      }
                      onChange={(result) =>
                        updateDeep(
                          'corporateInfo.ceoGreeting.image',
                          result?.url || '',
                        )
                      }
                      siteId={siteId}
                      purpose="general"
                    />

                    <InputField
                      label="슬로건"
                      value={getValue('corporateInfo.about')}
                      onChange={(value) =>
                        updateDeep(
                          'corporateInfo.about',
                          value,
                        )
                      }
                    />

                    <InputField
                      label="핵심 비전"
                      value={
                        getValue('corporateInfo.vision') ||
                        getValue(
                          'corporateInfo.missionVision.vision',
                        )
                      }
                      onChange={(value) => {
                        updateDeep(
                          'corporateInfo.vision',
                          value,
                        );
                        updateDeep(
                          'corporateInfo.missionVision.vision',
                          value,
                        );
                      }}
                    />

                    <TextAreaField
                      label="대표 인사말"
                      value={
                        getValue(
                          'corporateInfo.ceoMessage',
                        ) ||
                        getValue(
                          'corporateInfo.ceoGreeting.content',
                        )
                      }
                      onChange={(value) => {
                        updateDeep(
                          'corporateInfo.ceoMessage',
                          value,
                        );
                        updateDeep(
                          'corporateInfo.ceoGreeting.content',
                          value,
                        );
                      }}
                      h="h-32"
                    />

                    <div className="space-y-3 border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-700">
                          회사 연혁
                        </h4>

                        <button
                          type="button"
                          onClick={addHistory}
                          className="rounded bg-blue-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-blue-700"
                        >
                          + 연혁 추가
                        </button>
                      </div>

                      {getArray('corporateInfo.history').map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="relative space-y-2 rounded-lg border border-slate-200 p-3"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                removeHistory(index)
                              }
                              className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-600"
                            >
                              삭제
                            </button>

                            <InputField
                              label="연도"
                              value={item?.year}
                              onChange={(value) =>
                                updateDeep(
                                  `corporateInfo.history.${index}.year`,
                                  value,
                                )
                              }
                            />

                            <TextAreaField
                              label="내용"
                              value={item?.event}
                              onChange={(value) =>
                                updateDeep(
                                  `corporateInfo.history.${index}.event`,
                                  value,
                                )
                              }
                              h="h-16"
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {active === 'sol_detail' && (
                  <div className="space-y-4">
                    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                      <InputField
                        label="대표 제목"
                        value={getValue('solutionMain.title')}
                        onChange={(value) =>
                          updateDeep(
                            'solutionMain.title',
                            value,
                          )
                        }
                      />

                      <TextAreaField
                        label="대표 요약"
                        value={getValue(
                          'solutionMain.description',
                        )}
                        onChange={(value) =>
                          updateDeep(
                            'solutionMain.description',
                            value,
                          )
                        }
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          솔루션 카드 목록
                        </span>

                        <button
                          type="button"
                          onClick={addSolutionCard}
                          className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
                        >
                          + 카드 추가
                        </button>
                      </div>

                      {getArray('solutions').map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="relative space-y-2 rounded-xl border border-slate-200 bg-white p-4"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                removeSolutionCard(index)
                              }
                              className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-500"
                            >
                              ×
                            </button>

                            <InputField
                              label="카드 제목"
                              value={item.title}
                              onChange={(value) =>
                                updateDeep(
                                  `solutions.${index}.title`,
                                  value,
                                )
                              }
                            />

                            <TextAreaField
                              label="요약 설명"
                              value={item.description}
                              onChange={(value) =>
                                updateDeep(
                                  `solutions.${index}.description`,
                                  value,
                                )
                              }
                              h="h-16"
                            />

                            <TextAreaField
                              label="상세 설명"
                              value={item.detailContent || ''}
                              onChange={(value) =>
                                updateDeep(
                                  `solutions.${index}.detailContent`,
                                  value,
                                )
                              }
                              h="h-24"
                            />

                            <ImageUploadField
                              label="솔루션 이미지"
                              value={item.image || ''}
                              onChange={(result) => {
                                updateDeep(
                                  `solutions.${index}.image`,
                                  result?.url || '',
                                );
                                updateDeep(
                                  `solutions.${index}.imageSrcSet`,
                                  result?.srcSet || '',
                                );
                              }}
                              siteId={siteId}
                              purpose="solution"
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {active === 'esg' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField
                      label="페이지 제목"
                      value={getValue(
                        'corporateInfo.esg.mainTitle',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'corporateInfo.esg.mainTitle',
                          value,
                        )
                      }
                    />

                    <TextAreaField
                      label="페이지 설명"
                      value={getValue(
                        'corporateInfo.esg.mainDesc',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'corporateInfo.esg.mainDesc',
                          value,
                        )
                      }
                      h="h-20"
                    />

                    <InputField
                      label="환경경영 영문 라벨"
                      value={getValue(
                        'corporateInfo.esg.goals.0.label',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'corporateInfo.esg.goals.0.label',
                          value,
                        )
                      }
                    />

                    <InputField
                      label="환경경영 제목"
                      value={getValue(
                        'corporateInfo.esg.goals.0.title',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'corporateInfo.esg.goals.0.title',
                          value,
                        )
                      }
                    />

                    <TextAreaField
                      label="환경경영 내용"
                      value={getValue(
                        'corporateInfo.esg.goals.0.content',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'corporateInfo.esg.goals.0.content',
                          value,
                        )
                      }
                    />

                    <InputField
                      label="사회공헌 영문 라벨"
                      value={getValue(
                        'corporateInfo.esg.goals.1.label',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'corporateInfo.esg.goals.1.label',
                          value,
                        )
                      }
                    />

                    <InputField
                      label="사회공헌 제목"
                      value={getValue(
                        'corporateInfo.esg.goals.1.title',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'corporateInfo.esg.goals.1.title',
                          value,
                        )
                      }
                    />

                    <TextAreaField
                      label="사회공헌 내용"
                      value={getValue(
                        'corporateInfo.esg.goals.1.content',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'corporateInfo.esg.goals.1.content',
                          value,
                        )
                      }
                    />

                    <InputField
                      label="지배구조 영문 라벨"
                      value={getValue(
                        'corporateInfo.esg.goals.2.label',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'corporateInfo.esg.goals.2.label',
                          value,
                        )
                      }
                    />

                    <InputField
                      label="투명경영 제목"
                      value={getValue(
                        'corporateInfo.esg.goals.2.title',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'corporateInfo.esg.goals.2.title',
                          value,
                        )
                      }
                    />

                    <TextAreaField
                      label="투명경영 내용"
                      value={getValue(
                        'corporateInfo.esg.goals.2.content',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'corporateInfo.esg.goals.2.content',
                          value,
                        )
                      }
                    />
                  </div>
                )}

                {active === 'pr' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField
                      label="뉴스 대표 제목"
                      value={getValue(
                        'prCenter.news.0.title',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'prCenter.news.0.title',
                          value,
                        )
                      }
                    />

                    <TextAreaField
                      label="뉴스 대표 요약"
                      value={getValue(
                        'prCenter.news.0.summary',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'prCenter.news.0.summary',
                          value,
                        )
                      }
                    />
                  </div>
                )}

                {active === 'recruit' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <TextAreaField
                      label="인재상"
                      value={
                        getValue('recruit.talentValue') ||
                        getValue('talentValue')
                      }
                      onChange={(value) => {
                        updateDeep(
                          'recruit.talentValue',
                          value,
                        );
                        updateDeep('talentValue', value);
                      }}
                      h="h-24"
                    />

                    <TextAreaField
                      label="복리후생"
                      value={
                        getValue('recruit.benefitInfo') ||
                        getValue('benefitInfo')
                      }
                      onChange={(value) => {
                        updateDeep(
                          'recruit.benefitInfo',
                          value,
                        );
                        updateDeep('benefitInfo', value);
                      }}
                      h="h-24"
                    />

                    <div className="space-y-3 border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-700">
                          채용 포지션
                        </h4>

                        <button
                          type="button"
                          onClick={addOpenPosition}
                          className="rounded bg-blue-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-blue-700"
                        >
                          + 포지션 추가
                        </button>
                      </div>

                      {getArray('recruit.openPositions').map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="relative space-y-2 rounded-lg border border-slate-200 p-3"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                removeOpenPosition(index)
                              }
                              className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-rose-600"
                            >
                              삭제
                            </button>

                            <InputField
                              label="직무명"
                              value={item?.title}
                              onChange={(value) =>
                                updateDeep(
                                  `recruit.openPositions.${index}.title`,
                                  value,
                                )
                              }
                            />

                            <InputField
                              label="부서"
                              value={item?.department}
                              onChange={(value) =>
                                updateDeep(
                                  `recruit.openPositions.${index}.department`,
                                  value,
                                )
                              }
                            />

                            <InputField
                              label="마감일"
                              value={item?.deadline}
                              onChange={(value) =>
                                updateDeep(
                                  `recruit.openPositions.${index}.deadline`,
                                  value,
                                )
                              }
                            />

                            <InputField
                              label="지원 링크"
                              value={item?.link}
                              onChange={(value) =>
                                updateDeep(
                                  `recruit.openPositions.${index}.link`,
                                  value,
                                )
                              }
                              placeholder="https://"
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {active === 'cs' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField
                      label="대표 전화번호"
                      value={
                        getValue('supportPhone') ||
                        getValue(
                          'csCenter.contactInfo.phone',
                        )
                      }
                      onChange={(value) => {
                        updateDeep('supportPhone', value);
                        updateDeep(
                          'csCenter.contactInfo.phone',
                          value,
                        );
                      }}
                      placeholder="02-000-0000"
                    />

                    <InputField
                      label="고객센터 이메일"
                      value={getValue(
                        'csCenter.contactInfo.email',
                      )}
                      onChange={(value) => {
                        updateDeep(
                          'csCenter.contactInfo.email',
                          value,
                        );
                        updateDeep(
                          'footer.contactEmail',
                          value,
                        );
                      }}
                      placeholder="info@example.com"
                    />

                    <InputField
                      label="사업장 주소"
                      value={
                        getValue(
                          'corporateInfo.location.headOffice.address',
                        ) || getValue('footer.address')
                      }
                      onChange={(value) => {
                        updateDeep(
                          'corporateInfo.location.headOffice.address',
                          value,
                        );
                        updateDeep(
                          'csCenter.contactInfo.address',
                          value,
                        );
                        updateDeep('footer.address', value);
                      }}
                      placeholder="주소를 입력해주세요."
                    />

                    <InputField
                      label="네이버 지도 링크"
                      value={getValue(
                        'corporateInfo.location.headOffice.mapUrl',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'corporateInfo.location.headOffice.mapUrl',
                          value,
                        )
                      }
                      placeholder="https://map.naver.com/"
                    />

                    <TextAreaField
                      label="문의 안내 문구"
                      value={getValue('csGuide')}
                      onChange={(value) =>
                        updateDeep('csGuide', value)
                      }
                      placeholder="문의 내용을 남겨주시면 빠르게 답변드리겠습니다."
                      h="h-24"
                    />
                  </div>
                )}

                {active === 'footer' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InputField
                      label="사업자등록번호"
                      value={getValue(
                        'footer.businessNumber',
                      )}
                      onChange={(value) =>
                        updateDeep(
                          'footer.businessNumber',
                          value,
                        )
                      }
                    />

                    <InputField
                      label="대표자 성명"
                      value={getValue('footer.ownerName')}
                      onChange={(value) => {
                        updateDeep('footer.ownerName', value);
                        updateDeep(
                          'corporateInfo.representativeName',
                          value,
                        );
                        updateDeep(
                          'corporateInfo.ceoGreeting.name',
                          value,
                        );
                      }}
                    />

                    <InputField
                      label="사업장 주소"
                      value={getValue('footer.address')}
                      onChange={(value) =>
                        updateDeep('footer.address', value)
                      }
                    />

                    <InputField
                      label="대표 이메일"
                      value={getValue('footer.contactEmail')}
                      onChange={(value) =>
                        updateDeep(
                          'footer.contactEmail',
                          value,
                        )
                      }
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}