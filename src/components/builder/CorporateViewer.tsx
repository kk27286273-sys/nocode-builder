'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import GNB from './corporate/GNB';
import MainPage from './corporate/pages/MainPage';
import AboutPage from './corporate/pages/AboutPage';
import SolutionPage from './corporate/pages/SolutionPage';
import ESGPage from './corporate/pages/ESGPage';
import PRPage from './corporate/pages/PRPage';
import RecruitPage from './corporate/pages/RecruitPage';
import CSPage from './corporate/pages/CSPage';

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
    themeColor = '#2563eb', 
    footer = {},
    corporateInfo = {} 
  } = data;
  
  // 배열 구조와 객체 구조 완벽 호환
  const solutionList = Array.isArray(data.solutions)
    ? data.solutions
    : Array.isArray(data.solutions?.list)
      ? data.solutions.list
      : [];

  const solutionMain = data.solutionMain || {
    title: data.hero?.title || '',
    description: data.hero?.subtitle || '',
    detailContent: data.hero?.subtitle || ''
  };

  const [internalPage, setInternalPage] = useState('main');
  const [selectedSolutionId, setSelectedSolutionId] = useState<number | null>(null);

  const activePage = propSection || internalPage;
  const setActivePage = propSetSection || setInternalPage;

  const navigateTo = (targetId: string, solutionIndex?: number) => {
    if (solutionIndex !== undefined) {
      setSelectedSolutionId(solutionIndex);
    }
    setActivePage(targetId);
    
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const mainContainer = document.getElementById('corporate-viewer-root');
      if (mainContainer) mainContainer.scrollTop = 0;
    }
  };

  return (
    <div 
      id="corporate-viewer-root"
      className="w-full min-h-screen h-auto overflow-y-auto overflow-x-hidden bg-white text-slate-900 font-sans flex flex-col justify-between"
    >
      <div className="w-full shrink-0">
        <GNB 
          company={company} 
          navigation={navigation} 
          themeColor={themeColor} 
          activePage={activePage} 
          navigateTo={navigateTo} 
        />
      </div>

      <main className="w-full flex-1 shrink-0">
        <AnimatePresence mode="wait">
          {activePage === 'main' && (
            <MainPage 
              key="main"
              hero={{
                title: solutionMain.title || data.hero?.title,
                subtitle: solutionMain.description || data.hero?.subtitle,
                badge: data.hero?.badge || 'Since 1990'
              }}
              solutions={solutionList}
              navigateTo={navigateTo}
            />
          )}

          {activePage === 'about' && (
            <AboutPage 
              key="about" 
              corporateInfo={corporateInfo} 
              company={company} 
            />
          )}

          {activePage === 'sol_detail' && (
            <SolutionPage 
              key="sol_detail" 
              data={{ 
                solutionMain, 
                solutions: solutionList 
              }} 
            />
          )}

          {activePage === 'esg' && (
            <ESGPage 
              key="esg" 
              esgData={corporateInfo.esg || data.esg} 
            />
          )}

          {activePage === 'pr' && (
            <PRPage 
              key="pr" 
              prData={data.prCenter || data.pr || { news: [], notice: [] }} 
            />
          )}

          {activePage === 'recruit' && (
            <RecruitPage 
              key="recruit" 
              recruitData={data.recruit || { talentValue: data.talentValue || '', benefitInfo: data.benefitInfo || '', openPositions: [] }} 
            />
          )}

          {activePage === 'cs' && (
            <CSPage 
              key="cs" 
              guide={data.csGuide || data.public?.notice}
              contactInfo={data.csCenter?.contactInfo || data.cs || { phone: data.supportPhone || '', email: '' }}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full bg-slate-900 text-slate-400 py-20 px-6 shrink-0 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-4">
            <div className="text-2xl font-bold text-white mb-8">{company.name || 'COMPANY'}</div>
            <p className="text-sm opacity-70 leading-relaxed">
              {footer.address || '주소 정보가 등록되지 않았습니다.'}<br />
              사업자 등록번호: {footer.businessNumber || footer.bizNumber || '미등록'}<br />
              대표자명: {footer.ownerName || footer.ceoName || corporateInfo.ceoGreeting?.title || '미등록'}<br />
              TEL: {data.supportPhone || data.csCenter?.contactInfo?.phone || '연락처 미등록'}
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-white font-bold mb-8 uppercase text-sm tracking-wider">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigateTo('main')}>홈으로</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigateTo('sol_detail', 0)}>사업소개</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigateTo('cs')}>고객센터</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold mb-8 uppercase text-sm tracking-wider">Customer Support</h4>
            <p className="text-3xl font-bold text-white mb-4">{data.supportPhone || data.csCenter?.contactInfo?.phone || '000-0000-0000'}</p>
            <p className="text-sm opacity-70">{footer.contactEmail || data.csCenter?.contactInfo?.email || ''}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 text-sm">
          {footer.copyright || `© ${new Date().getFullYear()} ${company.name || 'COMPANY'}. All rights reserved.`}
        </div>
      </footer>
    </div>
  );
};

export default CorporateViewer;