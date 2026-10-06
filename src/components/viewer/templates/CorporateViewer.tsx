import React, { useState } from 'react';
import { SiteData } from '@/types/template';

export const CorporateViewer = ({ data }: { data: SiteData }) => {
  const { company, specifics } = data;
  const corpData = specifics as any;
  
  // 상세 보기 모달 상태 관리
  const [selectedArea, setSelectedArea] = useState<any>(null);

  // 부드러운 스크롤 함수
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 scroll-smooth">
      {/* GNB: 라우팅 기능 강화 */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <img src={company.logoUrl} alt="logo" className="h-8 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <button onClick={() => scrollToSection('about')} className="hover:text-sky-600 transition">회사소개</button>
          <button onClick={() => scrollToSection('business')} className="hover:text-sky-600 transition">사업영역</button>
          <button onClick={() => scrollToSection('history')} className="hover:text-sky-600 transition">연혁</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-sky-600 transition">문의하기</button>
        </div >
      </nav>

      {/* 히어로 섹션 */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
        <img src={corpData.hero?.mediaUrl} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="hero" />
        <div className="relative z-10 text-center px-4">
          <span className="inline-block px-3 py-1 bg-sky-600 text-xs font-bold rounded-full mb-4">{corpData.hero?.badge}</span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">{corpData.hero?.title}</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">{corpData.hero?.subtitle}</p>
        </div >
      </section>

      {/* 회사 소개 섹션 */}
      <section id="about" className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">About Us</h2>
        <p className="text-lg leading-relaxed text-slate-600 whitespace-pre-wrap">{corpData.about?.greeting}</p>
      </section>

      {/* 사업 영역 섹션: 클릭 시 상세 뷰어 오픈 */}
      <section id="business" className="py-20 bg-slate-50 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Our Business</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {corpData.businessAreas?.map((area: any, idx: number) => (
              <div 
                key={idx} 
                onClick={() => setSelectedArea(area)} // 클릭 시 상세 데이터 설정
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200 flex flex-col md:flex-row cursor-pointer hover:border-sky-500 transition-all group"
              >
                <img src={area.image} className="w-full md:w-1/3 h-48 object-cover group-hover:scale-105 transition duration-300" alt={area.title} />
                <div className="p-6 flex-1">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-sky-600 transition">{area.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{area.description}</p>
                  <span className="text-xs font-bold text-sky-600">자세히 보기 →</span>
                </div >
              </div >
            ))}
          </div >
        </div >
      </section>

      {/* [추가] 상세 내용 오버레이 뷰어 (Modal) */}
      {selectedArea && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedArea(null)}>
          <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl transition-all transform animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="relative h-64">
              <img src={selectedArea.image} className="w-full h-full object-cover" alt={selectedArea.title} />
              <button onClick={() => setSelectedArea(null)} className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full flex items-center justify-center text-xl font-bold transition">✕</button>
            </div >
            <div className="p-8">
              <h3 className="text-3xl font-bold mb-4">{selectedArea.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{selectedArea.fullDescription || selectedArea.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedArea.details?.map((d: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-sky-600 font-bold">✓</span>
                    <span className="text-sm text-slate-700">{d}</span>
                  </div >
                ))}
              </div >
              <button onClick={() => setSelectedArea(null)} className="w-full mt-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition">닫기</button>
            </div >
          </div >
        </div>
      )}

      {/* 연혁 섹션 (id 추가) */}
      <section id="history" className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">History</h2>
        <div className="space-y-8 border-l-2 border-slate-200 pl-8 ml-4">
          {corpData.history?.map((item: any, idx: number) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[41px] top-1 w-4 h-4 bg-sky-600 rounded-full border-4 border-white shadow-sm"></div>
              <span className="text-sm font-bold text-sky-600">{item.year}</span>
              <h4 className="text-lg font-bold mt-1">{item.title}</h4>
              <p className="text-slate-500 text-sm">{item.content}</p>
            </div >
          ))}
        </div >
      </section>

      {/* 문의 섹션 (id 추가) */}
      <section id="contact" className="py-20 bg-slate-900 text-white px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
        <p className="text-slate-400 mb-10">전문가와 상담하여 최적의 솔루션을 찾아보세요.</p>
        <button className="px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-full transition shadow-lg">문의하기 신청</button>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center text-xs border-t border-slate-800">
        <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
      </footer >
    </div >
  );
};