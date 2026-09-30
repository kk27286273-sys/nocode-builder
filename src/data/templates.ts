export interface B2BFeatureItem {
  id: string;
  title: string;
  description: string;
  imageUrls: string[]; // 최대 5장 지원
}

export interface B2BTemplateData {
  company: {
    name: string;
    logoUrl?: string;
  };
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  metrics: {
    value: string;
    label: string;
  }[];
  features: B2BFeatureItem[];
  footer: {
    companyName: string;
    ownerName: string;
    businessNumber: string;
    address: string;
    contactEmail: string;
    contactPhone: string;
  };
}

export const defaultB2BTemplate: B2BTemplateData = {
  company: {
    name: "(주)넥스트엔터프라이즈",
    logoUrl: "",
  },
  hero: {
    badge: "B2B 전문 파트너",
    headline: "비즈니스 운영을 가속하는\n엔터프라이즈 인프라 솔루션",
    subheadline: "불필요한 리소스는 줄이고 성과에만 집중하세요. 검증된 B2B 서비스로 성공적인 비즈니스를 지원합니다.",
    ctaText: "무료 상담 및 견적 문의",
  },
  metrics: [
    { value: "99.9%", label: "서비스 가동률" },
    { value: "500+", label: "도입 고객사" },
    { value: "40%+", label: "운영 비용 절감" },
  ],
  features: [
    {
      id: "feature-1",
      title: "핵심 기술력 및 서비스 프로세스",
      description: "고객사의 업무 환경에 맞춰 즉시 도입 가능한 맞춤형 시스템을 설계합니다.",
      imageUrls: [],
    },
  ],
  footer: {
    companyName: "(주)넥스트엔터프라이즈",
    ownerName: "김대표",
    businessNumber: "123-45-67890",
    address: "서울특별시 강남구 테헤란로 123, 4층",
    contactEmail: "contact@next-enterprise.com",
    contactPhone: "02-1234-5678",
  },
};

// 기존 코드와의 타입 호환용 별칭
export type PageData = B2BTemplateData;
export type StoryItem = any;
export const TEMPLATES = {
  b2b: defaultB2BTemplate,
  default: defaultB2BTemplate,
};