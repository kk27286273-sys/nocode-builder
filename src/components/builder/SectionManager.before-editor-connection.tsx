'use client';

import React from 'react';

type SectionType =
  | 'main'
  | 'about'
  | 'sol_detail'
  | 'esg'
  | 'pr'
  | 'recruit'
  | 'cs';

type BuilderSection = {
  id: string;
  type: SectionType;
  label: string;
  enabled: boolean;
};

interface SectionManagerProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
}

const SECTION_OPTIONS: {
  type: SectionType;
  label: string;
}[] = [
  { type: 'main', label: '메인 화면' },
  { type: 'about', label: '회사 소개' },
  { type: 'sol_detail', label: '사업 소개' },
  { type: 'esg', label: '지속가능경영' },
  { type: 'pr', label: '홍보 센터' },
  { type: 'recruit', label: '인재 경영' },
  { type: 'cs', label: '고객 센터' },
];

const DEFAULT_SECTIONS: BuilderSection[] = [
  {
    id: 'main',
    type: 'main',
    label: '메인 화면',
    enabled: true,
  },
  {
    id: 'about',
    type: 'about',
    label: '회사 소개',
    enabled: true,
  },
  {
    id: 'sol_detail',
    type: 'sol_detail',
    label: '사업 소개',
    enabled: true,
  },
  {
    id: 'esg',
    type: 'esg',
    label: '지속가능경영',
    enabled: true,
  },
  {
    id: 'pr',
    type: 'pr',
    label: '홍보 센터',
    enabled: true,
  },
  {
    id: 'recruit',
    type: 'recruit',
    label: '인재 경영',
    enabled: true,
  },
  {
    id: 'cs',
    type: 'cs',
    label: '고객 센터',
    enabled: true,
  },
];

function getSections(data: any): BuilderSection[] {
  const pages = data?.builderV2?.pages;

  if (!Array.isArray(pages) || pages.length === 0) {
    return DEFAULT_SECTIONS;
  }

  return pages
    .filter((page) => page && typeof page === 'object')
    .map((page: any, index: number) => {
      const type = SECTION_OPTIONS.some(
        (option) => option.type === page.type,
      )
        ? page.type
        : 'main';

      return {
        id:
          typeof page.id === 'string' && page.id.trim()
            ? page.id
            : `${type}-${index}`,
        type,
        label:
          typeof page.label === 'string' && page.label.trim()
            ? page.label
            : SECTION_OPTIONS.find(
                (option) => option.type === type,
              )?.label || '섹션',
        enabled: page.enabled !== false,
      };
    });
}

function makeSection(
  type: SectionType,
  index: number,
): BuilderSection {
  const option = SECTION_OPTIONS.find(
    (item) => item.type === type,
  );

  return {
    id: `${type}-${Date.now()}-${index}`,
    type,
    label: option?.label || '새 섹션',
    enabled: true,
  };
}

export default function SectionManager({
  data,
  setData,
  activeSection,
  setActiveSection,
}: SectionManagerProps) {
  const sections = getSections(data);

  const updateSections = (
    updater: (current: BuilderSection[]) => BuilderSection[],
  ) => {
    setData((previous: any) => {
      const current = getSections(previous);
      const next = updater(current);

      return {
        ...(previous || {}),
        builderV2: {
          ...(previous?.builderV2 || {}),
          pages: next,
        },
      };
    });
  };

  const initializeSections = () => {
    setData((previous: any) => ({
      ...(previous || {}),
      builderV2: {
        ...(previous?.builderV2 || {}),
        pages: DEFAULT_SECTIONS,
      },
    }));
  };

  const addSection = (type: SectionType) => {
    updateSections((current) => [
      ...current,
      makeSection(type, current.length),
    ]);

    setActiveSection?.(type);
  };

  const duplicateSection = (section: BuilderSection) => {
    const duplicated: BuilderSection = {
      ...section,
      id: `${section.type}-copy-${Date.now()}`,
      label: `${section.label} 복제본`,
    };

    updateSections((current) => {
      const index = current.findIndex(
        (item) => item.id === section.id,
      );

      if (index === -1) {
        return [...current, duplicated];
      }

      return [
        ...current.slice(0, index + 1),
        duplicated,
        ...current.slice(index + 1),
      ];
    });

    setActiveSection?.(section.type);
  };

  const removeSection = (section: BuilderSection) => {
    if (sections.length <= 1) {
      alert('최소 한 개의 섹션은 남겨두어야 합니다.');
      return;
    }

    if (section.type === 'main') {
      alert('메인 화면은 삭제할 수 없습니다.');
      return;
    }

    const confirmed = window.confirm(
      `"${section.label}" 섹션을 삭제하시겠습니까?`,
    );

    if (!confirmed) {
      return;
    }

    updateSections((current) =>
      current.filter((item) => item.id !== section.id),
    );

    if (activeSection === section.type) {
      const nextSection = sections.find(
        (item) => item.id !== section.id && item.enabled,
      );

      setActiveSection?.(nextSection?.type || 'main');
    }
  };

  const moveSection = (
    section: BuilderSection,
    direction: 'up' | 'down',
  ) => {
    updateSections((current) => {
      const index = current.findIndex(
        (item) => item.id === section.id,
      );

      if (index === -1) {
        return current;
      }

      const targetIndex =
        direction === 'up' ? index - 1 : index + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= current.length
      ) {
        return current;
      }

      const next = [...current];
      const temporary = next[index];

      next[index] = next[targetIndex];
      next[targetIndex] = temporary;

      return next;
    });
  };

  const toggleSection = (section: BuilderSection) => {
    if (section.type === 'main') {
      return;
    }

    updateSections((current) =>
      current.map((item) =>
        item.id === section.id
          ? {
              ...item,
              enabled: !item.enabled,
            }
          : item,
      ),
    );
  };

  return (
    <section className="border-b border-slate-200 bg-white p-3">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-black text-slate-800">
            V2 섹션 관리
          </h3>

          <p className="mt-1 text-[10px] leading-4 text-slate-500">
            섹션 순서와 표시 여부를 관리합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={initializeSections}
          className="rounded border border-slate-300 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
        >
          기본값 복원
        </button>
      </div>

      <div className="space-y-2">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`rounded-lg border p-2 ${
              section.enabled
                ? 'border-slate-200 bg-slate-50'
                : 'border-slate-200 bg-slate-100 opacity-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setActiveSection?.(section.type)
                }
                className={`min-w-0 flex-1 truncate rounded px-2 py-1.5 text-left text-xs font-bold ${
                  activeSection === section.type
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                {index + 1}. {section.label}
              </button>

              <button
                type="button"
                onClick={() => moveSection(section, 'up')}
                disabled={index === 0}
                className="rounded border border-slate-300 px-1.5 py-1 text-[10px] disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="위로 이동"
              >
                ↑
              </button>

              <button
                type="button"
                onClick={() => moveSection(section, 'down')}
                disabled={index === sections.length - 1}
                className="rounded border border-slate-300 px-1.5 py-1 text-[10px] disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="아래로 이동"
              >
                ↓
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between gap-1">
              <button
                type="button"
                onClick={() => toggleSection(section)}
                className="rounded border border-slate-300 px-2 py-1 text-[10px] text-slate-600 hover:bg-white"
              >
                {section.enabled ? '숨기기' : '표시하기'}
              </button>

              <button
                type="button"
                onClick={() => duplicateSection(section)}
                className="rounded border border-blue-200 px-2 py-1 text-[10px] font-semibold text-blue-600 hover:bg-blue-50"
              >
                복제
              </button>

              <button
                type="button"
                onClick={() => removeSection(section)}
                disabled={section.type === 'main'}
                className="rounded border border-rose-200 px-2 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <select
          defaultValue=""
          onChange={(event) => {
            const value = event.target.value as SectionType;

            if (value) {
              addSection(value);
              event.target.value = '';
            }
          }}
          className="w-full rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 outline-none"
        >
          <option value="">+ 섹션 추가</option>

          {SECTION_OPTIONS.map((option) => (
            <option
              key={option.type}
              value={option.type}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}