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
  navigation: {
    navLinks: NavItem[];
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    mediaType?: 'image' | 'video' | 'none';
    mediaUrl?: string;
  };
  partnersSection?: {
    enabled: boolean;
    title: string;
    partners: string[];
  };
  stats: StatItem[];
  solutionsSection: {
    title: string;
    subtitle: string;
  };
  solutions: SolutionItem[];
  reviewsSection: {
    title: string;
    subtitle: string;
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
}

export const defaultB2BTemplate: B2BTemplateData = {
  themeColor: '#2563EB',
  supportPhone: '1588-0000',
  company: {
    name: '(주)엔터프라이즈솔루션',
    logoUrl: '',
  },
  navigation: {
    navLinks: [
      { label: '실적 지표', targetId: 'stats' },
      { label: '솔루션 라인업', targetId: 'solutions' },
      { label: '고객 후기', targetId: 'reviews' },
      { label: '자주 묻는 질문', targetId: 'faqs' },
    ],
  },
  hero: {
    badge: 'Enterprise Professional Service',
    title: '기업 성장을 견인하는\n최고의 B2B 솔루션 파트너',
    subtitle: '신뢰할 수 있는 기술력과 전문 컨설팅으로 비즈니스의 디지털 전환을 완벽하게 지원합니다.',
    mediaType: 'image',
    mediaUrl: '',
  },
  partnersSection: {
    enabled: true,
    title: '주요 파트너사 및 협력 기업',
    partners: ['삼성전자', '현대자동차', 'SK텔레콤', 'LG CNS', '카카오엔터프라이즈'],
  },
  stats: [
    { value: '99.8%', label: '시스템 가동률' },
    { value: '450+', label: '엔터프라이즈 도입사' },
    { value: '24시간', label: '전문 기술지원 체계' },
  ],
  solutionsSection: {
    title: '신뢰할 수 있는 전용 솔루션 라인업',
    subtitle: '기업 비즈니스 성장에 특화된 모듈',
  },
  solutions: [
    {
      title: '스마트 데이터 파이프라인',
      description: '사내 데이터를 실시간 집계 및 분석하여 의사결정 속도를 3배 이상 단축시킵니다.',
      image: '',
    },
    {
      title: '통합 보안 아키텍처',
      description: '엔드포인트 암호화 및 다중 접근 제어 체계로 기업 핵심 자산을 안전하게 보호합니다.',
      image: '',
    },
    {
      title: '클라우드 인프라 최적화',
      description: '오토스케일링 및 자원 효율화를 통해 월 인프라 운영 비용을 최대 40% 절감합니다.',
      image: '',
    },
  ],
  reviewsSection: {
    title: '함께한 고객사 평가',
    subtitle: '실제 서비스를 도입한 기업들의 반응입니다.',
  },
  reviews: [
    {
      author: '김철수 본부장',
      role: '제조혁신본부 / 미래인더스트리',
      content: '도입 후 공정 가동률이 현격히 향상되었으며 장애 대응 시간이 1/5로 줄었습니다.',
    },
    {
      author: '이영희 CTO',
      role: '기술개발연구소 / 넥스트글로벌',
      content: '맞춤형 컨설팅과 정기 관리 대행 덕분에 개발 리소스를 온전히 서비스에만 집중할 수 있었습니다.',
    },
  ],
  faqs: [
    {
      question: '도입 후 세팅까지 소요되는 기간은 얼마인가요?',
      answer: '신청 후 영업일 기준 평균 48시간 이내에 기본 환경 구성 및 사전 검증이 완료됩니다.',
    },
    {
      question: '월 관리 대행에는 어떤 업무가 포함되나요?',
      answer: '인프라 모니터링, 월 정기 점검, 도메인/SSL 관리 및 월 무제한 콘텐츠 갱신이 지원됩니다.',
    },
  ],
  footer: {
    companyName: '(주)엔터프라이즈솔루션',
    ownerName: '홍길동',
    businessNumber: '123-45-67890',
    address: '서울특별시 강남구 테헤란로 123 B2B타워 15층',
    contactEmail: 'contact@enterprise-solution.co.kr',
  },
};