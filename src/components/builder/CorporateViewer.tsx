'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import GNB from './corporate/GNB';
import MainPage from './corporate/pages/MainPage';

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
  const activePage = propSection || internalPage;
  const setActivePage = propSetSection || setInternalPage;

  const navigateTo = (targetId: string) => {
    setActivePage(targetId);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 font-sans">
      {/* 분리한 GNB 컴포넌트 연결 */}
      <GNB 
        company={company} 
        navigation={navigation} 
        themeColor={themeColor} 
        activePage={activePage} 
        navigateTo={navigateTo} 
      />

      <main className="w-full">
        <AnimatePresence mode="wait">
          {/* 분리한 MainPage 컴포넌트 연결 */}
          {activePage === 'main' && (
            <MainPage 
              key="main" 
              hero={hero} 
              solutions={solutions} 
              navigateTo={navigateTo} 
            />
          )}
          
          {/* 나머지 페이지들은 아직 분리 전이므로 기존 로직 유지 (순차적으로 분리 예정) */}
          {activePage === 'sol_detail' && (
            <div className="py-24 text-center">솔루션 상세 페이지 준비 중...</div>
          )}
          {activePage === 'cs' && (
            <div className="py-24 text-center">고객센터 페이지 준비 중...</div>
          )}
          {activePage !== 'main' && activePage !== 'sol_detail' && activePage !== 'cs' && (
            <div className="py-24 text-center text-slate-500">해당 콘텐츠는 현재 업데이트 중입니다.</div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer는 나중에 분리 예정 */}
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
              <li className="hover:text-white cursor-pointer" onClick={() => navigateTo('sol_detail')}>사업소개</li>
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