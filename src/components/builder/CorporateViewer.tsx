'use client';

import React, { useState } from 'react';
import { B2BTemplateData } from '@/types/template';
import { motion, AnimatePresence } from 'framer-motion';

interface CorporateViewerProps {
  data: B2BTemplateData;
}

export default function CorporateViewer({ data }: CorporateViewerProps) {
  // 현재 보여줄 섹션 상태 (기본값: 'main')
  const [activeSection, setActiveSection] = useState<'main' | 'ceo' | 'mission' | 'org' | 'ci' | 'location' | 'sol' | 'news' | 'video' | 'talent' | 'benefit' | 'cs'>('main');

  // 네비게이션 메뉴 구성
  const renderNav = () => {
    return data.navigation.menus.map((menu, idx) => (
      <div key={idx} className="relative group px-4 py-5 cursor-pointer">
        <span className="font-bold text-gray-800 hover:text-blue-700 transition-colors">
          {menu.label}
        </span>
        {/* 메가 메뉴 드롭다운 */}
        <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-white border-t-2 border-blue-700 shadow-xl z-50">
          {menu.children.map((child, cIdx) => (
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
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* 🚩 [추가] 뒤로가기 플로팅 버튼: 메인이 아닐 때만 부드럽게 등장 */}
      <AnimatePresence>
        {activeSection !== 'main' && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => setActiveSection('main')}
            className="fixed top-24 left-6 z-[110] flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-bold rounded-full backdrop-blur-md shadow-2xl transition-all group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            메인으로 돌아가기
          </motion.button>
        )}
      </AnimatePresence>

      {/* 1. 상단 헤더 & 메가 메뉴 */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b z-[100]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="text-2xl font-black cursor-pointer text-blue-900" 
            onClick={() => setActiveSection('main')}
          >
            {data.company.name}
          </div>
          <nav className="flex items-center">
            {renderNav()}
            <button 
              onClick={() => setActiveSection('cs')}
              className="ml-4 bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-800 transition-all"
            >
              문의하기
            </button>
          </nav>
        </div>
      </header>

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {/* 메인 히어로 섹션 */}
          {activeSection === 'main' && (
            <motion.section 
              key="main"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="relative h-screen flex items-center justify-center text-center text-white"
              style={{ 
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${data.hero.mediaUrl || 'https://via.placeholder.com/1920x1080'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="max-w-4xl px-6">
                <span className="inline-block px-4 py-1 bg-blue-600 text-xs font-bold rounded-full mb-6">{data.hero.badge}</span>
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">{data.hero.title}</h1>
                <p className="text-xl md:text-2xl opacity-90 mb-10">{data.hero.subtitle}</p>
                <button 
                  onClick={() => setActiveSection('sol')}
                  className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all"
                >
                  사업영역 살펴보기
                </button>
              </div>
            </motion.section>
          )}

          {/* CEO 인사말 */}
          {activeSection === 'ceo' && (
            <motion.section 
              key="ceo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center"
            >
              <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                <img src={data.corporateInfo.ceoGreeting.image || 'https://via.placeholder.com/600'} alt="CEO" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-4xl font-black mb-8 text-blue-900">{data.corporateInfo.ceoGreeting.title}</h2>
                <p className="text-lg leading-relaxed text-gray-600 whitespace-pre-line">{data.corporateInfo.ceoGreeting.content}</p>
              </div>
            </motion.section>
          )}

          {/* 사업 영역 (솔루션 리스트) */}
          {activeSection === 'sol' && (
            <motion.section 
              key="sol" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="py-24 bg-gray-50"
            >
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-black text-center mb-16">Our Solutions</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {data.solutions.map((sol, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-3xl border hover:border-blue-500 transition-all shadow-sm hover:shadow-xl group">
                      <div className="h-48 bg-gray-100 rounded-xl mb-6 overflow-hidden">
                        <img src={sol.image || 'https://via.placeholder.com/400x300'} alt={sol.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <span className="text-blue-600 font-bold text-sm mb-2 block">{sol.category}</span>
                      <h3 className="text-2xl font-bold mb-4">{sol.title}</h3>
                      <p className="text-gray-500 mb-6">{sol.description}</p>
                      <ul className="space-y-2 mb-8">
                        {sol.detailedFeatures.map((f, fIdx) => (
                          <li key={fIdx} className="text-sm text-gray-600 flex items-start">
                            <span className="text-blue-500 mr-2">•</span> {f.featureTitle}: {f.featureContent}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* 나머지 섹션들 */}
          {(activeSection === 'mission' || activeSection === 'org' || activeSection === 'ci' || activeSection === 'location') && (
            <motion.section 
              key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="py-24 max-w-7xl mx-auto px-6 text-center"
            >
              <h2 className="text-4xl font-black mb-12 text-blue-900">회사 정보</h2>
              <div className="bg-gray-100 p-20 rounded-3xl text-2xl font-medium">
                {activeSection === 'mission' && <div><p className="mb-4 font-bold text-blue-600">Mission</p><p>{data.corporateInfo.missionVision.mission}</p></div>}
                {activeSection === 'location' && <div><p className="mb-4 font-bold text-blue-600">Location</p><p>{data.corporateInfo.location.headOffice.address}</p></div>}
                <p className="mt-8 text-gray-400 text-lg">상세 내용을 에디터에서 수정하세요.</p>
              </div>
            </motion.section>
          )}

          {/* 고객센터/문의하기 */}
          {activeSection === 'cs' && (
            <motion.section 
              key="cs" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="py-24 max-w-3xl mx-auto px-6"
            >
              <div className="bg-white border-2 border-blue-100 p-10 rounded-3xl shadow-2xl">
                <h2 className="text-3xl font-black text-center mb-10">상담 신청하기</h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">성함 / 담당자명 *</label>
                    <input type="text" className="w-full px-4 py-3 border rounded-xl focus:ring-2 ring-blue-500 outline-none" placeholder="홍길동" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">연락처 *</label>
                    <input type="text" className="w-full px-4 py-3 border rounded-xl focus:ring-2 ring-blue-500 outline-none" placeholder="010-0000-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">문의 내용 *</label>
                    <textarea className="w-full px-4 py-3 border rounded-xl h-32 focus:ring-2 ring-blue-500 outline-none" placeholder="문의 내용을 남겨주세요." />
                  </div>
                  <button className="w-full bg-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all">무료 상담 신청하기</button>
                </form>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* 3. 기업형 전용 푸터 */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div>
            <div className="text-2xl font-black mb-6">{data.company.name}</div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {data.footer.address}<br />
              대표자: {data.footer.ownerName} | 사업자번호: {data.footer.businessNumber}
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveSection('ceo')}>CEO 인사말</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveSection('sol')}>사업영역</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveSection('cs')}>고객센터</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Contact</h4>
            <p className="text-gray-400 text-sm mb-2">Email: {data.footer.contactEmail}</p>
            <p className="text-2xl font-bold">{data.supportPhone}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} {data.company.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}