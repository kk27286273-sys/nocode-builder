export interface ShowroomTemplateItem {
  id: string;
  category: string;
  name: string;
  tagline: string;
  description: string;
  themeColor: string;
  previewUrl: string;
  thumbnailImage: string;
  features: string[];
  targetAudience: string;
  status: 'available' | 'coming_soon';
  pageStructure: {
    main: string;
    sub: string;
    conversion: string;
  };
}

export const SHOWROOM_TEMPLATES: ShowroomTemplateItem[] = [
  {
    id: 'legal-tax',
    category: '법률·세무',
    name: '신뢰를 만드는 법률·세무 홈페이지',
    tagline: '전문성과 신뢰를 전달하는 법률·세무 템플릿',
    description: '법률사무소와 세무사를 위한 전문적인 홈페이지 템플릿입니다.',
    themeColor: '#0F172A',
    previewUrl: '/preview?templateId=legal',
    thumbnailImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
    features: [
      '전문 서비스 소개',
      '상담 신청 안내',
      '전문가 소개',
      '신뢰감 있는 다크 테마',
    ],
    targetAudience: '변호사, 세무사, 법률·세무 사무소',
    status: 'available',
    pageStructure: {
      main: '전문성을 강조하는 메인 페이지',
      sub: '서비스 및 전문가 소개',
      conversion: '상담 신청 및 문의',
    },
  },
  {
    id: 'counseling',
    category: '상담·케어',
    name: '상담센터 홈페이지',
    tagline: '따뜻한 분위기로 신뢰를 전달하는 상담 템플릿',
    description: '심리상담센터와 케어 서비스를 위한 차분하고 따뜻한 홈페이지 템플릿입니다.',
    themeColor: '#065F46',
    previewUrl: '/preview?templateId=counseling',
    thumbnailImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    features: [
      '상담 프로그램 소개',
      '상담사 소개',
      '상담 신청 안내',
      '차분한 그린 테마',
    ],
    targetAudience: '심리상담센터, 코칭센터, 케어 서비스',
    status: 'available',
    pageStructure: {
      main: '센터와 상담 철학 소개',
      sub: '프로그램 및 상담사 소개',
      conversion: '상담 신청',
    },
  },
  {
    id: 'fitness',
    category: '피트니스·레슨',
    name: '퍼스널 트레이닝 피트니스',
    tagline: '운동 프로그램과 시설을 효과적으로 소개하는 피트니스 템플릿',
    description: '헬스장, PT 스튜디오, 필라테스 센터를 위한 오렌지 테마 홈페이지 템플릿입니다.',
    themeColor: '#EA580C',
    previewUrl: '/preview?templateId=fitness',
    thumbnailImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    features: [
      '클래스 및 프로그램 소개',
      '이용권 가격 안내',
      '강사 소개',
      '운영시간 및 위치 안내',
    ],
    targetAudience: 'PT 스튜디오, 헬스장, 필라테스 센터, 개인 트레이너',
    status: 'available',
    pageStructure: {
      main: '강렬한 첫인상의 메인 페이지',
      sub: '프로그램 및 강사 소개',
      conversion: '상담 신청 및 이용권 선택',
    },
  },
  {
    id: 'corporate',
    category: '기업 홈페이지',
    name: '기업 공식 홈페이지',
    tagline: '기업의 경쟁력과 가치를 체계적으로 전달하는 템플릿',
    description: '회사 소개, 사업 분야, 핵심 서비스를 효과적으로 보여주는 기업형 홈페이지 템플릿입니다.',
    themeColor: '#2563EB',
    previewUrl: '/preview?templateId=corporate',
    thumbnailImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
    features: [
      '회사 소개',
      '사업 분야 소개',
      '핵심 서비스 안내',
      '문의 및 상담 연결',
    ],
    targetAudience: '스타트업, IT 기업, 전문 서비스 기업',
    status: 'available',
    pageStructure: {
      main: '기업의 핵심 경쟁력을 소개하는 메인 페이지',
      sub: '회사 및 사업 분야 소개',
      conversion: '고객 문의 및 상담',
    },
  },
];
