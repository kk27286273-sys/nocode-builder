'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import GNB from './corporate/GNB';
import MedinsureHeroSection from './corporate/sections/MedinsureHeroSection';

interface MedinsureViewerProps {
  data: any;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
  sectionsVisible?: Record<string, boolean>;
}

export const MedinsureViewer = ({
  data,
  activeSection: propSection,
  setActiveSection: propSetSection,
  sectionsVisible = {},
}: MedinsureViewerProps) => {
  const [internalPage, setInternalPage] = useState('main');

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
  const themeColor = data.themeColor || '#1d7fd4';

  const navigateTo = (targetId: string) => {
    setActivePage(targetId);

    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      const viewerRoot = document.getElementById('medinsure-viewer-root');
      if (viewerRoot) {
        viewerRoot.scrollTop = 0;
      }
    }
  };

  const currentPage =
    activePage !== 'main' && !isVisible(activePage) ? 'main' : activePage;

  return (
    <div
      id="medinsure-viewer-root"
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
            <MedinsureHeroSection
              key="medinsure-hero"
              title={data.hero?.title}
              subtitle={data.hero?.subtitle}
              themeColor={themeColor}
            />
          )}
        </AnimatePresence>
      </main>

      {isVisible('footer') && (
        <footer className="w-full border-t border-slate-800 bg-slate-900 px-4 py-8 text-slate-400 md:px-8 md:py-12">
          <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-12">
            <div className="space-y-3">
              <div className="text-lg font-bold text-white md:text-2xl">
                {company.name || 'MEDINSURE'}
              </div>
              <p className="text-xs leading-relaxed opacity-70 md:text-sm">
                {footer.address || '주소 정보가 등록되지 않았습니다.'}
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
              </ul>
            </div>

            <div className="col-span-2 space-y-3 md:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white md:mb-4 md:text-sm">
                Contact
              </h4>
              <p className="text-xl font-bold text-white md:text-3xl">
                {footer.phone || '연락처 미등록'}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-screen-2xl border-t border-slate-800 pt-5 text-xs md:mt-12 md:pt-8 md:text-sm">
            {footer.copyright ||
              `© ${new Date().getFullYear()} MEDINSURE. All rights reserved.`}
          </div>
        </footer>
      )}
    </div>
  );
};

export default MedinsureViewer;