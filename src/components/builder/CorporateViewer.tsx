'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CorporateViewerProps {
  data: any; 
  activeSection?: string;
  setActiveSection?: (section: string) => void;
}

export default function CorporateViewer({ data, activeSection: propSection, setActiveSection: propSetSection }: CorporateViewerProps) {
  if (!data) return <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>데이터를 불러오는 중입니다...</div>;

  const { 
    company = {}, 
    navigation = {}, 
    themeColor = '#0284C7', 
    footer = {}
  } = data;
  
  const [internalPage, setInternalPage] = useState('main');
  const activePage = propSection || internalPage;
  const setActivePage = propSetSection || setInternalPage;

  const navigateTo = (targetId: string) => {
    setActivePage(targetId);
    window.scrollTo(0, 0);
  };

  // [상단 네비게이션] - 에이텍 스타일
  const Navbar = () => (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'white', borderBottom: '1px solid #ddd', height: '80px', display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigateTo('main')}>
          {company?.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} style={{ height: '40px' }} />
          ) : (
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: themeColor }}>{company?.name || '회사명'}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '30px' }}>
          {(navigation?.navLinks || []).map((menu: any) => (
            <button 
              key={menu.label}
              onClick={() => navigateTo(menu.targetId)}
              style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                cursor: 'pointer', 
                border: 'none', 
                backgroundColor: 'transparent',
                color: activePage === menu.targetId ? themeColor : '#333',
                borderBottom: activePage === menu.targetId ? `3px solid ${themeColor}` : 'none',
                paddingBottom: '5px'
              }}
            >
              {menu.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );

  // [페이지별 콘텐츠]
  const renderPage = () => {
    switch (activePage) {
      case 'main':
        return (
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>{company?.name}에 오신 것을 환영합니다.</h1>
            <p style={{ fontSize: '20px', color: '#666' }}>최고의 기술력으로 미래를 선도하는 기업입니다.</p>
          </div>
        );
      case 'about': // 회사소개
        return (
          <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', borderLeft: `6px solid ${themeColor}`, paddingLeft: '15px', marginBottom: '30px' }}>회사소개</h2>
            <div style={{ lineHeight: '1.8', fontSize: '16px', color: '#444' }}>
              <p>여기에 회사의 비전, 경영 철학, 연혁 등 상세 내용을 입력하세요.</p>
              <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                <strong>CEO 메시지:</strong> 고객의 가치를 최우선으로 생각하는 기업이 되겠습니다.
              </div>
            </div>
          </div>
        );
      case 'business': // 사업소개
        return (
          <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', borderLeft: `6px solid ${themeColor}`, paddingLeft: '15px', marginBottom: '30px' }}>사업소개</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px' }}>
                <h3 style={{ color: themeColor, marginBottom: '10px' }}>핵심 솔루션 A</h3>
                <p>사업 분야의 상세 설명이 들어갑니다.</p>
              </div>
              <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px' }}>
                <h3 style={{ color: themeColor, marginBottom: '10px' }}>핵심 솔루션 B</h3>
                <p>사업 분야의 상세 설명이 들어갑니다.</p>
              </div>
            </div>
          </div>
        );
      case 'cs': // 고객센터/문의하기
        return (
          <div style={{ padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px' }}>고객센터 문의</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="성함" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }} />
              <input type="email" placeholder="이메일" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }} />
              <textarea placeholder="문의내용" rows={5} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}></textarea>
              <button style={{ padding: '15px', backgroundColor: themeColor, color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>문의하기 제출</button>
            </form>
          </div>
        );
      default:
        return (
          <div style={{ padding: '100px 20px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px' }}>{activePage} 페이지 준비 중입니다.</h2>
            <button onClick={() => navigateTo('main')} style={{ marginTop: '20px', color: themeColor, cursor: 'pointer', border: 'none', background: 'none', textDecoration: 'underline' }}>홈으로 돌아가기</button>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', color: '#333', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 240px)' }}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={activePage} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer style={{ backgroundColor: '#f4f4f4', color: '#666', padding: '40px 20px', borderTop: '1px solid #ddd' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>{company?.name}</div>
            <p style={{ fontSize: '13px' }}>{footer?.address} | {footer?.contactEmail}</p>
          </div>
          <div style={{ fontSize: '13px' }}>
            © {new Date().getFullYear()} {company?.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}