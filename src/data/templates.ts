// src/data/templates.ts

export interface B2BTemplateData {
  templateType: 'corporate' | 'rental-shop' | 'portfolio' | 'one-page'; // [추가] 뷰어 결정 이름표
  themeColor: string;
  company: { name: string; logoUrl: string; slogan: string; };
  // ... 나머지 기존 필드들 그대로 유지 ...
  siteImage: string; 
  supportPhone: string;
  navigation: { 
    menus: { label: string; children: { label: string; targetId: string }[]; }; 
  }[];
  corporateInfo: {
    ceoGreeting: { title: string; content: string; image: string; };
    missionVision: { mission: string; vision: string; };
    organization: { title: string; content: string; image: string; };
    ciGuide: { title: string; content: string; image: string; };
    location: { 
      headOffice: { address: string; tel: string; fax: string; };
      factory: { address: string; tel: string; fax: string; };
      mapUrl: string;
    };
  };
  solutions: { 
    title: string; category: string; description: string; image: string; 
    detailedFeatures: { featureTitle: string; featureContent: string; }[]; 
  }[];
  irCenter: {
    news: { date: string; title: string; }[];
    videos: { title: string; url: string; thumbnail: string; }[];
    recruitment: { talentImage: string; talents: string[]; benefits: string[]; };
  };
  customerSupport: { phone: string; hours: string; notice: string; };
  hero: { badge: string; title: string; subtitle: string; mediaUrl: string; mediaType: 'image' | 'video'; };
  heroImageHeight: number; 
  footer: { companyName: string; ownerName: string; businessNumber: string; address: string; contactEmail: string; };
  fontSizes: { [key: string]: number; };
}

export const defaultB2BTemplateData: B2BTemplateData = {
  templateType: 'corporate', // [하드코딩] 이제 기본값이 무조건 '기업형'입니다.
  themeColor: '#003366', 
  company: { name: '기업형 템플릿 (수정 가능)', logoUrl: '', slogan: '기업 슬로건을 입력하세요' },
  // ... 아래 나머지 데이터들은 이전과 동일하게 유지 ...
  siteImage: '', 
  supportPhone: '010-0000-0000',
  navigation: { 
    menus: [
      { label: '회사소개', children: [{ label: 'CEO 인사말', targetId: 'ceo' }, { label: '미션 & 비전', targetId: 'mission' }, { label: '조직도', targetId: 'org' }, { label: 'CI 소개', targetId: 'ci' }, { label: '오시는 길', targetId: 'location' }] },
      { label: '사업소개', children: [{ label: '솔루션 1', targetId: 'sol_1' }, { label: '솔루션 2', targetId: 'sol_2' }, { label: '솔루션 3', targetId: 'sol_3' }] },
      { label: '홍보센터', children: [{ label: '회사소식', targetId: 'news' }, { label: '홍보영상', targetId: 'video' }] },
      { label: '인재경영', children: [{ label: '인재상', targetId: 'talent' }, { label: '복리후생', targetId: 'benefit' }] },
      { label: '고객센터', children: [{ label: '문의하기', targetId: 'cs_voice' }] },
    ] 
  },
  corporateInfo: {
    ceoGreeting: { title: 'CEO 인사말 제목', content: '인사말 내용을 입력하세요.', image: '' },
    missionVision: { mission: '미션 내용을 입력하세요.', vision: '비전 내용을 입력하세요.' },
    organization: { title: '조직도 제목', content: '조직도 내용을 입력하세요.', image: '' },
    ciGuide: { title: 'CI 소개 제목', content: 'CI 소개 내용을 입력하세요.', image: '' },
    location: { 
      headOffice: { address: '본사 주소', tel: '02-000-0000', fax: '02-000-0000' },
      factory: { address: '공장 주소', tel: '031-000-0000', fax: '031-000-0000' },
      mapUrl: '' 
    },
  },
  solutions: [
    { title: '솔루션 제목 1', category: '카테고리 1', description: '상세 설명을 입력하세요.', image: '', detailedFeatures: [{ featureTitle: '특장점 1', featureContent: '내용을 입력하세요.' }] },
    { title: '솔루션 제목 2', category: '카테고리 2', description: '상세 설명을 입력하세요.', image: '', detailedFeatures: [{ featureTitle: '특장점 1', featureContent: '내용을 입력하세요.' }] },
  ],
  irCenter: {
    news: [{ date: '2026-00-00', title: '뉴스 제목을 입력하세요' }],
    videos: [{ title: '영상 제목', url: '', thumbnail: '' }],
    recruitment: { talentImage: '', talents: ['인재상 1', '인재상 2'], benefits: ['복리후생 1', '복리후생 2'] },
  },
  customerSupport: { phone: '000-0000-0000', hours: '09:00 - 18:00', notice: '안내 문구를 입력하세요.' },
  hero: { badge: '기업형 뱃지', title: '메인 타이틀을 입력하세요', subtitle: '서브 타이틀 내용을 입력하세요.', mediaUrl: '', mediaType: 'image' },
  heroImageHeight: 600, 
  footer: { companyName: '회사명', ownerName: '대표자명', businessNumber: '000-00-00000', address: '주소', contactEmail: 'email@example.com' },
  fontSizes: {},
};

export const B2B_PRESETS: Record<string, B2BTemplateData> = {
  corporate_portal: defaultB2BTemplateData,
};