'use client';

import React, { useState } from 'react';
import { B2BTemplateData } from '@/types/template';
import { motion, AnimatePresence } from 'framer-motion';

interface CorporateViewerProps {
  data: B2BTemplateData;
}

export default function CorporateViewer({ data }: CorporateViewerProps) {
  const [activeSection, setActiveSection] = useState<'main' | 'ceo' | 'mission' | 'org' | 'ci' | 'location' | 'sol' | 'news' | 'video' | 'talent' | 'benefit' | 'cs'>('main');

  const renderNav = () => {
    return (data.navigation?.menus || []).map((menu, idx) => (
      <div key={idx} className="relative group px-4 py-5 cursor-pointer">
        <span className="font-bold text-gray-800 hover:text-blue-700 transition-colors">
          {menu.label}
        </span>
        <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-white border-t-2 border-blue-700 shadow-xl z-50">
          {(menu.children || []).map((child, cIdx) => (
            <div 
              key={cIdx} 
              onClick={() => setActiveSection(child.targetId as any)}
              className="px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-700 transition-all"
            >
              {child.label}
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="relative min-h-screen bg-white font-sans text-gray-900">
      {activeSection !== 'main' && (
        <div className="sticky top-20 z-40 bg-slate-900 text-white px-6 py-2.5 flex items-center justify-between shadow-md">
          <span className="text-xs font-semibold text-slate-300">
            현재 페이지: <strong className="text-white uppercase">{activeSection}</strong>
          </span>
          <button onClick={() => setActiveSection('main')} className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition">
            ← 메인으로 돌아가기
          </button>
        </div>
      )}

      <header className="sticky top-0 w-full bg-white/95 backdrop-blur-md border-b z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-black cursor-pointer text-blue-900" onClick={() => setActiveSection('main')}>
            {data.company?.name || '회사명을 입력하세요'}
          </div>
          <nav className="flex items-center">
            {renderNav()}
            <button onClick={() => setActiveSection('cs')} className="ml-4 bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-800 transition-all">
              문의하기
            </button>
          </nav>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {activeSection === 'main' && (
            <motion.section 
              key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="relative h-[80vh] flex items-center justify-center text-center text-white"
              style={{ 
                backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${data.hero?.mediaUrl || 'https://via.placeholder.com/1920x1080'})`,
                backgroundSize: 'cover', backgroundPosition: 'center'
              }}
            >
              <div className="max-w-4xl px-6">
                <span className="inline-block px-4 py-1 bg-blue-600 text-xs font-bold rounded-full mb-6">{data.hero?.badge || 'OFFICIAL'}</span>
                <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight whitespace-pre-line">{data.hero?.title || '메인 타이틀을 입력하세요'}</h1>
                <p className="text-lg md:text-xl opacity-90 mb-10 whitespace-pre-line">{data.hero?.subtitle || '서브 타이틀을 입력하세요'}</p>
                <button onClick={() => setActiveSection('sol')} className="bg-white text-blue-900 px-8 py-3.5 rounded-full font-bold text-base hover:bg-gray-100 transition-all">
                  사업영역 살펴보기
                </button>
              </div>
            </motion.section>
          )}

          {activeSection === 'ceo' && (
            <motion.section key="ceo" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border">
                <img src={data.corporateInfo?.ceoGreeting?.image || 'https://via.placeholder.com/600'} alt="CEO" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-3xl font-black mb-6 text-blue-900">{data.corporateInfo?.ceoGreeting?.title || 'CEO 인사말 제목'}</h2>
                <p className="text-base leading-relaxed text-gray-700 whitespace-pre-line">{data.corporateInfo?.ceoGreeting?.content || '인사말 내용을 입력하세요.'}</p>
              </div>
            </motion.section>
          )}

          {activeSection === 'sol' && (
            <motion.section key="sol" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 max-w-7xl mx-auto px-6 bg-gray-50">
              <h2 className="text-3xl font-black text-center mb-12">사업 영역 (Solutions)</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {(data.solutions || []).map((sol, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border hover:shadow-lg transition">
                    <div className="h-44 bg-gray-100 rounded-xl mb-5 overflow-hidden">
                      <img src={sol.image || 'https://via.placeholder.com/400x300'} alt={sol.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-blue-600 font-bold text-xs mb-1 block">{sol.category || '카테고리'}</span>
                    <h3 className="text-xl font-bold mb-3">{sol.title || '솔루션 제목'}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{sol.description || '상세 설명을 입력하세요.'}</p>
                    <ul className="space-y-1.5 border-t pt-3">
                      {(sol.detailedFeatures || []).map((f, fIdx) => (
                        <li key={fIdx} className="text-xs text-gray-500">
                          <strong className="text-gray-700">• {f.featureTitle || '특징'}:</strong> {f.featureContent || '내용'}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* 기타 섹션들... (동일 패턴 유지) */}
          {['mission', 'location', 'org', 'ci', 'news', 'video', 'talent', 'benefit'].includes(activeSection) && (
            <motion.section key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 max-w-4xl mx-auto px-6 text-center">
               <div className="p-12 bg-slate-50 border rounded-2xl">
                  <h2 className="text-2xl font-black text-blue-900 mb-4 uppercase">{activeSection}</h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {activeSection === 'mission' ? data.corporateInfo?.missionVision?.mission : 
                     activeSection === 'location' ? data.corporateInfo?.location?.headOffice?.address : 
                     '에디터에서 내용을 입력하십시오.'}
                  </p>
               </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8 text-xs text-slate-400">
          <div className="space-y-2">
            <div className="text-lg font-bold text-white">{data.company?.name || '회사명'}</div>
            <p className="leading-relaxed">
              주소: {data.footer?.address || '주소 미입력'}<br />
              대표: {data.footer?.ownerName || '대표자명'} | 사업자번호: {data.footer?.businessNumber || '000-00-00000'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-white mb-2">Contact</div>
            <p className="text-xl font-bold text-sky-400">{data.supportPhone || '전화번호'}</p>
            <p>Email: {data.footer?.contactEmail || 'email@company.com'}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-[10px]">
          © {new Date().getFullYear()} {data.company?.name || 'Company'}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}