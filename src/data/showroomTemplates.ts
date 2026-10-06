export interface ShowroomTemplateItem {
  id: string;
  category: string;
  name: string;
  tagline: string;
  description: string;
  themeColor: string;
  previewUrl: string; // 현재 기본 프리뷰 경로 및 쿼리 파라미터 활용
  thumbnailImage: string;
  features: string[];
  targetAudience: string;
  status: 'available' | 'coming_soon';
}

export const SHOWROOM_TEMPLATES: ShowroomTemplateItem[] = [
  {
    id: 'legal-tax',
    category: '법률·세무·노무',
    name: '신뢰 기반 승소·자문형',
    tagline: '전문직의 무게감과 승소 실적을 강조하는 다크 블루 테마',
    description: '고객에게 가장 중요한 전문 자격, 승소·자문 이력, 비밀 보장 상담 예약 동선에 집중한 템플릿입니다.',
    themeColor: '#1E3A8A',
    previewUrl: '/preview?preset=legal',
    thumbnailImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    features: ['전문 이력 타임라인', '비밀 보장 1:1 예약 폼', '사건/자문 통계 지표'],
    targetAudience: '변호사, 세무사, 회계사, 노무사',
    status: 'available'
  },
  {
    id: 'therapy-counseling',
    category: '심리상담·치유',
    name: '안정과 회복 중심 케어형',
    tagline: '방문 전 불안을 낮추는 차분한 세이지 그린 테마',
    description: '공간 분위기 소개, 원장 약력, 100% 사전 예약 안내를 통해 고객의 첫 상담 진입 장벽을 낮춥니다.',
    themeColor: '#2D5A47',
    previewUrl: '/preview?preset=counseling',
    thumbnailImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    features: ['차분한 컬러 톤앤매너', '프라이빗 예약 타임슬롯', '내담자 후기 캐러셀'],
    targetAudience: '심리상담센터, 미술치료실, 마인드케어 클리닉',
    status: 'available'
  },
  {
    id: 'fitness-lesson',
    category: 'PT·필라테스·레슨',
    name: '성과 전환 에너제틱형',
    tagline: '바디프로필·비포애프터 성과를 직관적으로 보여주는 테마',
    description: '강사진 프로필, 회원 비포애프터 지표, 1회 체험 예약 전환을 최우선으로 배치한 고전환 템플릿입니다.',
    themeColor: '#EA580C',
    previewUrl: '/preview?preset=fitness',
    thumbnailImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    features: ['강사진 상세 스펙 카드', '체험 세션 신청 폼', '위치/시설 고화질 갤러리'],
    targetAudience: '1:1 PT 스튜디오, 필라테스, 골프/음악 레슨',
    status: 'available'
  },
  {
    id: 'rental-b2b',
    category: '기기렌탈·기업 서비스',
    name: 'B2B 견적 및 사양 안내형',
    tagline: '신속한 사양 비교와 빠른 견적서 요청에 최적화된 테마',
    description: '제품군 스펙 표기, 월 렌탈 요금제 안내, 대량 납품 문의 폼이 통합된 실무형 템플릿입니다.',
    themeColor: '#0284C7',
    previewUrl: '/preview?preset=rental',
    thumbnailImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    features: ['요금제/스펙 비교 테이블', '빠른 상담 콜투액션(CTA)', 'FAQ 기반 이탈 방지'],
    targetAudience: '사무기기 렌탈, 특수장비 대여, B2B 대행사',
    status: 'available'
  }
];