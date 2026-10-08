'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CorporateViewerProps {
  data: any; 
  activeSection?: string;
  setActiveSection?: (section: string) => void;
}

export const CorporateViewer = ({ data, activeSection: propSection, setActiveSection: propSetSection }: CorporateViewerProps) => {
  if (!data) return <div className="p-10 text-center">데이터를 불러오는 중입니다...</div>;

  // [검증용] 데이터 구조를 화면에 직접 출력하여 매핑 오류를 잡습니다.
  // 실제 배포 후 이 부분의 텍스트를 보고 데이터 변수명을 수정하겠습니다.
  const debugData = JSON.stringify(data, null, 2);

  const { 
    company = {}, 
    navigation = {}, 
    solutions = [], 
    hero = {}, 
    themeColor = '#000', 
    footer = {},
    corporateInfo = {} 
  } = data;
  
  const [internalPage, setInternalPage] = useState('main');
  const activePage = propSection || internalPage;
  const setActivePage = propSetSection || setInternalPage;
  const [selectedSolution, setSelectedSolution] = useState<number | null>(null);

  const navigateTo = (targetId: string) => {
    setActivePage(targetId);
    window.scrollTo(0, 0);
  };

  const Navbar = () => (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="cursor-pointer" onClick={() => navigateTo('main')}>
          {company?.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} className="h-10 object-contain" />
          ) : (
            <span className="text-2xl font-bold" style={{ color: themeColor }}>{company?.name || '회사명'}</span>
          )}
        </div>
        <div className="hidden md:flex gap-8">
          {(navigation?.navLinks || navigation?.menus || []).map((menu: any) => (
            <div key={menu.label} className="group relative py-7">
              <button 
                className="font-medium text-slate-700 hover:text-blue-600 transition-colors"
                onClick={() => navigateTo(menu.targetId || 'main')}
              >
                {menu.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );

  const MainHome = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="relative h-[700px] flex items-center justify-center text-white overflow-hidden bg-slate-800">
        <div className="absolute inset-0 z-0">
          {hero?.mediaUrl && <img src={hero.mediaUrl} alt="hero" className="w-full h-full object-cover brightness-50" />}
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.span className="inline-block px-4 py-1 rounded-full bg-blue-600 text-sm font-bold mb-6">{hero?.badge || '배지'}</motion.span>
          <motion.h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight whitespace-pre-line">{hero?.title || '타이틀'}</motion.h1>
          <motion.p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed whitespace-pre-line">{hero?.subtitle || '서브타이틀'}</motion.p>
        </div>
      </section>
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Solutions</h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions?.length > 0 ? solutions.map((sol: any, idx: number) => (
            <div key={idx} onClick={() => { setSelectedSolution(idx); navigateTo('sol_detail'); }} className="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer group">
              <div className="h-60 overflow-hidden"><img src={sol.image || 'https://via.placeholder.com/400x300'} alt={sol.title} className="w-full h-full object-cover" /></div>
              <div className="p-8">
                <span className="text-blue-600 font-bold text-sm uppercase">{sol.category}</span>
                <h3 className="text-2xl font-bold mt-2 mb-4">{sol.title}</h3>
                <p className="text-slate-600">{sol.description}</p>
              </div>
            </div>
          )) : <div className="col-span-3 text-center py-10 text-slate-400">솔루션 데이터가 없습니다.</div>}
        </div>
      </section>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* [디버그 영역] 실제 데이터 구조를 화면에 출력합니다. */}
      <div className="bg-black text-green-400 p-4 text-[10px] overflow-auto max-h-40 font-mono">
        <strong>DEBUG DATA:</strong><br/> {debugData}
      </div>
      
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          {activePage === 'main' && <MainHome key="main" />}
          {activePage !== 'main' && (
             <div className="py-24 text-center text-2xl font-bold">{activePage} 페이지 준비 중</div>
          )}
        </AnimatePresence>
      </main>
      <footer className="bg-slate-900 text-slate-400 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold text-white mb-4">{company?.name || '회사명'}</div>
          <p>© {new Date().getFullYear()} {company?.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CorporateViewer;