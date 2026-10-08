'use client';
import React from 'react';

interface GNBProps {
  company: any;
  navigation: any;
  themeColor: string;
  activePage: string;
  // ⬅️ 수정: index 인자를 선택적으로 받을 수 있게 변경
  navigateTo: (id: string, index?: number) => void; 
}

export default function GNB({ company, navigation, themeColor, activePage, navigateTo }: GNBProps) {
  return (
    <nav className="sticky top-0 z-[100] w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="cursor-pointer flex items-center gap-3" onClick={() => navigateTo('main')}>
          {company?.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} className="h-10 w-auto object-contain" />
          ) : (
            <span className="text-2xl font-extrabold tracking-tighter" style={{ color: themeColor }}>
              {company?.name || 'COMPANY'}
            </span>
          )}
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          {(navigation?.navLinks || navigation?.menus || []).map((menu: any) => (
            <div key={menu.label} className="group relative py-8">
              <button 
                className={`text-[15px] font-semibold transition-all duration-300 ${activePage === menu.targetId ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'}`}
                onClick={() => {
                  // 1. 회사소개 관련 처리
                  const isAboutPage = menu.label.includes('CEO') || menu.label.includes('인사말') || menu.label.includes('회사소개');
                  if (isAboutPage) {
                    navigateTo('about');
                    return;
                  }

                  // 2. 사업소개(솔루션) 처리: '사업소개' 메뉴라면 첫 번째 솔루션(index 0)을 기본으로 보여줌
                  if (menu.label.includes('사업소개') || menu.label.includes('솔루션')) {
                    navigateTo('sol_detail', 0); 
                    return;
                  }

                  // 3. 그 외 일반 이동
                  navigateTo(menu.targetId || 'main');
                }}
              >
                {menu.label}
              </button>
              {menu.children && (
                <div className="absolute top-20 left-0 w-60 bg-white border border-slate-100 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-5 rounded-b-xl">
                  {menu.children.map((child: any) => (
                    <button 
                      key={child.label} 
                      onClick={() => navigateTo(child.targetId)} 
                      className="block w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors mb-1"
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}