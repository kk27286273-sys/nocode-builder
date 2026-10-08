'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import GNB from './corporate/GNB';
import MainPage from './corporate/pages/MainPage';
import AboutPage from './corporate/pages/AboutPage';
import SolutionPage from './corporate/pages/SolutionPage';

interface CorporateViewerProps {
  data: any; 
  activeSection?: string;
  setActiveSection?: (section: string) => void;
}

export const CorporateViewer = ({ data, activeSection: propSection, setActiveSection: propSetSection }: CorporateViewerProps) => {
  if (!data) return <div className="p-10 text-center">데이터를 불러오는 중입니다...</div>;

  const { 
    company = {}, 
    navigation = {}, 
    solutions = [], 
    hero = {}, 
    themeColor = '#003366', 
    footer = {},
    corporateInfo = {} 
  } = data;
  
  const [internalPage, setInternalPage] = useState('main');
  const [selectedSolutionId, setSelectedSolutionId] = useState<number | null>(null);

  const activePage = propSection || internalPage;
  const setActivePage = propSetSection || setInternalPage;

  const navigateTo = (targetId: string, solutionIndex?: number) => {
    if (solutionIndex !== undefined) {
      setSelectedSolutionId(solutionIndex);
    }
    setActivePage(targetId);
    window.scrollTo(0, 0);
  };

  const currentSolution = selectedSolutionId !== null ? solutions[selectedSolutionId] : null;

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 font-sans">
      <GNB 
        company={company} 
        navigation={navigation} 
        themeColor={themeColor} 
        activePage={activePage} 
        // 🟢 수정: (id, index)를 모두 받아 navigateTo에 그대로 전달
        navigateTo={(id, index) => navigateTo(id, index)} 
      />

      <main className="w-full">
        <AnimatePresence mode="wait">
          {activePage === 'main' && (
            <MainPage 
              key="main" 
              hero={hero} 
              solutions={solutions} 
              navigateTo={(id, index) => navigateTo(id, index)} 
            />
          )}
          
          {activePage === 'about' && (
            <AboutPage 
              key="about" 
              corporateInfo={corporateInfo} 
            />
          )}

          {activePage === 'sol_detail' && (
            <SolutionPage 
              key={`sol-${selectedSolutionId}`} 
              solutionData={currentSolution} 
            />
          )}

          {activePage === 'cs' && (
            <div className="py-32 text-center text-2xl">고객센터 페이지 준비 중...</div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-20 px-6 w-full border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div>
            <div className="text-2xl font-bold text-white mb-8">{company?.name || 'COMPANY'}</div>
            <p className="text-sm opacity-70">{footer?.address || ''}<br/>TEL: {data.supportPhone || ''}</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-sm">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li className="hover:text-white cursor-pointer" onClick={() => navigateTo('main')}>홈으로</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigateTo('sol_detail', 0)}>사업소개</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigateTo('cs')}>고객센터</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-sm">Customer Support</h4>
            <p className="text-3xl font-bold text-white mb-4">{data.supportPhone || '000-0000-0000'}</p>
            <p className="text-sm opacity-70">{footer?.contactEmail || ''}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CorporateViewer;