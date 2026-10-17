import type { V2Page } from '@/types/builder-v2';

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
  siteName?: string;
  siteImage?: string;

  templateType: TemplateType;
  themeColor: string;

  features?: Array<Record<string, any>>;
  contactForm?: Record<string, any>;

  company: {
    name: string;
    logoUrl: string;
    phone?: string;
    subTitle?: string;
    description?: string;
    slogan?: string;
  };

  mainHero?: Record<string, any>;
  stats?: Record<string, any>;

  hero: {
    title: string;
    subtitle: string;
    badge: string;
    mediaUrl: string;
    mediaType?: string;
    titleSub?: string;
    ctaLabel?: string;
  };

  heroImageHeight?: number;

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

    history?: {
      year: string;
      event: string;
    }[];

    orgChart?: string;

    organization?: {
      title: string;
      content: string;
      image: string;
    };

    ciGuide?: {
      title: string;
      content: string;
      image: string;
    };

    location: {
      headOffice: {
        address: string;
        tel: string;
        fax: string;
        mapUrl?: string;
      };

      factory?: {
        address: string;
        tel: string;
        fax: string;
        mapUrl?: string;
      };

      mapUrl?: string;
    };

    esg?: {
      environmental: {
        title: string;
        content: string;
        image: string;
      };

      social: {
        title: string;
        content: string;
        image: string;
      };

      governance: {
        title: string;
        content: string;
        image: string;
      };

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

    disclosure?: {
      certifications: {
        name: string;
        image: string;
        date: string;
      }[];

      reports: {
        title: string;
        date: string;
        link: string;
      }[];
    };

    intro?: {
      mainTitle?: string;
      subTitle?: string;
    };

    ceo?: {
      title?: string;
    };

    about?: string;
    vision?: string;
    ceoMessage?: string;
    representativeName?: string;
  };

  navigation: {
    menus: {
      label: string;
      children: {
        label: string;
        targetId?: string;
      }[];
    }[];
  };

  prCenter: {
    news: {
      title: string;
      date: string;
      summary: string;
      image: string;
    }[];

    notice: {
      title: string;
      date: string;
      isImportant: boolean;
    }[];
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
    faq: {
      question: string;
      answer: string;
    }[];

    contactInfo: {
      email: string;
      phone: string;
      address: string;
    };
  };

  irCenter?: {
    news?: {
      date: string;
      title: string;
    }[];

    videos?: {
      title: string;
      url: string;
      thumbnail: string;
    }[];

    recruitment?: {
      talentImage: string;
      talents: string[];
      benefits: string[];
    };
  };

  customerSupport?: {
    phone?: string;
    hours?: string;
    notice?: string;
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

  specifics?: Record<string, any>;

  fontSizes?: {
    heroTitle?: number;
    subTitle?: number;
    sectionTitle?: number;
    bodyText?: number;
  };

  builderV2?: {
    pages: V2Page[];
  };
}

export interface SiteData {
  company: {
    name: string;
    logoUrl?: string;
    phone?: string;
    subTitle?: string;
    description?: string;
  };

  style?: Record<string, any>;
  specifics?: Record<string, any>;

  fontSizes?: {
    heroTitle?: number;
    subTitle?: number;
    sectionTitle?: number;
    bodyText?: number;
  };

  [key: string]: any;
}