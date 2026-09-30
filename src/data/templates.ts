export interface NavItem {
  label: string;
  targetId: string;
}

export interface MetricItem {
  value: string;
  label: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
}

export interface TestimonialItem {
  company: string;
  author: string;
  role: string;
  comment: string;
  avatarUrl: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface B2BTemplateData {
  // 1. 기업 기본 정보 (최상단)
  company: {
    name: string;
    logoUrl?: string;
  };
  supportPhone: string;
  footer: {
    companyName: string;
    ownerName: string;
    businessNumber: string;
    address: string;
    contactEmail: string;
  };

  // 2. 상단 네비게이션
  navItems: NavItem[];

  // 3. 좌측 카테고리
  categories: string[];

  // 4. 메인 히어로 & 배경
  bgImageUrl?: string;
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    ctaText: string;
  };

  // 5. 파트너사
  partnersSection: {
    enabled: boolean;
    title: string;
    partners: string[];
  };

  // 6. 실적 수치
  metrics: MetricItem[];

  // 7. 서비스 / 솔루션 (추가/삭제 가능)
  features: FeatureItem[];

  // 8. 고객 후기
  testimonials: TestimonialItem[];

  // 9. FAQ
  faqs: FaqItem[];
}

export const defaultB2BTemplate: B2BTemplateData = {
  company: {
    name: "(주)넥스트엔터프라이즈",
  },
  supportPhone: "1588-0000",
  footer: {
    companyName: "(주)넥스트엔터프라이즈",
    ownerName: "김대표",
    businessNumber: "123-45-67890",
    address: "서울특별시 강남구 테헤란로 123, 4층",
    contactEmail: "contact@next-enterprise.com",
  },
  navItems: [
    { label: "홈", targetId: "hero" },
    { label: "솔루션", targetId: "services" },
    { label: "실적", targetId: "metrics" },
    { label: "고객사례", targetId: "testimonials" },
    { label: "FAQ", targetId: "faqs" },
    { label: "문의하기", targetId: "contact" },
  ],
  categories: ["전체 솔루션", "인프라 구축", "관제 대시보드", "보안 및 컨설팅"],
  bgImageUrl: "",
  hero: {
    badge: "Enterprise Business Solution",
    headline: "비즈니스 운영을 가속하는\n엔터프라이즈 인프라 솔루션",
    subheadline: "불필요한 리소스는 줄이고 비즈니스 성장에만 집중하세요. 검증된 B2B 시스템으로 성과를 만듭니다.",
    ctaText: "도입 문의하기",
  },
  partnersSection: {
    enabled: true,
    title: "국내 주요 비즈니스 파트너와 함께합니다",
    partners: ["파트너사 A", "협력 네트워크 B", "제휴 기관 C", "글로벌 벤처 D"],
  },
  metrics: [
    { value: "99.9%", label: "서비스 가동률" },
    { value: "500+", label: "도입 고객사" },
    { value: "40%+", label: "운영 비용 절감" },
  ],
  features: [
    {
      id: "feat-1",
      title: "클라우드 인프라 구축 및 지능형 아키텍처",
      description: "엔터프라이즈 규모의 트래픽을 지연 없이 처리하는 고가용성 인프라를 설계하고 구축합니다.",
      imageUrls: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
      ],
    },
  ],
  testimonials: [
    {
      company: "(주)테크프론티어",
      author: "박진우",
      role: "CTO",
      comment: "솔루션 도입 후 월 인프라 관리 비용이 42% 절감되었고, 운영 리소스가 절반 이상 줄었습니다.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  ],
  faqs: [
    {
      question: "도입 및 세팅까지 소요되는 기간은 얼마나 되나요?",
      answer: "표준 패키지 기준 영업일 기준 3~5일 이내 전용 도메인 및 관리 콘솔 연동이 완료됩니다.",
    },
    {
      question: "기존 사내 시스템과의 데이터 연동(API)이 가능한가요?",
      answer: "네, 표준 REST API 및 Webhook을 완벽 지원하여 기존 ERP 및 CRM과 손쉽게 연동할 수 있습니다.",
    },
  ],
};

export type PageData = B2BTemplateData;
export type StoryItem = any;
export const TEMPLATES = {
  b2b: defaultB2BTemplate,
  default: defaultB2BTemplate,
};