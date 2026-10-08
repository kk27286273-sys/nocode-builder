'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CorporateViewerProps {
  data: any; 
  activeSection?: string;
  setActiveSection?: (section: string) => void;
}

export default function CorporateViewer({ data, activeSection: propSection, setActiveSection: propSetSection }: CorporateViewerProps) {
  if (!data) return <div className="p-10 text-center text-slate-400">데이터를 불러오는 중입니다...</div>;

  const { 
    company = {}, 
    navigation = {}, 
    solutions = [], 
    hero = {}, 
    themeColor = '#0284C7', 
    footer = {},
    faqs = [],
    stats = [],
    reviews = [],
    reviewsSection = {},
    solutionsSection = {},
    partnersSection = {}
  } = data;
  
  const [internalPage, setInternalPage] = useState('main');
  const activePage = propSection || internalPage;
  const setActivePage = propSetSection || setInternalPage;
  const [selectedSolution, setSelectedSolution] = useState<number | null>(null);

  const navigateTo = (targetId: string) => {
    setActivePage(targetId);
    window.scrollTo(0, 0);
  };

  const Navbar = () => (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="cursor-pointer flex items-center gap-2" onClick={() => navigateTo('main')}>
          {company?.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} className="h-10 object-contain" />
          ) : (
            <span className="text-2xl font-black tracking-tighter" style={{ color: themeColor }}>{company?.name || '회사명'}</span>
          )}
        </div>
        <div className="hidden md:flex gap-8">
          {(navigation?.navLinks || []).map((menu: any) => (
            <button 
              key={menu.label}
              className={`text-sm font-bold transition-colors ${activePage === menu.targetId ? 'text-blue-600' : 'text-slate-600 hover:text-blue-500'}`}
              onClick={() => navigateTo(menu.targetId)}
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
{/* Hero Section */}
<section style={{ 
  position: 'relative', 
  height: '600px', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  color: 'white', 
  backgroundColor: '#0f172a', // slate-900
  overflow: 'hidden' 
}}>
  <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px' }}>
    <span style={{ 
      display: 'inline-block', 
      padding: '6px 16px', 
      borderRadius: '9999px', 
      backgroundColor: '#2563eb', 
      fontSize: '12px', 
      fontWeight: 'bold', 
      marginBottom: '24px' 
    }}>
      {hero?.badge || 'Premium Service'}
    </span>
    <h1 style={{ 
      fontSize: '48px', 
      fontWeight: '900', 
      marginBottom: '24px', 
      lineHeight: '1.2', 
      whiteSpace: 'pre-line' 
    }}>
      {hero?.title || '타이틀을 입력하세요'}
    </h1>
    <p style={{ 
      fontSize: '20px', 
      color: '#cbd5e1', 
      maxWidth: '800px', 
      margin: '0 auto', 
      lineHeight: '1.6', 
      whiteSpace: 'pre-line' 
    }}>
      {hero?.subtitle || '서브타이틀을 입력하세요'}
    </p>
  </div>
</section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat: any, idx: number) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-black mb-2" style={{ color: themeColor }}>{stat.value}</div>
              <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">{solutionsSection?.title || 'Our Solutions'}</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">{solutionsSection?.subtitle}</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.length > 0 ? solutions.map((sol: any, idx: number) => (
            <div 
              key={idx} 
              onClick={() => { setSelectedSolution(idx); navigateTo('sol_detail'); }} 
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-slate-200"
            >
              <div className="h-56 overflow-hidden bg-slate-200">
                <img src={sol.image || 'https://via.placeholder.com/400x300'} alt={sol.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">{sol.category}</span>
                <h3 className="text-2xl font-bold mt-2 mb-3 text-slate-900">{sol.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{sol.description}</p>
              </div>
            </div>
          )) : <div className="col-span-3 text-center py-20 text-slate-400">솔루션 데이터가 없습니다.</div>}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">{reviewsSection?.title || 'Customer Reviews'}</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">{reviewsSection?.subtitle}</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev: any, idx: number) => (
            <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
              <p className="text-slate-700 text-lg italic mb-6 leading-relaxed">"{rev.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-300" />
                <div>
                  <div className="font-bold text-slate-900">{rev.author}</div>
                  <div className="text-xs text-slate-500">{rev.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          {activePage === 'main' && <MainHome key="main" />}
          {activePage !== 'main' && (
             <div className="py-40 text-center">
               <h2 className="text-3xl font-bold mb-4">{activePage} 페이지</h2>
               <p className="text-slate-500">현재 준비 중인 페이지입니다.</p>
               <button onClick={() => navigateTo('main')} className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-full font-bold transition-transform hover:scale-105">홈으로 돌아가기</button>
             </div>
          )}
        </AnimatePresence>
      </main>
      <footer className="bg-slate-900 text-slate-400 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="text-left">
            <div className="text-2xl font-black text-white mb-6" style={{ color: themeColor }}>{company?.name || '회사명'}</div>
            <p className="text-sm leading-relaxed mb-4">{footer?.address}</p>
            <p className="text-sm font-medium text-white">{footer?.contactEmail}</p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-white font-bold mb-4">Customer Support</div>
            <div className="text-2xl font-bold text-white mb-2">{data.supportPhone || '010-0000-0000'}</div>
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} {company?.name || 'TH SOFT'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}