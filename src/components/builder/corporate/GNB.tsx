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

export default function GNB({ company, navigation, themeColor, activePage, navigateTo }: GNBProps) {
  // 에이텍 기준 7대 카테고리 정의
  const mainMenus = [
    { label: '회사소개', id: 'about' },
    { label: '사업소개', id: 'sol_detail' },
    { label: '지속가능경영', id: 'esg' },
    { label: '공시정보', id: 'disclosure' },
    { label: '홍보센터', id: 'pr' },
    { label: '인재경영', id: 'recruit' },
    { label: '고객센터', id: 'cs' },
  ];

  return (
    <header className="w-full h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-12 sticky top-0 z-50 shadow-sm">
      <div 
        className="cursor-pointer flex items-center" 
        onClick={() => navigateTo('main')}
      >
        {company?.logoUrl ? (
          <img src={company.logoUrl} alt="logo" className="h-8 w-auto object-contain" />
        ) : (
          <span className="text-xl font-black tracking-tighter text-slate-900">
            {company?.name || 'COMPANY'}
          </span>
        )}
      </div>

      <nav className="hidden lg:flex items-center gap-10">
        {mainMenus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => navigateTo(menu.id, 0)} // 기본적으로 첫 번째 항목으로 이동
            className={`text-sm font-bold transition-all relative py-2 ${
              activePage === menu.id ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {menu.label}
            {activePage === menu.id && (
              <motion.div 
                layoutId="underline" 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" 
              />
            )}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigateTo('cs')}
          style={{ backgroundColor: themeColor }} 
          className="text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:opacity-90 transition"
        >
          문의하기
        </button>
      </div>
    </header>
  );
}