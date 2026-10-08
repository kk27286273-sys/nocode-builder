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

  // [에이텍 스타일] 정교한 상단 GNB
  const Navbar = () => (
    <nav className="sticky top-0 z-[100] w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="cursor-pointer flex items-center gap-3" onClick={() => navigateTo('main')}>
          {company?.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} className="h-10 w-auto object-contain" />
          ) : (
            <span className="text-2xl font-extrabold tracking-tight" style={{ color: themeColor }}>{company?.name || 'COMPANY'}</span>
          )}
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          {(navigation?.navLinks || navigation?.menus || []).map((menu: any) => (
            <div key={menu.label} className="group relative py-8">
              <button 
                className={`text-[15px] font-semibold transition-colors duration-200 ${activePage === menu.targetId ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'}`}
                onClick={() => navigateTo(menu.targetId || 'main')}
              >
                {menu.label}
              </button>
              {menu.children && (
                <div className="absolute top-20 left-0 w-56 bg-white border border-slate-100 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-4 rounded-b-lg">
                  {menu.children.map((child: any) => (
                    <button 
                      key={child.label} 
                      onClick={() => navigateTo(child.targetId)} 
                      className="block w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-md transition-colors"
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

  // [에이텍 스타일] 압도적인 메인 홈
  const MainHome = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
      {/* Hero Section: 에이텍 특유의 와이드한 비주얼 */}
      <section className="relative h-[85vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          {hero?.mediaUrl ? (
            <img src={hero.mediaUrl} alt="hero" className="w-full h-full object-cover brightness-50" />
          ) : (
            <div className="w-full h-full bg-slate-900" />
          )}
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <motion.span 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
            className="inline-block px-4 py-1.5 rounded-full bg-blue-600 text-sm font-bold mb-8 uppercase tracking-wider"
          >
            {hero?.badge || 'Global Standard'}
          </motion.span>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} 
            className="text-5xl md:text-7xl font-black mb-8 leading-tight whitespace-pre-line tracking-tight"
          >
            {hero?.title || '미래를 선도하는 기술력'}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} 
            className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed whitespace-pre-line font-light"
          >
            {hero?.subtitle || '최고의 솔루션으로 고객의 가치를 실현합니다.'}
          </motion.p>
        </div>
      </section>

      {/* Solution Section: 전문적인 비즈니스 그리드 */}
      <section className="py-32 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Core Business</h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {solutions?.map((sol: any, idx: number) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -15 }}
                onClick={() => navigateTo('sol_detail')}
                className="bg-slate-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-slate-100"
              >
                <div className="h-64 overflow-hidden bg-slate-200">
                  {sol.image ? (
                    <img src={sol.image} alt={sol.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                </div>
                <div className="p-10">
                  <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">{sol.category}</span>
                  <h3 className="text-2xl font-bold mt-3 mb-4 text-slate-900">{sol.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-light">{sol.description}</p>
                  <div className="mt-8 text-blue-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                    자세히 보기 <span className="text-xl">&rarr;</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );

  // [에이텍 스타일] 전문 서브페이지 레이아웃
  const PageLayout = ({ title, content }: { title: string; content: React.ReactNode }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-24 px-4 w-full bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end gap-6 mb-16 border-b border-slate-200 pb-8">
          <div className="w-2 h-12 bg-blue-600"></div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tight">{title}</h2>
        </div>
        <div className="w-full">{content}</div>
      </div>
    </motion.div>
  );

  // 솔루션 상세 (에이텍 스타일)
  const SolutionDetail = () => {
    const sol = solutions?.[0]; // 현재는 첫번째 예시
    if (!sol) return <div className="py-24 text-center">정보를 찾을 수 없습니다.</div>;
    return (
      <PageLayout title={sol.category}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="rounded-3xl overflow-hidden shadow-2xl bg-slate-200 aspect-video">
            {sol.image ? <img src={sol.image} alt={sol.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>}
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-6 text-slate-900 leading-tight">{sol.title}</h3>
            <p className="text-xl text-slate-600 leading-relaxed mb-10 font-light">{sol.description}</p>
            <button onClick={() => navigateTo('cs')} className="px-10 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
              솔루션 문의하기
            </button>
          </div>
        </div>
      </PageLayout>
    );
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 font-sans">
      <Navbar />
      <main className="w-full">
        <AnimatePresence mode="wait">
          {activePage === 'main' && <MainHome key="main" />}
          {activePage === 'sol_detail' && <SolutionDetail key="sol_detail" />}
          {activePage === 'cs' && (
            <PageLayout title="고객센터" content={
              <div className="text-center max-w-3xl mx-auto space-y-12 py-10">
                <p className="text-2xl text-slate-600 leading-relaxed whitespace-pre-line font-light">
                  {data.csGuide || '전문가와의 상담을 통해 최적의 솔루션을 제안해 드립니다.'}
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-6">
                  {data.supportPhone && (
                    <a href={`tel:${data.supportPhone}`} className="px-10 py-5 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all shadow-xl">📞 전화 상담: {data.supportPhone}</a>
                  )}
                  {data.kakaoLink && (
                    <a href={data.kakaoLink} target="_blank" className="px-10 py-5 bg-yellow-400 text-slate-900 font-bold rounded-full hover:bg-yellow-500 transition-all shadow-xl">💬 카카오톡 상담</a>
                  )}
                </div>
              </div>
            } />
          )}
          {activePage !== 'main' && activePage !== 'sol_detail' && activePage !== 'cs' && (
            <PageLayout title="준비 중인 페이지" content={<p className="text-center text-slate-500 py-20">해당 콘텐츠는 현재 업데이트 중입니다.</p>} />
          )}
        </AnimatePresence>
      </main>
      <footer className="bg-slate-900 text-slate-400 py-20 px-6 w-full border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div>
            <div className="text-2xl font-bold text-white mb-8 tracking-tight">{company?.name || 'COMPANY'}</div>
            <p className="text-sm leading-relaxed mb-8 opacity-70">{footer?.address || ''}<br/>TEL: {data.supportPhone || ''}</p>
            <p className="text-xs opacity-50">COPYRIGHT Ⓒ {new Date().getFullYear()} {company?.name || 'Company'}. ALL RIGHTS RESERVED.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigateTo('main')}>홈으로</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigateTo('sol_detail')}>사업소개</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigateTo('cs')}>고객센터</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">Customer Support</h4>
            <p className="text-3xl font-bold text-white mb-4">{data.supportPhone || '000-0000-0000'}</p>
            <p className="text-sm opacity-70">{footer?.contactEmail || ''}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CorporateViewer;