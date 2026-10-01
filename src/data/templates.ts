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
  themeColor: "#0284C7",
  supportPhone: "010-0000-0000",
  company: {
    name: "한결 인테리어 설비",
    logoUrl: ""
  },
  navigation: {
    navLinks: [
      { label: "시공 강점", targetId: "stats" },
      { label: "전문 분야", targetId: "solutions" },
      { label: "고객 후기", targetId: "reviews" },
      { label: "시공 문의", targetId: "contact" }
    ]
  },
  hero: {
    badge: "구미·경북 전지역 출장 시공 전문",
    title: "누수 탐지부터 상가·주거 인테리어까지\n30년 베테랑이 직접 책임 시공합니다",
    subtitle: "하청 없는 100% 직영 시공 및 국가공인 자격 보유. 정찰제 견적과 철저한 2년 무상 A/S로 정직하게 시공합니다.",
    mediaType: "none",
    mediaUrl: ""
  },
  partnersSection: {
    enabled: true,
    title: "공식 면허 및 신뢰 보증",
    partners: [
      "전문건설업 면허",
      "배상책임보험 1억원 가입",
      "친환경 자재 인증",
      "2년 하자보수 보증"
    ]
  },
  stats: [
    { value: "1,500+", label: "누적 시공 및 누수 해결" },
    { value: "100%", label: "직영 시공 및 정찰 견적" },
    { value: "2년", label: "철저한 사후 무상 A/S" }
  ],
  solutionsSection: {
    title: "한결 인테리어 핵심 시공 분야",
    subtitle: "현장 상황에 맞는 가장 확실하고 경제적인 솔루션을 제시합니다."
  },
  solutions: [
    {
      title: "최첨단 누수 탐지 및 배관 공사",
      description: "청음식·가스식 정밀 탐지기로 미세 누수까지 100% 탐지. 실패 시 탐지 비용을 받지 않습니다."
    },
    {
      title: "주거·상가 맞춤 인테리어 리모델링",
      description: "아파트, 상가, 식당, 카페 등 공간 특성에 맞춘 최적 동선 설계 및 투명한 자재 내역서 제공."
    },
    {
      title: "욕실 리모델링 및 타일 방수 시공",
      description: "노후 배관 전면 교체부터 고급 타일 시공, 특수 방수 공법으로 누수 원인을 원천 차단합니다."
    }
  ],
  reviewsSection: {
    title: "실제 고객 만족 후기",
    subtitle: "한결과 함께 공사를 마친 고객님들의 솔직한 평가입니다."
  },
  reviews: [
    {
      author: "김민석 님",
      role: "구미 봉곡동 상가 식당 대표",
      content: "주방 바닥 누수 때문에 영업도 못 하고 골치 아팠는데, 반나절 만에 포인트 정확히 짚어서 잡아주셨습니다. 정직한 시공에 감사드립니다."
    },
    {
      author: "이수진 님",
      role: "옥계동 아파트 올리모델링",
      content: "하청 안 주고 사장님이 현장에 매일 나와서 마감 하나하나 챙겨주시는 모습에 신뢰가 갔습니다. A/S 대응도 칼같습니다."
    }
  ],
   faqs: [
    {
      question: "견적 상담과 현장 방문은 무료인가요?",
      answer: "네, 구미 및 인근 지역은 방문 실측과 현장 견적 상담을 100% 무료로 진행해 드립니다."
    },
    {
      question: "공사 후 A/S 보증 기간은 어떻게 되나요?",
      answer: "시공 완료 후 자체 보증서를 발행해 드리며, 시공 하자에 대해 2년간 철저하게 무상 A/S를 보장합니다."
    }
  ],
  footer: {
    companyName: "한결 인테리어 설비",
    ownerName: "김대표",
    businessNumber: "123-45-67890",
    address: "경상북도 구미시 산책길 12, 1층",
    contactEmail: "contact@hangyul.co.kr"
  }
};