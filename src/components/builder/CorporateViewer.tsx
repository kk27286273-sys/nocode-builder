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

  // [에디터 구조와 1:1 매칭]
  const { 
    company = {}, 
    navigation = {}, 
    solutions = {}, // 이제 배열이 아니라 { sectionTitle, sectionDesc, list: [] } 구조
    solutionMain = {}, // 메인 히어로 데이터
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
    
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const mainContainer = document.getElementById('corporate-viewer-root');
      if (mainContainer) mainContainer.scrollTop = 0;
    }
  };

  // solutions.list 배열에서 선택된 항목 추출
  const currentSolution = selectedSolutionId !== null && solutions.list 
    ? solutions.list[selectedSolutionId] 
    : null;

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
          navigateTo={(id, index) => navigateTo(id, index)} 
        />
      </div>

      <main className="w-full flex-1 shrink-0">
        <AnimatePresence mode="wait">
          {/* 1. 메인 페이지: hero 대신 solutionMain 전달, solutions 배열 대신 solutions.list 전달 */}
          {activePage === 'main' && (
            <MainPage 
              key="main" 
              hero={solutionMain} 
              solutions={solutions.list || []} 
              navigateTo={navigateTo} 
            />
          )}
          
          {/* 2. 회사소개 페이지 */}
          {activePage === 'about' && (
            <AboutPage key="about" corporateInfo={corporateInfo} />
          )}

          {/* 3. 사업소개(솔루션) 상세 페이지 */}
          {activePage === 'sol_detail' && (
            <SolutionPage 
              key="sol_detail" 
              data={data} 
            />
          )}

          {/* 4. 지속가능경영(ESG) 페이지: data.esg 구조로 매칭 */}
          {activePage === 'esg' && (
            <ESGPage 
              key="esg" 
              esgData={data.esg || { message: '', goal: '' }} 
            />
          )}

          {/* 5. 홍보센터 페이지: data.pr 구조로 매칭 */}
          {activePage === 'pr' && (
            <PRPage 
              key="pr" 
              prData={data.pr || { content: '', imageUrl: '' }} 
            />
          )}

          {/* 6. 인재경영 페이지: data.hr 구조로 매칭 */}
          {activePage === 'recruit' && (
            <RecruitPage 
              key="recruit" 
              recruitData={data.hr || { talent: '', process: '' }} 
            />
          )}

          {/* 7. 고객센터 페이지: data.cs 및 data.public 구조로 매칭 */}
          {activePage === 'cs' && (
            <CSPage 
              key="cs" 
              guide={data.public?.notice} 
              contactInfo={data.cs || { phone: '', email: '' }} 
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full bg-slate-900 text-slate-400 py-20 px-6 shrink-0 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-4">
            <div className="text-2xl font-bold text-white mb-8">{company?.name || 'COMPANY'}</div>
            <p className="text-sm opacity-70 leading-relaxed">
              {footer?.address || '주소 정보가 등록되지 않았습니다.'}<br/>
              TEL: {data.cs?.phone || '연락처 미등록'}
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
            <p className="text-3xl font-bold text-white mb-4">{data.cs?.phone || '000-0000-0000'}</p>
            <p className="text-sm opacity-70">{data.cs?.email || ''}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CorporateViewer;