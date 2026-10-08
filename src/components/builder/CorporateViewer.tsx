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
    
    // 부모 컨테이너가 스크롤되는 경우와 윈도우 스크롤 모두 대응
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const mainContainer = document.getElementById('corporate-viewer-root');
      if (mainContainer) mainContainer.scrollTop = 0;
    }
  };

  const currentSolution = selectedSolutionId !== null ? solutions[selectedSolutionId] : null;

  return (
    <div 
      id="corporate-viewer-root"
      className="w-full min-h-screen h-auto overflow-y-auto overflow-x-hidden bg-white text-slate-900 font-sans flex flex-col justify-between"
    >
      {/* GNB Navigation */}
      <div className="w-full shrink-0">
        <GNB 
          company={company} 
          navigation={navigation} 
          themeColor={themeColor} 
          activePage={activePage} 
          navigateTo={(id, index) => navigateTo(id, index)} 
        />
      </div>

      {/* Main Page Content */}
      <main className="w-full flex-1 shrink-0">
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
            <div className="py-32 text-center text-2xl font-bold text-slate-600">고객센터 페이지 준비 중...</div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Section */}
      <footer className="w-full bg-slate-900 text-slate-400 py-20 px-6 shrink-0 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div>
            <div className="text-2xl font-bold text-white mb-8">{company?.name || 'COMPANY'}</div>
            <p className="text-sm opacity-70 leading-relaxed">
              {footer?.address || '주소 정보가 등록되지 않았습니다.'}<br/>
              TEL: {data.supportPhone || '연락처 미등록'}
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-sm tracking-wider">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigateTo('main')}>홈으로</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigateTo('sol_detail', 0)}>사업소개</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigateTo('cs')}>고객센터</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-sm tracking-wider">Customer Support</h4>
            <p className="text-3xl font-bold text-white mb-4">{data.supportPhone || '000-0000-0000'}</p>
            <p className="text-sm opacity-70">{footer?.contactEmail || ''}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CorporateViewer;