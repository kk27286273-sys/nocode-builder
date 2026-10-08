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
          {(navigation?.navLinks || []).map((menu: any) => (
            <button 
              key={menu.label}
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
      <section style={{ height: '600px', backgroundColor: '#f4f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${hero?.backgroundImage || 'https://via.placeholder.com/1920x600'})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'white' }}>
        <div style={{ padding: '0 20px' }}>
          <span style={{ display: 'inline-block', padding: '5px 15px', backgroundColor: themeColor, borderRadius: '20px', fontSize: '14px', marginBottom: '20px' }}>{hero?.badge}</span>
          <h1 style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '20px', lineHeight: '1.2' }}>{hero?.title}</h1>
          <p style={{ fontSize: '22px', opacity: 0.9 }}>{hero?.subtitle}</p>
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
          <div style={{ width: '200px', height: '250px', backgroundColor: '#ddd', borderRadius: '10px' }}><img src={ceo?.image} style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'10px'}} /></div>
          <div><p style={{ fontSize: '18px', lineHeight: '1.8', color: '#444' }}>{ceo?.message}</p></div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <div style={{ padding: '30px', border: '1px solid #eee', borderRadius: '15px' }}>
          <h3 style={{ color: themeColor, marginBottom: '15px' }}>미션 & 비전</h3>
          <p>{mission?.text}</p>
        </div>
        <div style={{ padding: '30px', border: '1px solid #eee', borderRadius: '15px' }}>
          <h3 style={{ color: themeColor, marginBottom: '15px' }}>CI 소개</h3>
          <p>{ci?.description}</p>
        </div>
      </div>
      <div style={{ marginTop: '40px', padding: '30px', backgroundColor: '#f4f7fa', borderRadius: '15px' }}>
        <h3 style={{ color: themeColor, marginBottom: '15px' }}>오시는 길</h3>
        <p>{location?.address}</p>
      </div>
    </motion.div>
  );

const BusinessPage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '40px', borderLeft: `6px solid ${themeColor}`, paddingLeft: '20px' }}>사업소개</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {solutions.map((sol: any, idx: number) => (
          <div key={idx} style={{ border: '1px solid #eee', borderRadius: '15px', overflow: 'hidden', transition: 'transform 0.2s' }}>
            <div style={{ height: '200px', backgroundColor: '#ddd' }}>
              <img src={sol.image || 'https://via.placeholder.com/400x200'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '25px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: themeColor }}>{sol.title}</h3>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '15px' }}>{sol.description}</p>
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
      <div>
        <h3 style={{ fontSize: '22px', marginBottom: '20px' }}>홍보 영상</h3>
        <div style={{ width: '100%', height: '450px', backgroundColor: '#000', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          {pr?.videoUrl ? <iframe width="100%" height="100%" src={pr.videoUrl} style={{ border: 'none', borderRadius: '15px' }} /> : '영상 링크를 등록해주세요.'}
        </div>
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
          <a href={cs?.kakaoUrl} target="_blank" rel="noreferrer" style={{ padding: '20px', backgroundColor: '#FEE500', color: '#3C1E1E', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            카카오톡 상담하기
          </a>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', color: '#333', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          {activePage === 'main' && <MainPage key="main" />}
          {activePage === 'about' && <CompanyPage key="about" />}
          {activePage === 'business' && <BusinessPage key="business" />}
          {activePage === 'pr' && <PRPage key="pr" />}
          {activePage === 'recruit' && <RecruitPage key="recruit" />}
          {activePage === 'cs' && <CSPage key="cs" />}
          {!['main', 'about', 'business', 'pr', 'recruit', 'cs'].includes(activePage) && (
            <div style={{ padding: '100px', textAlign: 'center' }}>준비 중인 페이지입니다.</div>
          )}
        </AnimatePresence>
      </main>
      <footer style={{ backgroundColor: '#222', color: '#aaa', padding: '60px 20px', marginTop: '100px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginBottom: '10px' }}>{company?.name}</div>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{footer?.address}<br/>대표자: {footer?.ceoName} | 사업자번호: {footer?.bizNumber}<br/>이메일: {footer?.email}</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '14px' }}>
            <p>© {new Date().getFullYear()} {company?.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}