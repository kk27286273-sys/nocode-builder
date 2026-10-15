// src/types/Template.ts

export type TemplateType =
  | 'onepage'
  | 'corporate'
  | 'fitness'
  | 'legal'
  | 'rental-shop'
  | 'portfolio'
  | 'interior';

export interface Solution {
  title: string;
  category?: string;
  description: string;
  image?: string;
  detailContent?: string;
  detailedFeatures?: {
    featureTitle: string;
    featureContent: string;
  }[];
}

export interface InteriorProject {
  name: string;
  area: string;
  tags: string[];
  duration: string;
  beforeImage: string;
  afterImage: string;
  description?: string;
  images?: string[];
}

export interface InteriorService {
  icon?: string;
  title: string;
  description: string;
}

export interface InteriorProcess {
  step: number;
  title: string;
  description: string;
}

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
    titleSub?: string;
    ctaLabel?: string;
  };

  solutionMain?: {
    title: string;
    description: string;
    detailContent: string;
  };

  solutions: Solution[];

  projects?: InteriorProject[];

  services?: InteriorService[];

  process?: InteriorProcess[];

  estimateForm?: {
    enabled: boolean;
    submitButtonText?: string;
    privacyText?: string;
  };

  corporateInfo: {
    ceoGreeting: {
      title: string;
      content: string;
      image: string;
      name?: string;
    };
    missionVision: {
      mission: string;
      vision: string;
    };
    history: {
      year: string;
      event: string;
    }[];
    orgChart: string;
    ciImage: string;
    location: {
headOffice: {
  address: string;
  tel: string;
  fax: string;
  mapUrl?: string;
};
    };
    esg: {
      environmental: { title: string; content: string; image: string };
      social: { title: string; content: string; image: string };
      governance: { title: string; content: string; image: string };
      mainTitle?: string;
      mainDesc?: string;
      goals?: {
        [key: number]: {
          label: string;
          title: string;
          content: string;
        };
      };
    };
    disclosure: {
      certifications: { name: string; image: string; date: string }[];
      reports: { title: string; date: string; link: string }[];
    };
    about?: string;
    vision?: string;
    ceoMessage?: string;
    representativeName?: string;
  };

  navigation: {
    menus: {
      label: string;
      children: { label: string; targetId?: string }[];
    }[];
  };

  prCenter: {
    news: { title: string; date: string; summary: string; image: string }[];
    notice: { title: string; date: string; isImportant: boolean }[];
  };

  recruit: {
    talentValue: string;
    benefitInfo: string;
    openPositions: {
      title: string;
      department: string;
      deadline: string;
      link: string;
    }[];
  };

  csCenter: {
    faq: { question: string; answer: string }[];
    contactInfo: { email: string; phone: string; address: string };
  };

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
    companyName: string;
  };
}