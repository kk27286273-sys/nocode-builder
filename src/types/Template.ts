export type TemplateType = 'one-page' | 'corporate' | 'rental-shop' | 'portfolio';

export interface B2BTemplateData {
  id?: string;
  site_id?: string;
  templateType: TemplateType;
  themeColor: string;
  
  company: {
    name: string;
    logoUrl: string;
  };

  hero: {
    title: string;
    subtitle: string;
    badge: string;
    mediaUrl: string;
  };

  // [사업소개] - 기존 구조 유지 및 확장
  solutions: {
    title: string;
    category: string;
    description: string;
    image: string;
    detailedFeatures: { featureTitle: string; featureContent: string }[];
  }[];

  // [회사소개 & 지속가능경영 & 공시정보]를 포함한 기업 정보 확장
  corporateInfo: {
    // CEO 인사말 (기존)
    ceoGreeting: {
      title: string;
      content: string;
      image: string;
    };
    // 미션/비전 (기존)
    missionVision: {
      mission: string;
      vision: string;
    };
    // 연혁 (신규: 에이텍 스타일 타임라인용)
    history: {
      year: string;
      event: string;
    }[];
    // 조직도 및 CI (기존)
    orgChart: string;
    ciImage: string;
    // 위치 정보 (기존)
    location: {
      headOffice: {
        address: string;
        tel: string;
        fax: string;
      };
    };
    // [지속가능경영 - ESG] (신규)
    esg: {
      environmental: { title: string; content: string; image: string };
      social: { title: string; content: string; image: string };
      governance: { title: string; content: string; image: string };
    };
    // [공시정보 - Disclosure] (신규)
    disclosure: {
      certifications: { name: string; image: string; date: string }[];
      reports: { title: string; date: string; link: string }[];
    };
  };

  navigation: {
    menus: {
      label: string;
      children: { label: string; targetId: string }[];
    }[];
  };

  // [홍보센터 - PR Center] (신규)
  prCenter: {
    news: { title: string; date: string; summary: string; image: string }[];
    notice: { title: string; date: string; isImportant: boolean }[];
  };

  // [인재경영 - Recruit] (신규)
  recruit: {
    talentValue: string;
    benefitInfo: string;
    openPositions: { title: string; department: string; deadline: string; link: string }[];
  };

  // [고객센터 - CS Center] (신규)
  csCenter: {
    faq: { question: string; answer: string }[];
    contactInfo: { email: string; phone: string; address: string };
  };

  // 기타 공통 필드 (에디터 사용 필드)
  supportPhone: string;
  csGuide: string;
  kakaoLink: string;
  newsContent: string;
  videoUrl: string;
  talentValue: string;
  benefitInfo: string;

  footer: {
    address: string;
    ownerName: string;
    businessNumber: string;
    contactEmail: string;
    companyName: string; // 추가
  };
}