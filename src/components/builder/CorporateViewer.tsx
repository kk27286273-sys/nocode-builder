'use client';

import React from 'react';
import { B2BTemplateData } from '@/types/template';
import { motion, AnimatePresence } from 'framer-motion';

interface CorporateViewerProps {
  data: B2BTemplateData;
  activeSection: string;
  setActiveSection: (section: any) => void;
}

export default function CorporateViewer({ data, activeSection, setActiveSection }: CorporateViewerProps) {
  
  return (
    <div className="flex flex-col min-h-full bg-white font-sans text-gray-900 overflow-x-hidden">
      {/* 🚩 [수정] 뷰어 내부 뒤로가기 바 완전 제거 -> page.tsx 헤더에서 제어함 */}

      {/* GNB (에이텍 스타일) - z-index를 높여 최상단 유지 */}
      <header className="sticky top-0 w-full bg-white border-b z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-black cursor-pointer text-blue-900" onClick={() => setActiveSection('main')}>
            {data.company?.name || '(회사명을 입력하세요)'}
          </div>
          <nav className="flex items-center gap-6">
            {data.navigation?.menus?.map((menu, idx) => (
              <div key={idx} className="relative group cursor-pointer">
                <span className="font-bold text-gray-700 group-hover:text-blue-700 transition-colors">{menu.label}</span>
                <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-white border-t-2 border-blue-700 shadow-xl z-50">
                  {menu.children?.map((child, cIdx) => (
                    <div 
                      key={cIdx} 
                      onClick={() => setActiveSection(child.targetId as any)} 
                      className="px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-700"
                    >
                      {child.label}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={() => setActiveSection('cs')} className="bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-800 transition-all">
              문의하기
            </button>
          </nav>
        </div>
      </header>

      {/* 🚩 [수정] main 영역: flex-1을 주어 푸터를 아래로 밀어내고, 짤림 방지를 위해 relative 설정 */}
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {activeSection === 'main' && (
            <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* 에이텍 메인: 풀스크린 히어로 */}
              <section className="relative h-[85vh] flex items-center justify-center text-center text-white" 
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${data.hero?.mediaUrl || 'https://via.placeholder.com/1920x1080'})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center' 
                }}>
                <div className="max-w-4xl px-6">
                  <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">{data.hero?.title || '(메인 타이틀을 입력하세요)'}</h1>
                  <p className="text-xl md:text-2xl opacity-90 mb-10">{data.hero?.subtitle || '(서브 타이틀을 입력하세요)'}</p>
                  <button onClick={() => setActiveSection('sol')} className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all">
                    사업영역 살펴보기
                  </button>
                </div>
              </section>
            </motion.div>
          )}

          {activeSection === 'ceo' && (
            <motion.div key="ceo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border shadow-xl">
                <img src={data.corporateInfo?.ceoGreeting?.image || 'https://via.placeholder.com/600'} alt="CEO" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-6">
                <h2 className="text-4xl font-black text-blue-900 leading-tight">{data.corporateInfo?.ceoGreeting?.title || '(인사말 제목을 입력하세요)'}</h2>
                <p className="text-lg leading-relaxed text-gray-600 whitespace-pre-line">{data.corporateInfo?.ceoGreeting?.content || '(인사말 내용을 입력하세요)'}</p>
              </div>
            </motion.div>
          )}

          {/* 나머지 섹션들: 동일한 레이아웃 구조 적용 */}
          {activeSection !== 'main' && activeSection !== 'ceo' && (
            <motion.div key="other" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-32 px-6 text-center">
               <div className="max-w-4xl mx-auto p-16 bg-slate-50 border rounded-3xl shadow-sm">
                  <h2 className="text-3xl font-black text-blue-900 mb-6 uppercase">{activeSection} 페이지</h2>
                  <p className="text-gray-500 text-lg">에디터에서 내용을 입력하면 에이텍 스타일의 레이아웃으로 출력됩니다.</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 🚩 [수정] 푸터: 최하단 고정 및 짤림 방지 */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800 w-full">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8 text-xs text-slate-400">
          <div className="space-y-3">
            <div className="text-xl font-bold text-white">{data.company?.name || '(회사명)'}</div>
            <p className="leading-relaxed">
              주소: {data.footer?.address || '(주소를 입력하세요)'}<br />
              대표: {data.footer?.ownerName || '(대표자명)'} | 사업자번호: {data.footer?.businessNumber || '(000-00-00000)'}
            </p>
          </div>
          <div className="text-right space-y-2">
            <div className="text-sm font-bold text-white mb-2">Contact</div>
            <p className="text-2xl font-bold text-sky-400">{data.supportPhone || '(전화번호)'}</p>
            <p>Email: {data.footer?.contactEmail || '(email@example.com)'}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-slate-800 text-center text-gray-500 text-[10px]">
          © {new Date().getFullYear()} {data.company?.name || 'Company'}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}