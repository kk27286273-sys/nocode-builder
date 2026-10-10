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
    category: '법률·세무·노무',
    name: '신뢰 기반 승소·자문형',
    tagline: '승소와 절세, 신뢰를 증명하는 압도적 속도',
    description:
      '전문직의 무게감과 신뢰도를 극대화하는 딥 네이비 테마입니다. 승소 사례와 전문 자격 증명을 최우선으로 배치하여 고객의 신뢰를 즉각적으로 확보합니다.',
    themeColor: '#0F172A',
    previewUrl: '/preview?preset=legal',
    thumbnailImage:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    features: ['승소 사례 타임라인', '비밀 보장 1:1 상담 폼', '전문 자격 인증 섹션'],
    targetAudience: '변호사, 세무사, 회계사, 노무사',
    status: 'available',
    pageStructure: {
      main: '메인 페이지',
      sub: '승소/성공사례',
      conversion: '비밀상담신청',
    },
  },
  {
    id: 'counseling',
    category: '심리상담·치유',
    name: '안정과 회복 중심 케어형',
    tagline: '마음을 여는 첫 걸음, 24시간 간편 예약',
    description:
      '방문 전 불안을 낮추는 세이지 그린 테마입니다. 차분한 분위기의 공간 소개와 원장 약력을 통해 정서적 안정을 제공하고 예약 진입 장벽을 낮춥니다.',
    themeColor: '#065F46',
    previewUrl: '/preview?preset=counseling',
    thumbnailImage:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    features: ['차분한 톤앤매너 UI', '프라이빗 예약 슬롯', '내담자 안심 후기'],
    targetAudience: '심리상담센터, 치료실, 마인드케어',
    status: 'available',
    pageStructure: {
      main: '메인 페이지',
      sub: '프로그램소개',
      conversion: '간편예약',
    },
  },
  {
    id: 'fitness-lesson',
    category: '피트니스·레슨',
    name: '에너제틱 피트니스',
    tagline: '결과로 증명하는 프리미엄 PT 시스템',
    description:
      '체계적인 식단 관리와 과학적인 운동 프로그램을 통해 최단 기간 최대 효율의 신체 변화를 만들어내는 피트니스 전용 템플릿입니다.',
    themeColor: '#EA580C',
    previewUrl: '/preview?preset=fitness',
    thumbnailImage:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    features: [
      '실시간 예약 시스템 연동',
      '비포&애프터 포트폴리오 갤러리',
      '강사별 전문 분야 소개 섹션',
      '프로그램별 가격표 및 패키지 안내',
    ],
    targetAudience: 'PT 샵, 필라테스 스튜디오, 요가 센터, 개인 레슨 강사',
    status: 'available',
    pageStructure: {
      main: '강렬한 첫인상의 메인 비주얼',
      sub: '프로그램 상세 및 강사 소개',
      conversion: '간편 상담 신청 및 예약 폼',
    },
  },
  {
    id: 'b2b-rental',
    category: '기기렌탈·기업 서비스',
    name: 'B2B 견적 및 사양 안내형',
    tagline: '복잡한 견적 신청을 30초 만에 해결',
    description:
      '신속한 사양 비교와 효율성을 강조하는 스카이 블루 테마입니다. 제품 라인업과 요금제를 명확히 제시하여 빠른 견적 요청을 유도합니다.',
    themeColor: '#0284C7',
    previewUrl: '/preview?preset=rental',
    thumbnailImage:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    features: ['제품 스펙 비교표', '빠른 견적 요청 CTA', 'B2B 납품 실적'],
    targetAudience: '사무기기·가전 렌탈, B2B 서비스',
    status: 'available',
    pageStructure: {
      main: '메인 페이지',
      sub: '렌탈 라인업',
      conversion: '간편 견적요청',
    },
  },
];