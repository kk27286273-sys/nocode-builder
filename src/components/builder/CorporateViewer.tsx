'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CorporateViewerProps {
  data: any;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
}

export default function CorporateViewer({ data, activeSection: propSection, setActiveSection: propSetSection }: CorporateViewerProps) {
  // 데이터가 아예 없을 때의 방어막
  if (!data) return <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>데이터를 불러오는 중입니다...</div>;

  // 데이터 구조 분해 시 기본값 설정 및 필드명 유연하게 대응
  const { 
    company = {}, 
    navigation = {}, 
    themeColor = '#004a99', 
    footer = {},
    hero = {},
    solutions = [],
    ceo = {},
    mission = {},
    orgChart = {},
    ci = {},
    location = {},
    pr = {},
    recruit = {},
    cs = {}
  } = data;
  
  const [internalPage, setInternalPage] = useState('main');
  const activePage = propSection || internalPage;
  const setActivePage = propSetSection || setInternalPage;

  const navigateTo = (targetId: string) => {
    if (!targetId) return;
    setActivePage(targetId);
    window.scrollTo(0, 0);
  };

  const Navbar = () => (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#fff', borderBottom: '2px solid #eee', height: '80px', display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigateTo('main')}>
          {company?.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} style={{ height: '40px' }} />
          ) : (
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: themeColor }}>{company?.name || 'COMPANY'}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '25px' }}>
          {/* navLinks가 없을 경우를 대비해 빈 배열 처리 */}
          {(navigation?.navLinks || []).map((menu: any, idx: number) => (
            <button 
              key={idx}
              onClick={() => navigateTo(menu.targetId)}
              style={{ 
                fontSize: '15px', 
                fontWeight: activePage === menu.targetId ? 'bold' : 'medium', 
                cursor: 'pointer', border: 'none', backgroundColor: 'transparent',
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

  const MainPage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%' }}>
      <section style={{ 
        height: '600px', 
        backgroundColor: '#f4f7fa', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center', 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${hero?.backgroundImage || hero?.bgImage || 'https://via.placeholder.com/1920x600'})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        color: 'white' 
      }}>
        <div style={{ padding: '0 20px' }}>
          <span style={{ display: 'inline-block', padding: '5px 15px', backgroundColor: themeColor, borderRadius: '20px', fontSize: '14px', marginBottom: '20px' }}>{hero?.badge || 'Welcome'}</span>
          <h1 style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '20px', lineHeight: '1.2' }}>{hero?.title || '회사명을 입력하세요'}</h1>
          <p style={{ fontSize: '22px', opacity: 0.9 }}>{hero?.subtitle || '여기에 회사 슬로건을 입력하세요'}</p>
        </div>
      </section>
    </motion.div>
  );

  const CompanyPage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '40px', borderLeft: `6px solid ${themeColor}`, paddingLeft: '20px' }}>회사소개</h2>
      <div style={{ marginBottom: '80px' }}>
        <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>CEO 인사말</h3>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '40px', borderRadius: '20px' }}>
          <div style={{ width: '200px', height: '250px', backgroundColor: '#ddd', borderRadius: '10px', overflow: 'hidden' }}>
            <img src={ceo?.image || 'https://via.placeholder.com/200x250'} style={{width:'100%', height:'100%', objectFit:'cover'}} />
          </div>
          <div>
            {/* ceoGreeting 또는 message 어떤 필드든 대응하도록 처리 */}
            <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#444' }}>
              {ceo?.ceoGreeting || ceo?.message || 'CEO 인사말을 입력해주세요.'}
            </p>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <div style={{ padding: '30px', border: '1px solid #eee', borderRadius: '15px' }}>
          <h3 style={{ color: themeColor, marginBottom: '15px' }}>미션 & 비전</h3>
          <p>{mission?.text || mission?.content || '미션과 비전 내용을 입력해주세요.'}</p>
        </div>
        <div style={{ padding: '30px', border: '1px solid #eee', borderRadius: '15px' }}>
          <h3 style={{ color: themeColor, marginBottom: '15px' }}>CI 소개</h3>
          <p>{ci?.description || ci?.content || 'CI 소개 내용을 입력해주세요.'}</p>
        </div>
      </div>
    </motion.div>
  );

  const BusinessPage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '40px', borderLeft: `6px solid ${themeColor}`, paddingLeft: '20px' }}>사업소개</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {(solutions || []).map((sol: any, idx: number) => (
          <div key={idx} style={{ border: '1px solid #eee', borderRadius: '15px', overflow: 'hidden' }}>
            <div style={{ height: '200px', backgroundColor: '#ddd' }}>
              <img src={sol?.image || 'https://via.placeholder.com/400x200'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '25px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: themeColor }}>{sol?.title}</h3>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '15px' }}>{sol?.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const PRPage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '40px', borderLeft: `6px solid ${themeColor}`, paddingLeft: '20px' }}>홍보센터</h2>
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '22px', marginBottom: '20px' }}>회사 소식</h3>
        <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>{pr?.news || '등록된 소식이 없습니다.'}</div>
      </div>
    </motion.div>
  );

  const RecruitPage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '40px', borderLeft: `6px solid ${themeColor}`, paddingLeft: '20px' }}>인재경영</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div style={{ padding: '30px', backgroundColor: '#f4f7fa', borderRadius: '15px' }}>
          <h3 style={{ color: themeColor, marginBottom: '15px', fontSize: '22px' }}>인재상</h3>
          <p style={{ lineHeight: '1.8' }}>{recruit?.talent || '인재상 내용을 입력해주세요.'}</p>
        </div>
        <div style={{ padding: '30px', backgroundColor: '#f4f7fa', borderRadius: '15px' }}>
          <h3 style={{ color: themeColor, marginBottom: '15px', fontSize: '22px' }}>복리후생</h3>
          <p style={{ lineHeight: '1.8' }}>{recruit?.benefit || '복리후생 내용을 입력해주세요.'}</p>
        </div>
      </div>
    </motion.div>
  );

  const CSPage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '40px', borderLeft: `6px solid ${themeColor}`, paddingLeft: '20px', textAlign: 'left' }}>고객센터</h2>
      <div style={{ backgroundColor: '#f9f9f9', padding: '50px', borderRadius: '20px', border: '1px solid #eee' }}>
        <p style={{ fontSize: '20px', marginBottom: '30px', color: '#444' }}>{cs?.guide || '문의 안내 문구입니다.'}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px', minWidth: '200px' }}>
            <div style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>대표 전화</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{cs?.phone || '000-0000-0000'}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', color: '#333', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          {['main'].includes(activePage) && <MainPage key="main" />}
          {['about', 'ceo', 'company'].includes(activePage) && <CompanyPage key="about" />}
          {['business', 'service', 'solution'].includes(activePage) && <BusinessPage key="business" />}
          {['pr', 'news'].includes(activePage) && <PRPage key="pr" />}
          {['recruit', 'job'].includes(activePage) && <RecruitPage key="recruit" />}
          {['cs', 'contact'].includes(activePage) && <CSPage key="cs" />}
          {!['main', 'about', 'ceo', 'company', 'business', 'service', 'solution', 'pr', 'news', 'recruit', 'job', 'cs', 'contact'].includes(activePage) && (
            <div style={{ padding: '100px', textAlign: 'center' }}>준비 중인 페이지입니다. (ID: {activePage})</div>
          )}
        </AnimatePresence>
      </main>
      <footer style={{ backgroundColor: '#222', color: '#aaa', padding: '60px 20px', marginTop: '100px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ color: '#fff' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>{company?.name}</div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#aaa' }}>{footer?.address}<br/>대표자: {footer?.ceoName} | 사업자번호: {footer?.bizNumber}</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '14px' }}>
            <p>© {new Date().getFullYear()} {company?.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}