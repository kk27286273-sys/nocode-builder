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

  solutions: {
    title: string;
    category: string;
    description: string;
    image: string;
    detailedFeatures: { featureTitle: string; featureContent: string }[];
  }[];

  corporateInfo: {
    ceoGreeting: {
      title: string;
      content: string;
      image: string;
    };
    missionVision: {
      mission: string;
      vision: string;
    };
    orgChart: string;
    ciImage: string;
    location: {
      headOffice: {
        address: string;
        tel: string;
        fax: string;
      };
    };
  };

  navigation: {
    menus: {
      label: string;
      children: { label: string; targetId: string }[];
    }[];
  };

  // CS 및 기타 필드 (에디터에서 사용하는 필드들)
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
  };
}