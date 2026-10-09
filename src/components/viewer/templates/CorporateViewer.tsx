'use client';

import React, { useState } from 'react';
import { B2BTemplateData } from '@/types/template';
import { motion, AnimatePresence } from 'framer-motion';

interface CorporateViewerProps {
  data: B2BTemplateData;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
}

export const CorporateViewer = ({ data, activeSection: propSection, setActiveSection: propSetSection }: CorporateViewerProps) => {
  const { company, corporateInfo, solutions, hero, themeColor, footer } = data;
  
  const [internalPage, setInternalPage] = useState('main');
  const activePage = propSection || internalPage;
  const setActivePage = propSetSection || setInternalPage;

  const [selectedSolution, setSelectedSolution] = useState<number | null>(null);

  // 표준 7개 메뉴 정의 (에디터 섹션 ID와 일치시킴)
  const STANDARD_MENUS = [
    { id: 'main', label: '홈' },
    { id: 'corporateInfo', label: '기업 소개' },
    { id: 'solutions', label: '사업 소개' },
    { id: 'disclosure', label: '공시 정보' },
    { id: 'pr', label: '홍보 센터' },
    { id: 'recruit', label: '인재 경영' },
    { id: 'cs', label: '고객 센터' },
  ];

  const navigateTo = (targetId: string) => {
    setActivePage(targetId);
    window.scrollTo(0, 0);
  };

  const Navbar = () => (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
<div className="cursor-pointer" onClick={() => navigateTo('main')}>
  {/* 1. 로고 URL이 있고, 빈 문자열이 아닐 때만 이미지 출력 */}
  {company.logoUrl && company.logoUrl !== "" ? (
    <img 
      src={company.logoUrl} 
      alt={company.name} 
      className="h-10 object-contain" 
      onError={(e) => {
        // 이미지 로드 실패 시 텍스트로 대체 (에러 방지)
        e.currentTarget.style.display = 'none';
      }}
    />
  ) : (
    /* 2. 로고 이미지가 없으면 회사 이름을 테마 컬러로 출력 */
    <span className="text-2xl font-bold" style={{ color: themeColor || '#2563eb' }}>
      {company.name || 'Company Name'}
    </span>
  )}
</div>
        
        <div className="hidden md:flex gap-6">
          {STANDARD_MENUS.map((menu) => (
            <button 
              key={menu.id} 
              onClick={() => navigateTo(menu.id)}
              className={`text-sm font-medium transition-colors ${activePage === menu.id ? 'text-blue-600 font-bold' : 'text-slate-700 hover:text-blue-600'}`}
            >
              {menu.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );

  const MainHome = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="relative h-[700px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={hero.mediaUrl} alt="hero" className="w-full h-full object-cover brightness-50" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block px-4 py-1 rounded-full bg-blue-600 text-sm font-bold mb-6">
            {hero.badge}
          </motion.span>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight whitespace-pre-line">
            {hero.title}
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed whitespace-pre-line">
            {hero.subtitle}
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Solutions</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((sol, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ y: -10 }}
              onClick={() => { setSelectedSolution(idx); navigateTo('sol_detail'); }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
            >
              <div className="h-60 overflow-hidden">
                <img src={sol.image} alt={sol.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <span className="text-blue-600 font-bold text-sm uppercase">{sol.category}</span>
                <h3 className="text-2xl font-bold mt-2 mb-4">{sol.title}</h3>
                <p className="text-slate-600 leading-relaxed">{sol.description}</p>
                <div className="mt-6 text-blue-600 font-semibold flex items-center gap-2">
                  자세히 보기 <span className="text-xl">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );

  const PageLayout = ({ title, content }: { title: string; content: React.ReactNode }) => (
    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-2 h-8 bg-blue-600"></div>
          <h2 className="text-4xl font-bold">{title}</h2>
        </div>
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-sm border border-slate-100">
          {content}
        </div>
      </div>
    </motion.div>
  );

  const SolutionDetail = () => {
    const sol = solutions[selectedSolution || 0];
    return (
      <PageLayout title={sol.category}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <img src={sol.image} alt={sol.title} className="rounded-2xl shadow-2xl w-full h-96 object-cover" />
          <div>
            <h3 className="text-3xl font-bold mb-6">{sol.title}</h3>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">{sol.description}</p>
            <button onClick={() => navigateTo('cs')} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
              문의하기
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sol.detailedFeatures.map((feat, idx) => (
            <div key={idx} className="p-6 border border-slate-200 rounded-xl hover:border-blue-400 transition-colors">
              <h4 className="text-xl font-bold mb-2">{feat.featureTitle}</h4>
              <p className="text-slate-600">{feat.featureContent}</p>
            </div>
          ))}
        </div>
      </PageLayout>
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Navbar />
      
      <main>
        <AnimatePresence mode="wait">
          {activePage === 'main' && <MainHome key="main" />}
          
          {activePage === 'corporateInfo' && (
            <PageLayout title="기업 소개" content={
              <div className="space-y-16">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <img src={corporateInfo.ceoGreeting.image} className="w-64 h-80 object-cover rounded-2xl shadow-lg" />
                  <div>
                    <h3 className="text-2xl font-bold mb-6">{corporateInfo.ceoGreeting.title}</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">{corporateInfo.ceoGreeting.content}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-blue-50 rounded-2xl border-l-8 border-blue-600">
                    <h4 className="text-xl font-bold mb-4">Mission</h4>
                    <p className="text-lg leading-relaxed">{corporateInfo.missionVision.mission}</p>
                  </div>
                  <div className="p-8 bg-slate-50 rounded-2xl border-l-8 border-slate-600">
                    <h4 className="text-xl font-bold mb-4">Vision</h4>
                    <p className="text-lg leading-relaxed">{corporateInfo.missionVision.vision}</p>
                  </div>
                </div>
              </div>
            } />
          )}

          {activePage === 'solutions' && (
            <PageLayout title="사업 소개" content={
              <div className="grid grid-cols-1 gap-8">
                {solutions.map((sol, idx) => (
                  <div key={idx} className="p-8 border rounded-2xl flex flex-col md:flex-row gap-8 items-center">
                    <img src={sol.image} className="w-full md:w-64 h-40 object-cover rounded-xl" />
                    <div>
                      <span className="text-blue-600 font-bold text-sm">{sol.category}</span>
                      <h4 className="text-2xl font-bold mb-2">{sol.title}</h4>
                      <p className="text-slate-600 mb-4">{sol.description}</p>
                      <button onClick={() => { setSelectedSolution(idx); navigateTo('sol_detail'); }} className="text-blue-600 font-bold hover:underline">상세보기 →</button>
                    </div>
                  </div>
                ))}
              </div>
            } />
          )}

          {activePage === 'disclosure' && (
            <PageLayout title="공시 정보" content={
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {corporateInfo.disclosure.certifications.map((cert, idx) => (
                  <div key={idx} className="p-6 border rounded-xl text-center space-y-4">
                    <img src={cert.image} className="w-full h-40 object-contain mb-4" />
                    <h4 className="font-bold">{cert.name}</h4>
                    <p className="text-sm text-slate-500">{cert.date}</p>
                  </div>
                ))}
              </div>
            } />
          )}

          {activePage === 'pr' && (
            <PageLayout title="홍보 센터" content={
              <div className="space-y-6">
                {data.prCenter.news.map((news, idx) => (
                  <div key={idx} className="p-6 border-b flex flex-col md:flex-row gap-6">
                    <img src={news.image} className="w-full md:w-48 h-32 object-cover rounded-lg" />
                    <div className="flex-1">
                      <span className="text-xs text-slate-400">{news.date}</span>
                      <h4 className="text-xl font-bold my-2">{news.title}</h4>
                      <p className="text-slate-600">{news.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            } />
          )}

          {activePage === 'recruit' && (
            <PageLayout title="인재 경영" content={
              <div className="space-y-12">
                <div className="p-10 bg-slate-900 text-white rounded-3xl text-center">
                  <h3 className="text-3xl font-bold mb-6">우리가 찾는 인재</h3>
                  <p className="text-xl text-slate-300 leading-relaxed">{data.recruit.talentValue}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-blue-50 rounded-2xl">
                    <h4 className="text-xl font-bold mb-4">복지 혜택</h4>
                    <p className="text-slate-600 whitespace-pre-line">{data.recruit.benefitInfo}</p>
                  </div>
                </div>
              </div>
            } />
          )}

          {activePage === 'cs' && (
            <PageLayout title="고객 센터" content={
              <div className="text-center space-y-8">
                <p className="text-xl text-slate-600 leading-relaxed whitespace-pre-line">
                  {data.csGuide || '문의 내용을 입력해주세요.'}
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  <div className="p-6 border rounded-2xl space-y-2">
                    <p className="text-sm text-slate-500">이메일 문의</p>
                    <p className="text-lg font-bold">{data.csCenter.contactInfo.email}</p>
                  </div>
                  <div className="p-6 border rounded-2xl space-y-2">
                    <p className="text-sm text-slate-500">전화 상담</p>
                    <p className="text-lg font-bold">{data.csCenter.contactInfo.phone}</p>
                  </div>
                </div>
              </div>
            } />
          )}

          {activePage === 'sol_detail' && <SolutionDetail key="sol_detail" />}
        </AnimatePresence>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="text-2xl font-bold text-white mb-6">{company.name}</div>
            <p className="text-sm leading-relaxed mb-6">{footer.address}<br/>TEL: {data.supportPhone || corporateInfo.location.headOffice.tel}</p>
            <p className="text-xs">COPYRIGHT Ⓒ {new Date().getFullYear()} {company.name}. ALL RIGHTS RESERVED.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {STANDARD_MENUS.map(menu => (
                <li key={menu.id} className="hover:text-white cursor-pointer" onClick={() => navigateTo(menu.id)}>{menu.label}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Customer Support</h4>
            <p className="text-2xl font-bold text-white mb-2">{data.supportPhone || '전화번호 없음'}</p>
            <p className="text-sm">{footer.contactEmail}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};