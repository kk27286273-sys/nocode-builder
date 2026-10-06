// 1. 템플릿 타입 정의
export type TemplateType = 'one-page' | 'corporate' | 'rental-shop' | 'portfolio';

// 2. 모든 템플릿이 공통으로 사용하는 기본 데이터
export interface BaseSiteData {
  id: string;
  site_id: string;
  templateType: TemplateType;
  
  // 회사 기본 정보 (공통)
  company: {
    name: string;
    logoUrl: string;
    supportPhone: string;
    email: string;
    address: string;
    businessNumber: string;
    ownerName: string;
  };

  // 글로벌 스타일 (공통)
  style: {
    themeColor: string;
    accentColor: string;
    fontFamily: string;
    baseFontSize: number;
  };

  // 기본 SEO (공통)
  seo: {
    title: string;
    description: string;
    faviconUrl: string;
  };

  // 공통 네비게이션
  navigation: {
    navLinks: { label: string; targetId: string; url?: string }[];
  };
}

// 3. 템플릿별 특화 데이터 정의
export interface OnePageData {
  hero: { title: string; subtitle: string; badge: string; mediaUrl: string };
  features: { title: string; description: string; icon: string }[];
  reviews: { author: string; content: string; role: string }[];
  contactForm: { title: string; description: string; buttonText: string };
}

export interface CorporateData {
  hero: { title: string; subtitle: string; badge: string; mediaUrl: string };
  about: { greeting: string; vision: string; history: { year: string; event: string }[] };
  businessAreas: { title: string; description: string; image: string; details: string[] }[];
  ir: { documents: { name: string; url: string }[] };
  contactForm: { title: string; description: string; buttonText: string };
}

export interface RentalShopData {
  categories: { id: string; name: string }[];
  products: { 
    id: string; 
    categoryId: string; 
    name: string; 
    price: string; 
    rentalPeriod: string; 
    image: string; 
    tags: string[]; 
    description: string; 
  }[];
  rentalProcess: { step: number; title: string; description: string; icon: string }[];
  contactForm: { title: string; description: string; buttonText: string };
}

export interface PortfolioData {
  hero: { title: string; subtitle: string; badge: string; mediaUrl: string };
  gallery: { 
    id: string; 
    title: string; 
    category: string; 
    thumbnail: string; 
    images: string[]; 
    description: string; 
    client: string; 
    date: string; 
  }[];
  filterTags: string[];
  contactForm: { title: string; description: string; buttonText: string };
}

// 4. 최종 통합 사이트 데이터 타입
export type SiteData = BaseSiteData & (
  | { templateType: 'one-page'; specifics: OnePageData }
  | { templateType: 'corporate'; specifics: CorporateData }
  | { templateType: 'rental-shop'; specifics: RentalShopData }
  | { templateType: 'portfolio'; specifics: PortfolioData }
);