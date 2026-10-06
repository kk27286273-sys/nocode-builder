export interface NavItem {
  label: string;
  targetId: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface SolutionItem {
  title: string;
  description: string;
  image?: string;
}

export interface ReviewItem {
  author: string;
  role: string;
  content: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface B2BTemplateData {
  themeColor: string;
  supportPhone: string;
  company: {
    name: string;
    logoUrl?: string;
  };
  navigation?: {
    navLinks: NavItem[];
  };
  hero: {
    badge?: string;
    title: string;
    subtitle: string;
    mediaType?: 'image' | 'video';
    mediaUrl?: string;
  };
  partnersSection?: {
    enabled: boolean;
    title: string;
    partners: string[];
  };
  stats: StatItem[];
  solutionsSection?: {
    title: string;
    subtitle?: string;
  };
  solutions: SolutionItem[];
  reviewsSection?: {
    title: string;
    subtitle?: string;
  };
  reviews: ReviewItem[];
  faqs: FaqItem[];
  footer: {
    companyName: string;
    ownerName: string;
    businessNumber: string;
    address: string;
    contactEmail: string;
  };
  fontSizes?: {
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

export const defaultTemplateData: B2BTemplateData = {
  themeColor: '#0284C7',
  supportPhone: '010-0000-0000',
  company: {
    name: 'TH소프트',
    logoUrl: '',
  },
  navigation: {
    navLinks: [
      { label: '핵심 강점', targetId: 'stats' },
      { label: '제작 사례', targetId: 'solutions' },
      { label: '상담 후기', targetId: 'reviews' },
      { label: '상담 신청', targetId: 'contact-form' },
    ],
  },
  hero: {
    badge: '모바일 100% 최적화 · 3~4일 신속 구축 전문',
    title: '명함 대신 링크 하나로 계약 따는\n모바일 최적화 실속형 홈페이지',
    subtitle:
      '기업 회사소개부터 매장 홍보, 시공 포트폴리오까지. 불필요한 기능은 빼고 고객의 전화와 견적 문의로 직결되는 실속형 사이트를 구축해 드립니다.',
  },
  partnersSection: {
    enabled: true,
    title: '제작 및 기술 파트너십 보증',
    partners: ['모바일 반응형 보증', 'SSL 보안서버 구축', '정찰 단가 준수', '도메인 셋업 지원'],
  },
  stats: [
    { value: '100%', label: '모바일 반응형 최적화' },
    { value: '3~4일', label: '자료 전달 후 초안 완성' },
    { value: '0원', label: '숨겨진 추가 비용 없음' },
  ],
  solutionsSection: {
    title: '핵심 솔루션 & 제작 분야',
    subtitle: '업종의 목적에 맞춰 견적 전환율을 극대화하는 3대 대표 구성',
  },
  solutions: [
    {
      title: 'B2B 기업·제조업 전용 웹',
      description: '거래처 미팅 전 회사소개서 대신 전달하는 신뢰도 높은 모바일 반응형 웹사이트.',
    },
    {
      title: '매장 홍보 & 시공 포트폴리오 웹',
      description: '인테리어, 설비, 학원 등 고객이 시공 실적과 후기를 보고 바로 견적을 요청하는 구조.',
    },
    {
      title: '전문직 & 1인 기업 랜딩페이지',
      description: '복잡한 메뉴 없이 스크롤 한 번으로 프로필 확인부터 상담 예약까지 1분 컷 연결.',
    },
  ],
  reviewsSection: {
    title: '실제 제작 고객 후기',
    subtitle: 'TH소프트를 통해 문의 유입률을 높인 고객들의 생생한 리뷰',
  },
  reviews: [
    {
      author: '김대표',
      role: '제조업 B2B 대표',
      content: '거래처 미팅 때 링크 하나 보내줬더니 훨씬 전문적으로 보인다고 칭찬받았습니다.',
    },
    {
      author: '박원장',
      role: '전문 교육기관 운영',
      content: '쓸데없는 복잡한 기능 없이 모바일에서 바로 상담으로 연결되니 문의가 확실히 늘었습니다.',
    },
  ],
  faqs: [
    {
      question: '컴맹이고 웹을 전혀 모르는데 제작이 가능한가요?',
      answer: '네, 대표님은 업체 소개와 사진 몇 장만 편하게 던져주시면 됩니다. 기획, 모바일 최적화, 도메인 연결까지 알아서 세팅해 드립니다.',
    },
    {
      question: '오픈 기념 30% 할인은 언제까지인가요?',
      answer: '완성도 높은 1:1 맞춤 퀄리티 유지를 위해 선착순 5개 업체 한정으로 진행되며, 마감 즉시 정상가로 전환됩니다.',
    },
  ],
  footer: {
    companyName: 'TH소프트 (TH SOFT)',
    ownerName: '김태헌',
    businessNumber: '000-00-00000',
    address: '서울특별시 강남구 테헤란로',
    contactEmail: 'contact@thsoft.co.kr',
  },
  fontSizes: {
    companyName: 20,
    heroBadge: 14,
    heroTitle: 36,
    heroSubtitle: 16,
    partnersTitle: 16,
    statsValue: 32,
    statsLabel: 14,
    sectionTitle: 28,
    sectionSubtitle: 16,
    faqQuestion: 18,
    faqAnswer: 15,
  },
};

// 기존 컴포넌트들의 호환성을 위해 두 이름 모두 export
export const defaultB2BTemplate = defaultTemplateData;