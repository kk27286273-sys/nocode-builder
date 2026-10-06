export interface B2BTemplateData {
  themeColor: string;
  company: {
    name: string;
    logoUrl: string;
  };
  siteImage: string; 
  supportPhone: string;
  navigation: {
    navLinks: { label: string; targetId: string }[];
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
  };
  heroImageHeight: number; 
  partnersSection: {
    enabled: boolean;
    title: string;
    partners: string[];
  };
  stats: { value: string; label: string; enabled: boolean }[]; 
  solutionsSection: {
    title: string;
    subtitle: string;
  };
  solutionImageHeight: number; 
  solutions: {
    title: string;
    description: string;
    image: string;
  }[];
  reviewsSection: {
    title: string;
    subtitle: string;
  };
  reviews: {
    author: string;
    role: string;
    content: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  footer: {
    companyName: string;
    ownerName: string;
    businessNumber: string;
    address: string;
    contactEmail: string;
  };
  booking: {
    enabled: boolean;
    title: string;
    subtitle: string;
    availableHours: string[];
    bookingMessage: string;
  };
  fontSizes: {
    companyName?: number;
    heroBadge?: number;
    heroTitle?: number;
    heroSubtitle?: number;
    partnersTitle?: number;
    statsValue?: number;
    statsLabel?: number;
    sectionTitle?: number;
    sectionSubtitle?: number;
    faqQuestion?: number;
    faqAnswer?: number;
  };
}

export const defaultB2BTemplateData: B2BTemplateData = {
  themeColor: '#0284C7',
  company: { name: '회사명을 입력하세요', logoUrl: '' },
  siteImage: '', 
  supportPhone: '010-0000-0000',
  navigation: {
    navLinks: [{ label: '회사소개', targetId: 'about' }, { label: '서비스', targetId: 'solutions' }],
  },
  hero: {
    badge: '업계 1위 정밀 시공',
    title: '혁신적인 기술로\n공간의 가치를 만듭니다',
    subtitle: '최신 설비와 숙련된 전문가가 제공하는 고품격 시공 서비스를 경험하세요.',
    mediaUrl: '',
    mediaType: 'image',
  },
  heroImageHeight: 450, 
  partnersSection: {
    enabled: true,
    title: '함께하는 신뢰의 파트너사',
    partners: ['파트너사1', '파트너사2', '파트너사3'],
  },
  stats: [
    { value: '2,850', label: '누적 시공 실적', enabled: true },
    { value: '99.8', label: '납기 준수율(%)', enabled: true },
    { value: '15', label: '전문 인력 보유', enabled: true },
  ],
  solutionsSection: {
    title: '핵심 솔루션',
    subtitle: '고객의 요구에 최적화된 맞춤형 시공 분야를 제공합니다.',
  },
  solutionImageHeight: 180, 
  solutions: [
    { title: '정밀 설비 시공', description: '최첨단 장비를 활용한 오차 없는 정밀 시공을 보장합니다.', image: '' },
    { title: '산업 시설 구축', description: '대규모 산업 단지 및 공장 시설의 최적 설계를 지원합니다.', image: '' },
    { title: '유지보수 관리', description: '철저한 사후 관리 시스템으로 시설의 수명을 극대화합니다.', image: '' },
  ],
  reviewsSection: {
    title: '고객 리얼 후기',
    subtitle: '실제 시공을 경험하신 고객님들의 생생한 목소리입니다.',
  },
  reviews: [
    { author: '김철수 대표', role: 'OO산업', content: '약속한 기한 내에 완벽하게 마무리되어 매우 만족합니다.' },
  ],
  faqs: [
    { question: '견적 문의는 어떻게 하나요?', answer: '하단 문의 폼을 작성해 주시면 24시간 이내에 연락드립니다.' },
  ],
  footer: {
    companyName: 'TH소프트',
    ownerName: '대표자명',
    businessNumber: '000-00-00000',
    address: '사업장 주소 입력',
    contactEmail: 'contact@thsoft.com',
  },
  booking: {
    enabled: false,
    title: '실시간 상담 예약',
    subtitle: '원하시는 시간을 선택하시면 담당 엔지니어가 배정됩니다.',
    availableHours: ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    bookingMessage: '예약이 정상적으로 접수되었습니다. 곧 연락드리겠습니다.',
  },
  fontSizes: {},
};