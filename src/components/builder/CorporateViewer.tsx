'use client';
import React from 'react';
import { B2BTemplateData } from '@/types/template';
import { motion, AnimatePresence } from 'framer-motion';

export default function CorporateViewer({ data, activeSection, setActiveSection }: any) {
  // 🚩 [방어 로직] 데이터 구조가 깨져도 렌더링되지 않도록 기본값 설정
  const safeData = data || {};
  const companyName = safeData.company?.name || '회사명을 입력하세요';
  
  // 네비게이션 데이터 보정: 배열 형태든 객체 형태든 menus 배열을 추출함
  const getMenus = () => {
    if (!safeData.navigation) return [];
    if (Array.isArray(safeData.navigation)) return safeData.navigation; // 배열인 경우
    if (safeData.navigation.menus) return safeData.navigation.menus; // 객체 내 menus인 경우
    return [];
  };
  const menus = getMenus();

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden relative">
      {/* 🚩 [수정] sticky 제거 및 z-index 강화: 뷰포트 밖으로 밀려나는 현상 방지 */}
      <header className="relative w-full bg-white border-b z-[100]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-black cursor-pointer text-blue-900" onClick={() => setActiveSection('main')}>
            {companyName}
          </div>
          <nav className="flex items-center gap-6">
            {menus.length > 0 ? (
              menus.map((menu: any, idx: number) => (
                <div key={idx} className="relative group cursor-pointer">
                  <span className="font-bold text-gray-700 group-hover:text-blue-700 transition-colors">{menu.label}</span>
                  <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-white border-t-2 border-blue-700 shadow-xl z-[110]">
                    {menu.children?.map((child: any, cIdx: number) => (
                      <div key={cIdx} onClick={() => setActiveSection(child.targetId)} className="px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-700">{child.label}</div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400">메뉴를 설정해주세요.</span>
            )}
            <button onClick={() => setActiveSection('cs')} className="bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-800 transition-all">문의하기</button>
          </nav>
        </div>
      </header>

      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {activeSection === 'main' && (
            <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <section className="relative h-[85vh] flex items-center justify-center text-center text-white" 
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${safeData.hero?.mediaUrl || 'https://via.placeholder.com/1920x1080'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="max-w-4xl px-6">
                  {safeData.hero?.badge && <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-4">{safeData.hero.badge}</span>}
                  <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">{safeData.hero?.title || '(메인 타이틀)'}</h1>
                  <p className="text-xl md:text-2xl opacity-90 mb-10">{safeData.hero?.subtitle || '(서브 타이틀)'}</p>
                  <button onClick={() => setActiveSection('sol')} className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all">사업영역 살펴보기</button>
                </div>
              </section>
            </motion.div>
          )}

          {activeSection === 'sol' && (
            <motion.div key="sol" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-blue-900 mb-4">사업 영역</h2>
                <p className="text-gray-600">우리가 제공하는 최첨단 솔루션을 소개합니다.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {safeData.solutions && safeData.solutions.length > 0 ? (
                  safeData.solutions.map((sol: any, idx: number) => (
                    <div key={idx} className="bg-white border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                      <div className="h-48 bg-slate-200 overflow-hidden"><img src={sol.image || 'https://via.placeholder.com/400x300'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
                      <div className="p-6">
                        <span className="text-[10px] font-bold text-blue-600 uppercase">{sol.category}</span>
                        <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">{sol.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{sol.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 py-20 text-center text-gray-400 border-2 border-dashed rounded-3xl">에디터에서 솔루션을 추가해 주세요.</div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'ceo' && (
            <motion.div key="ceo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border shadow-xl"><img src={safeData.corporateInfo?.ceoGreeting?.image || 'https://via.placeholder.com/600'} className="w-full h-full object-cover" /></div>
              <div className="space-y-6">
                <h2 className="text-4xl font-black text-blue-900 leading-tight">{safeData.corporateInfo?.ceoGreeting?.title || '(인사말 제목)'}</h2>
                <p className="text-lg leading-relaxed text-gray-600 whitespace-pre-line">{safeData.corporateInfo?.ceoGreeting?.content || '(인사말 내용)'}</p>
              </div>
            </motion.div>
          )}

          {activeSection !== 'main' && activeSection !== 'ceo' && activeSection !== 'sol' && (
            <motion.div key="other" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-32 px-6 text-center">
               <div className="max-w-4xl mx-auto p-16 bg-slate-50 border rounded-3xl shadow-sm">
                  <h2 className="text-3xl font-black text-blue-900 mb-6 uppercase">{activeSection} 페이지</h2>
                  <p className="text-gray-500 text-lg">에디터에서 내용을 입력하면 에이텍 스타일의 레이아웃으로 출력됩니다.</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 🚩 [수정] 푸터 강제 노출 및 z-index 설정 */}
      <footer className="relative bg-slate-900 text-white py-12 border-t border-slate-800 w-full z-[100]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8 text-xs text-slate-400">
          <div className="space-y-3">
            <div className="text-xl font-bold text-white">{companyName}</div>
            <p className="leading-relaxed">주소: {safeData.footer?.address || '(주소)'}<br />대표: {safeData.footer?.ownerName || '(대표자)'} | 사업자번호: {safeData.footer?.businessNumber || '(번호)'}</p>
          </div>
          <div className="text-right space-y-2">
            <div className="text-sm font-bold text-white mb-2">Contact</div>
            <p className="text-2xl font-bold text-sky-400">{safeData.supportPhone || '(전화번호)'}</p>
            <p>Email: {safeData.footer?.contactEmail || '(이메일)'}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-slate-800 text-center text-gray-500 text-[10px]">
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}