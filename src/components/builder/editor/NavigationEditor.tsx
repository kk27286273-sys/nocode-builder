'use client';

import React from 'react';
import { InputField } from './FormControls';

const TARGET_OPTIONS = [
  { value: 'main', label: '홈' },
  { value: 'about', label: '회사소개' },
  { value: 'sol_detail', label: '사업소개' },
  { value: 'esg', label: '지속가능경영' },
  { value: 'pr', label: '홍보센터' },
  { value: 'recruit', label: '인재경영' },
  { value: 'cs', label: '고객센터' },
];

export default function NavigationEditor({
  data,
  setData,
}: {
  data: any;
  setData: (fn: any) => void;
}) {
  const menus = Array.isArray(data?.navigation?.menus)
    ? data.navigation.menus
    : [];

  const updateMenus = (next: any[]) => {
    setData((prev: any) => ({
      ...prev,
      navigation: { ...(prev.navigation || {}), menus: next },
    }));
  };

  const changeMenu = (index: number, key: string, value: string) => {
    const next = menus.map((m: any, i: number) =>
      i === index ? { ...m, [key]: value } : m,
    );
    updateMenus(next);
  };

  const addMenu = () => {
    if (menus.length >= 8) {
      alert('메뉴는 최대 8개까지 추가할 수 있습니다.');
      return;
    }
    updateMenus([...menus, { label: '새 메뉴', targetId: 'main' }]);
  };

  const removeMenu = (index: number) => {
    if (menus.length <= 1) {
      alert('메뉴는 최소 1개가 필요합니다.');
      return;
    }
    updateMenus(menus.filter((_: any, i: number) => i !== index));
  };

  const moveMenu = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= menus.length) return;

    const next = [...menus];
    [next[index], next[target]] = [next[target], next[index]];
    updateMenus(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">상단 메뉴 관리</h3>
        <button
          type="button"
          onClick={addMenu}
          className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-500"
        >
          + 메뉴 추가
        </button>
      </div>

      {menus.length === 0 && (
        <p className="rounded border border-dashed border-slate-300 bg-slate-50 p-3 text-[11px] text-slate-400">
          등록된 메뉴가 없습니다. 메뉴를 추가해 주세요.
        </p>
      )}

      {menus.map((menu: any, index: number) => (
        <div
          key={index}
          className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">
              메뉴 {index + 1}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveMenu(index, -1)}
                disabled={index === 0}
                className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[11px] disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveMenu(index, 1)}
                disabled={index === menus.length - 1}
                className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[11px] disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeMenu(index)}
                className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50"
              >
                삭제
              </button>
            </div>
          </div>

          <InputField
            label="메뉴 이름"
            value={menu.label || ''}
            onChange={(val) => changeMenu(index, 'label', val)}
            placeholder="예: 회사소개"
          />

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-500">
              연결될 페이지
            </label>
            <select
              value={menu.targetId || 'main'}
              onChange={(e) => changeMenu(index, 'targetId', e.target.value)}
              className="w-full rounded border border-slate-200 bg-white p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
            >
              {TARGET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}