'use client';

import React from 'react';
import { CorporateViewer } from '@/components/viewer/templates/CorporateViewer';

export default function CorporateLayout() {
  // 샘플 데이터
  const sampleData = {
    company: {
      name: 'TH소프트',
    },
    navigation: {
      items: [
        { label: '홈', id: 'main' },
        { label: '회사소개', id: 'about' },
        { label: '사업소개', id: 'sol_detail' },
        { label: 'ESG', id: 'esg' },
        { label: '뉴스', id: 'pr' },
        { label: '채용', id: 'recruit' },
        { label: '고객센터', id: 'cs' },
      ],
    },
    themeColor: '#2563eb',
    hero: {
      title: 'Beyond Speed, Beyond Limits',
      subtitle: 'Nexia 홈페이지 빌더',
      badge: 'Since 2024',
      mediaUrl: '',
    },
    solutions: [
      {
        id: 1,
        title: 'Pro 플랜',
        description: '중소 기업용 기본 홈페이지',
        details: '구축비 100만 원, 월 7.9만 원',
      },
      {
        id: 2,
        title: 'Premium 플랜',
        description: '중견 기업용 고급 홈페이지',
        details: '구축비 120만 원, 월 9.9만 원',
      },
    ],
    corporateInfo: {
      representativeName: 'TH소프트 대표',
      esg: {
        vision: '기술로 미래를 만듭니다',
        values: [],
      },
    },
    footer: {
      address: '서울시 강남구',
      businessNumber: '000-00-00000',
      ownerName: 'TH소프트',
      contactEmail: 'info@thsoft.co.kr',
    },
    supportPhone: '02-0000-0000',
    csCenter: {
      contactInfo: {
        phone: '02-0000-0000',
        email: 'support@thsoft.co.kr',
      },
    },
  };

  return <CorporateViewer data={sampleData} />;
}