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

  const navigateTo = (targetId: string) => {
    setActivePage(targetId);
    window.scrollTo(0, 0);
  };

  const Navbar = () => (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => navigateTo('main')}>
          {company?.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} style={{ height: '40px', objectFit: 'contain' }} />
          ) : (
            <span style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.02em', color: themeColor }}>{company?.name || '회사명'}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          {(navigation?.navLinks || []).map((menu: any) => (
            <button 
              key={menu.label}
              style={{ 
                fontSize: '14px', 
                fontWeight: '700', 
                cursor: 'pointer', 
                border: 'none', 
                backgroundColor: 'transparent',
                transition: 'color 0.2s',
                color: activePage === menu.targetId ? themeColor : '#475569' 
              }}
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
      <section style={{ position: 'relative', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', backgroundColor: '#0f172a', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px' }}>
          <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '9999px', backgroundColor: themeColor, fontSize: '12px', fontWeight: 'bold', marginBottom: '24px', color: 'white' }}>
            {hero?.badge || 'Premium Service'}
          </span>
          <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '24px', lineHeight: '1.2', whiteSpace: 'pre-line' }}>
            {hero?.title || '타이틀을 입력하세요'}
          </h1>
          <p style={{ fontSize: '20px', color: '#cbd5e1', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {hero?.subtitle || '서브타이틀을 입력하세요'}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '48px 0', backgroundColor: 'white', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
          {stats.map((stat: any, idx: number) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '900', marginBottom: '8px', color: themeColor }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions Section */}
      <section style={{ padding: '96px 0', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', color: '#0f172a' }}>{solutionsSection?.title || 'Our Solutions'}</h2>
          <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '640px', margin: '0 auto' }}>{solutionsSection?.subtitle}</p>
        </div>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {solutions.map((sol: any, idx: number) => (
            <div key={idx} onClick={() => { navigateTo('sol_detail'); }} style={{ backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'transform 0.3s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <div style={{ height: '224px', backgroundColor: '#e2e8f0' }}>
                <img src={sol.image || 'https://via.placeholder.com/400x300'} alt={sol.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '32px' }}>
                <span style={{ color: themeColor, fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{sol.category}</span>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px', marginBottom: '12px', color: '#0f172a' }}>{sol.title}</h3>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>{sol.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section style={{ padding: '96px 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', color: '#0f172a' }}>{reviewsSection?.title || 'Customer Reviews'}</h2>
          <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '640px', margin: '0 auto' }}>{reviewsSection?.subtitle}</p>
        </div>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          {reviews.map((rev: any, idx: number) => (
            <div key={idx} style={{ padding: '32px', borderRadius: '24px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '18px', color: '#334155', fontStyle: 'italic', marginBottom: '24px', lineHeight: '1.6' }}>"{rev.content}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                <div>
                  <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{rev.author}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{rev.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          {activePage === 'main' ? <MainHome key="main" /> : (
             <div style={{ padding: '160px 0', textAlign: 'center' }}>
               <h2 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '16px' }}>{activePage} 페이지</h2>
               <p style={{ color: '#64748b' }}>현재 준비 중인 페이지입니다.</p>
               <button onClick={() => navigateTo('main')} style={{ marginTop: '32px', padding: '12px 24px', backgroundColor: '#0f172a', color: 'white', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>홈으로 돌아가기</button>
             </div>
          )}
        </AnimatePresence>
      </main>
      <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '80px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '24px', fontWeight: '900', color: 'white', marginBottom: '24px' }} style={{ color: themeColor }}>{company?.name || '회사명'}</div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>{footer?.address}</p>
            <p style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>{footer?.contactEmail}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '16px' }}>Customer Support</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{data.supportPhone || '010-0000-0000'}</div>
            <p style={{ fontSize: '12px', color: '#64748b' }}>© {new Date().getFullYear()} {company?.name || 'TH SOFT'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}