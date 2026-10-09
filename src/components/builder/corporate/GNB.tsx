'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GNBProps {
  company: any;
  navigation: any;
  themeColor: string;
  activePage: string;
  navigateTo: (id: string, index?: number) => void;
}

export default function GNB({
  company,
  navigation,
  themeColor,
  activePage,
  navigateTo,
}: GNBProps) {
  const mainMenus = [
    { label: '회사소개', id: 'about' },
    { label: '사업소개', id: 'sol_detail' },
    { label: '지속가능경영', id: 'esg' },
    { label: '홍보센터', id: 'pr' },
    { label: '인재경영', id: 'recruit' },
    { label: '고객센터', id: 'cs' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 md:min-h-20 md:px-12">
        <button
          type="button"
          className="flex min-w-0 cursor-pointer items-center text-left"
          onClick={() => navigateTo('main')}
          aria-label="홈으로 이동"
        >
          {company?.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company?.name || '회사 로고'}
              className="h-8 w-auto max-w-36 object-contain"
            />
          ) : (
            <span className="truncate text-lg font-black tracking-tight text-slate-900 md:text-xl">
              {company?.name || 'COMPANY'}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => navigateTo('cs')}
          style={{ backgroundColor: themeColor }}
          className="shrink-0 rounded-full px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
        >
          문의하기
        </button>
      </div>

      <nav
        aria-label="주요 메뉴"
        className="flex w-full gap-2 overflow-x-auto border-t border-slate-100 px-3 py-2 lg:justify-center lg:gap-8"
      >
        {mainMenus.map((menu) => (
          <button
            key={menu.id}
            type="button"
            onClick={() => navigateTo(menu.id, 0)}
            aria-current={activePage === menu.id ? 'page' : undefined}
            className={`relative shrink-0 whitespace-nowrap px-2 py-2 text-xs font-bold transition-colors md:text-sm ${
              activePage === menu.id
                ? 'text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {menu.label}
            {activePage === menu.id && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600"
              />
            )}
          </button>
        ))}
      </nav>
    </header>
  );
}