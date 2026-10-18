'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import GNB from './corporate/GNB';
import MainPage from './corporate/pages/MainPage';
import AboutPage from './corporate/pages/AboutPage';
import SolutionPage from './corporate/pages/SolutionPage';
import DisclosurePage from './corporate/pages/DisclosurePage';
import ESGPage from './corporate/pages/ESGPage';
import PRPage from './corporate/pages/PRPage';
import RecruitPage from './corporate/pages/RecruitPage';
import CSPage from './corporate/pages/CSPage';

interface CorporateViewerProps {
  data: any;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
  sectionsVisible?: Record<string, boolean>;
}

export const CorporateViewer = ({
  data,
  activeSection: propSection,
  setActiveSection: propSetSection,
  sectionsVisible = {},
}: CorporateViewerProps) => {
  const [internalPage, setInternalPage] = useState('main');
  const [, setSelectedSolutionId] = useState<number | null>(null);

  const activePage = propSection || internalPage;
  const setActivePage = propSetSection || setInternalPage;

  const isVisible = (key: string) => sectionsVisible[key] !== false;

  if (!data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-10 text-center text-slate-500">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  const company = data.company || {};
  const navigation = data.navigation || {};
  const footer = data.footer || {};
  const corporateInfo = data.corporateInfo || {};

  const themeColor = data.themeColor || '#2563eb';

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

  const headOffice = corporateInfo.location?.headOffice || {};
  const csContact = data.csCenter?.contactInfo || {};

  const contactInfo = {
    phone:
      data.supportPhone ||
      csContact.phone ||
      headOffice.tel ||
      '',

    email:
      csContact.email ||
      footer.contactEmail ||
      '',

    address:
      csContact.address ||
      headOffice.address ||
      footer.address ||
      '',

    mapUrl: headOffice.mapUrl || '',
  };

  const footerPhone =
    data.supportPhone ||
    csContact.phone ||
    headOffice.tel ||
    '연락처 미등록';

  const footerEmail = footer.contactEmail || csContact.email || '';

  const representativeName =
    footer.ownerName ||
    footer.ceoName ||
    corporateInfo.representativeName ||
    corporateInfo.ceoGreeting?.name ||
    '미등록';

  const navigateTo = (
    targetId: string,
    solutionIndex?: number,
  ) => {
    if (solutionIndex !== undefined) {
      setSelectedSolutionId(solutionIndex);
    }

    setActivePage(targetId);

    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      const viewerRoot = document.getElementById(
        'corporate-viewer-root',
      );

      if (viewerRoot) {
        viewerRoot.scrollTop = 0;
      }
    }
  };

  // 비공개 페이지 접근 시 홈으로 리다이렉트
  const currentPage =
    activePage !== 'main' && !isVisible(activePage)
      ? 'main'
      : activePage;

  return (
    <div
      id="corporate-viewer-root"
      className="min-h-screen w-full overflow-x-hidden bg-white font-sans text-slate-900"
    >
      <header className="w-full">
        <GNB
          company={company}
          navigation={navigation}
          themeColor={themeColor}
          activePage={currentPage}
          navigateTo={navigateTo}
          sectionsVisible={sectionsVisible}
        />
      </header>

      <main className="w-full">
        <AnimatePresence mode="wait">
          {currentPage === 'main' && (
            <MainPage
              key="main"
              hero={{
                title: data.hero?.title || solutionMain.title,
                subtitle:
                  data.hero?.subtitle ||
                  solutionMain.description,
                badge: data.hero?.badge || 'Since 1990',
                mediaUrl: data.hero?.mediaUrl || '',
                mediaSrcSet: data.hero?.mediaSrcSet || '',
              }}
              solutions={solutionList}
              navigateTo={navigateTo}
            />
          )}

          {currentPage === 'about' && isVisible('corporateInfo') && (
            <AboutPage
              key="about"
              corporateInfo={corporateInfo}
              company={company}
            />
          )}

          {currentPage === 'sol_detail' && isVisible('solutions') && (
            <SolutionPage
              key="sol_detail"
              data={{
                solutionMain,
                solutions: solutionList,
              }}
            />
          )}

          {currentPage === 'disclosure' && isVisible('disclosure') && (
            <DisclosurePage
              key="disclosure"
              disclosureData={corporateInfo.disclosure || { certifications: [] }}
            />
          )}

          {currentPage === 'esg' && isVisible('esg') && (
            <ESGPage
              key="esg"
              esgData={corporateInfo.esg || data.esg}
            />
          )}

          {currentPage === 'pr' && isVisible('pr') && (
            <PRPage
              key="pr"
              prData={
                data.prCenter ||
                data.pr || {
                  news: [],
                  notice: [],
                }
              }
            />
          )}

          {currentPage === 'recruit' && isVisible('recruit') && (
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

          {currentPage === 'cs' && isVisible('cs') && (
            <CSPage
              key="cs"
              guide={data.csGuide || data.public?.notice || ''}
              contactInfo={contactInfo}
            />
          )}
        </AnimatePresence>
      </main>

      {isVisible('footer') && (
        <footer className="w-full border-t border-slate-800 bg-slate-900 px-4 py-8 text-slate-400 md:px-8 md:py-12">
          <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-12">
            <div className="space-y-3">
              <div className="text-lg font-bold text-white md:text-2xl">
                {company.name || 'COMPANY'}
              </div>

              <p className="text-xs leading-relaxed opacity-70 md:text-sm">
                {footer.address || '주소 정보가 등록되지 않았습니다.'}
                <br />
                사업자 등록번호:{' '}
                {footer.businessNumber ||
                  footer.bizNumber ||
                  '미등록'}
                <br />
                대표자명: {representativeName}
                <br />
                TEL: {footerPhone}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white md:mb-4 md:text-sm">
                Quick Links
              </h4>

              <ul className="space-y-2 text-xs md:space-y-3 md:text-sm">
                <li>
                  <button
                    type="button"
                    className="transition-colors hover:text-white"
                    onClick={() => navigateTo('main')}
                  >
                    홈으로
                  </button>
                </li>

                {isVisible('solutions') && (
                  <li>
                    <button
                      type="button"
                      className="transition-colors hover:text-white"
                      onClick={() => navigateTo('sol_detail', 0)}
                    >
                      사업소개
                    </button>
                  </li>
                )}

                {isVisible('cs') && (
                  <li>
                    <button
                      type="button"
                      className="transition-colors hover:text-white"
                      onClick={() => navigateTo('cs')}
                    >
                      고객센터
                    </button>
                  </li>
                )}
              </ul>
            </div>

            <div className="col-span-2 space-y-3 md:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white md:mb-4 md:text-sm">
                Customer Support
              </h4>

              <p className="text-xl font-bold text-white md:text-3xl">
                {footerPhone}
              </p>

              {footerEmail && (
                <p className="break-all text-xs opacity-70 md:text-sm">
                  {footerEmail}
                </p>
              )}
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-screen-2xl border-t border-slate-800 pt-5 text-xs md:mt-12 md:pt-8 md:text-sm">
            {footer.copyright ||
              `© ${new Date().getFullYear()} ${
                company.name || 'COMPANY'
              }. All rights reserved.`}
          </div>
        </footer>
      )}
    </div>
  );
};

export default CorporateViewer;