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

export const CorporateViewer = ({
  data,
  activeSection: propSection,
  setActiveSection: propSetSection,
}: CorporateViewerProps) => {
  if (!data) {
    return <div className="p-10 text-center">데이터를 불러오는 중입니다...</div>;
  }

  const {
    company = {},
    navigation = {},
    themeColor = '#2563eb',
    footer = {},
    corporateInfo = {},
  } = data;

  const solutionList = Array.isArray(data.solutions)
    ? data.solutions
    : Array.isArray(data.solutions?.list)
      ? data.solutions.list
      : [];

  const solutionMain = data.solutionMain || {
    title: data.hero?.title || '',
    description: data.hero?.subtitle || '',
    detailContent: data.hero?.subtitle || '',
  };

  const [internalPage, setInternalPage] = useState('main');
  const [, setSelectedSolutionId] = useState<number | null>(null);

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

      if (mainContainer) {
        mainContainer.scrollTop = 0;
      }
    }
  };

  return (
    <div
      id="corporate-viewer-root"
      className="w-full min-h-screen overflow-x-hidden bg-white font-sans text-slate-900"
    >
      <div className="w-full">
        <GNB
          company={company}
          navigation={navigation}
          themeColor={themeColor}
          activePage={activePage}
          navigateTo={navigateTo}
        />
      </div>

      <main className="w-full">
        <AnimatePresence mode="wait">
          {activePage === 'main' && (
<MainPage
  key="main"
hero={{
  title: data.hero?.title || solutionMain.title,
  subtitle: data.hero?.subtitle || solutionMain.description,
  badge: data.hero?.badge || 'Since 1990',
  mediaUrl: data.hero?.mediaUrl || '',
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
              data={{ solutionMain, solutions: solutionList }}
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
              recruitData={
                data.recruit || {
                  talentValue: data.talentValue || '',
                  benefitInfo: data.benefitInfo || '',
                  openPositions: [],
                }
              }
            />
          )}

          {activePage === 'cs' && (
            <CSPage
              key="cs"
              guide={data.csGuide || data.public?.notice}
              contactInfo={
                data.csCenter?.contactInfo ||
                data.cs || {
                  phone: data.supportPhone || '',
                  email: '',
                }
              }
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full border-t border-slate-800 bg-slate-900 px-4 py-8 text-slate-400 md:px-8 md:py-12">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-12">
          <div className="space-y-3">
            <div className="text-lg font-bold text-white md:text-2xl">
              {company.name || 'COMPANY'}
            </div>
            <p className="text-xs leading-relaxed opacity-70 md:text-sm">
              {footer.address || '주소 정보가 등록되지 않았습니다.'}
              <br />
              사업자 등록번호: {footer.businessNumber || footer.bizNumber || '미등록'}
              <br />
              대표자명:{' '}
              {footer.ownerName ||
                footer.ceoName ||
                corporateInfo.representativeName ||
                corporateInfo.ceoGreeting?.title ||
                '미등록'}
              <br />
              TEL:{' '}
              {data.supportPhone ||
                data.csCenter?.contactInfo?.phone ||
                '연락처 미등록'}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white md:mb-4 md:text-sm">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs md:space-y-3 md:text-sm">
              <li
                className="cursor-pointer transition-colors hover:text-white"
                onClick={() => navigateTo('main')}
              >
                홈으로
              </li>
              <li
                className="cursor-pointer transition-colors hover:text-white"
                onClick={() => navigateTo('sol_detail', 0)}
              >
                사업소개
              </li>
              <li
                className="cursor-pointer transition-colors hover:text-white"
                onClick={() => navigateTo('cs')}
              >
                고객센터
              </li>
            </ul>
          </div>

          <div className="col-span-2 space-y-3 md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white md:mb-4 md:text-sm">
              Customer Support
            </h4>
            <p className="text-xl font-bold text-white md:text-3xl">
              {data.supportPhone ||
                data.csCenter?.contactInfo?.phone ||
                '000-0000-0000'}
            </p>
            <p className="break-all text-xs opacity-70 md:text-sm">
              {footer.contactEmail || data.csCenter?.contactInfo?.email || ''}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-screen-2xl border-t border-slate-800 pt-5 text-xs md:mt-12 md:pt-8 md:text-sm">
          {footer.copyright ||
            `© ${new Date().getFullYear()} ${company.name || 'COMPANY'}. All rights reserved.`}
        </div>
      </footer>
    </div>
  );
};

export default CorporateViewer;