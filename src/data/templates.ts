export interface B2BTemplateData {
  themeColor: string;
  company: { name: string; logoUrl: string; };
  siteImage: string; 
  supportPhone: string;
  navigation: { navLinks: { label: string; targetId: string }[]; };
  hero: { badge: string; title: string; subtitle: string; mediaUrl: string; mediaType: 'image' | 'video'; };
  heroImageHeight: number; 
  partnersSection: { enabled: boolean; title: string; partners: string[]; };
  stats: { value: string; label: string; enabled: boolean }[]; 
  solutionsSection: { title: string; subtitle: string; };
  solutionImageHeight: number; 
  solutions: { title: string; description: string; image: string; }[];
  reviewsSection: { title: string; subtitle: string; };
  reviews: { author: string; role: string; content: string; }[];
  faqs: { question: string; answer: string; }[];
  footer: { companyName: string; ownerName: string; businessNumber: string; address: string; contactEmail: string; };
  booking: { enabled: boolean; title: string; subtitle: string; availableHours: string[]; bookingMessage: string; };
  fontSizes: { companyName?: number; heroBadge?: number; heroTitle?: number; heroSubtitle?: number; partnersTitle?: number; statsValue?: number; statsLabel?: number; sectionTitle?: number; sectionSubtitle?: number; faqQuestion?: number; faqAnswer?: number; };
}

export const defaultB2BTemplateData: B2BTemplateData = {
  themeColor: '#0284C7',
  company: { name: '회사명을 입력하세요', logoUrl: '' },
  siteImage: '', 
  supportPhone: '010-0000-0000',
  navigation: { navLinks: [{ label: '회사소개', targetId: 'about' }, { label: '서비스', targetId: 'solutions' }] },
  hero: { badge: '업계 1위 정밀 시공', title: '혁신적인 기술로\n공간의 가치를 만듭니다', subtitle: '최신 설비와 숙련된 전문가가 제공하는 고품격 시공 서비스를 경험하세요.', mediaUrl: '', mediaType: 'image' },
  heroImageHeight: 450, 
  partnersSection: { enabled: true, title: '함께하는 신뢰의 파트너사', partners: ['파트너사1', '파트너사2', '파트너사3'] },
  stats: [{ value: '2,850', label: '누적 시공 실적', enabled: true }, { value: '99.8', label: '납기 준수율(%)', enabled: true }, { value: '15', label: '전문 인력 보유', enabled: true }],
  solutionsSection: { title: '핵심 솔루션', subtitle: '고객의 요구에 최적화된 맞춤형 시공 분야를 제공합니다.' },
  solutionImageHeight: 180, 
  solutions: [{ title: '정밀 설비 시공', description: '최첨단 장비를 활용한 오차 없는 정밀 시공을 보장합니다.', image: '' }, { title: '산업 시설 구축', description: '대규모 산업 단지 및 공장 시설의 최적 설계를 지원합니다.', image: '' }, { title: '유지보수 관리', description: '철저한 사후 관리 시스템으로 시설의 수명을 극대화합니다.', image: '' }],
  reviewsSection: { title: '고객 리얼 후기', subtitle: '실제 시공을 경험하신 고객님들의 생생한 목소리입니다.' },
  reviews: [{ author: '김철수 대표', role: 'OO산업', content: '약속한 기한 내에 완벽하게 마무리되어 매우 만족합니다.' }],
  faqs: [{ question: '견적 문의는 어떻게 하나요?', answer: '하단 문의 폼을 작성해 주시면 24시간 이내에 연락드립니다.' }],
  footer: { companyName: 'TH소프트', ownerName: '태헌', businessNumber: '010-2948-2728', address: '사업장 주소 입력', contactEmail: 'kk272862@naver.com' },
  booking: { enabled: false, title: '실시간 상담 예약', subtitle: '원하시는 시간을 선택하시면 담당 엔지니어가 배정됩니다.', availableHours: ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'], bookingMessage: '예약이 정상적으로 접수되었습니다. 곧 연락드리겠습니다.' },
  fontSizes: {},
};

export const B2B_PRESETS: Record<string, B2BTemplateData> = {
  legal: {
    ...defaultB2BTemplateData,
    themeColor: '#0F172A',
    company: { name: '법률사무소 정론', logoUrl: '' },
    hero: { 
      badge: '승소율 98% 전문 변호사', 
      title: '당신의 권리를 지키는\n가장 확실한 법률 파트너', 
      subtitle: '복잡한 법률 분쟁, 치밀한 전략과 압도적인 증거로 최선의 결과를 만들어냅니다.', 
      mediaUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80', 
      mediaType: 'image' 
    },
    stats: [
      { value: '1,200+', label: '누적 승소 사례', enabled: true },
      { value: '15년', label: '업계 경력', enabled: true },
      { value: '24h', label: '긴급 대응 체계', enabled: true },
    ],
    solutionsSection: { title: '전문 법률 서비스', subtitle: '분야별 전문 변호사가 밀착 케어합니다.' },
    solutions: [
      { title: '민사/형사 소송', description: '치밀한 법리 분석을 통해 의뢰인의 이익을 극대화합니다.', image: '' },
      { title: '기업 법무 자문', description: '리스크를 사전에 방지하는 체계적인 기업 법률 솔루션을 제공합니다.', image: '' },
      { title: '가사/상속 분쟁', description: '섬세한 접근과 전문성으로 가족 간의 갈등을 원만히 해결합니다.', image: '' },
    ],
    reviews: [{ author: '이OO 님', role: '개인 의뢰인', content: '막막했던 상황에서 명쾌한 해답을 주셨고, 결국 승소하여 정말 감사드립니다.' }],
    faqs: [{ question: '상담 예약은 어떻게 하나요?', answer: '하단 예약 폼을 통해 원하시는 시간을 선택하시면 확정 연락을 드립니다.' }],
    booking: { enabled: true, title: '비밀 보장 법률 상담', subtitle: '모든 상담 내용은 철저히 비밀이 보장됩니다.', availableHours: ['10:00', '11:00', '14:00', '15:00', '16:00'], bookingMessage: '상담 예약이 접수되었습니다.' },
  },
  counseling: {
    ...defaultB2BTemplateData,
    themeColor: '#065F46',
    company: { name: '마음쉼터 심리상담센터', logoUrl: '' },
    hero: { 
      badge: '국가 공인 상담 전문가', 
      title: '지친 마음이 쉬어가는\n따뜻한 치유의 공간', 
      subtitle: '혼자 고민하지 마세요. 당신의 이야기를 온전히 들어줄 전문가가 여기 있습니다.', 
      mediaUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80', 
      mediaType: 'image' 
    },
    stats: [
      { value: '5,000+', label: '누적 상담 횟수', enabled: true },
      { value: '100%', label: '비밀 유지 보장', enabled: true },
      { value: '1:1', label: '맞춤형 케어', enabled: true },
    ],
    solutionsSection: { title: '상담 프로그램', subtitle: '내담자의 상태에 맞는 단계별 치유 과정을 제공합니다.' },
    solutions: [
      { title: '개인 심리 상담', description: '우울, 불안, 공황 등 정서적 어려움을 함께 극복합니다.', image: '' },
      { title: '커플/부부 상담', description: '관계의 회복과 소통의 방법을 찾아 건강한 관계를 구축합니다.', image: '' },
      { title: '청소년 진로 상담', description: '자아 정체성 확립과 미래 설계를 위한 심리 지원을 제공합니다.', image: '' },
    ],
    reviews: [{ author: '박OO 님', role: '내담자', content: '상담을 통해 저 자신을 더 깊이 이해하게 되었고, 삶의 활력을 되찾았습니다.' }],
    faqs: [{ question: '상담 시간은 얼마나 걸리나요?', answer: '1회기 기준 보통 50분~60분 정도 소요됩니다.' }],
    booking: { enabled: true, title: '마음 돌봄 예약', subtitle: '편안한 시간에 방문해 주세요.', availableHours: ['11:00', '13:00', '15:00', '17:00', '19:00'], bookingMessage: '예약이 완료되었습니다.' },
  },
  fitness: {
    ...defaultB2BTemplateData,
    themeColor: '#EA580C',
    company: { name: '에너제틱 피트니스', logoUrl: '' },
    hero: { 
      badge: '체지방 컷팅 전문', 
      title: '인생 마지막 다이어트,\n결과로 증명합니다', 
      subtitle: '단순한 운동이 아니라 삶의 체력을 바꾸는 과학적인 PT 시스템을 경험하세요.', 
      mediaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', 
      mediaType: 'image' 
    },
    stats: [
      { value: '300kg', label: '총 감량 무게', enabled: true },
      { value: '95%', label: '회원 만족도', enabled: true },
      { value: '1:1', label: '전담 관리제', enabled: true },
    ],
    solutionsSection: { title: '트레이닝 프로그램', subtitle: '목표에 맞는 최적의 커리큘럼을 설계합니다.' },
    solutions: [
      { title: '다이어트 PT', description: '체계적인 식단과 고강도 운동으로 빠르게 체지방을 감량합니다.', image: '' },
      { title: '근력 증진/벌크업', description: '정확한 자세와 점진적 과부하 원리로 탄탄한 몸을 만듭니다.', image: '' },
      { title: '체형 교정/재활', description: '틀어진 체형을 바로잡아 통증 완화와 가동 범위를 넓힙니다.', image: '' },
    ],
    reviews: [{ author: '최OO 님', role: '회원', content: '의지박약이었는데 코치님이 끝까지 끌어주셔서 10kg 감량 성공했습니다!' }],
    faqs: [{ question: '운동 초보자도 가능한가요?', answer: '네, 당연합니다. 기초부터 차근차근 알려드리는 입문자 코스가 준비되어 있습니다.' }],
    booking: { enabled: true, title: '무료 체험 PT 예약', subtitle: '먼저 경험해보고 결정하세요.', availableHours: ['07:00', '08:00', '18:00', '19:00', '20:00'], bookingMessage: '체험 예약이 완료되었습니다.' },
  },
  rental: {
    ...defaultB2BTemplateData,
    themeColor: '#0284C7',
    company: { name: '스마트오피스 렌탈', logoUrl: '' },
    hero: { 
      badge: 'B2B 전문 렌탈 솔루션', 
      title: '사무 환경의 혁신,\n합리적인 렌탈로 시작하세요', 
      subtitle: '초기 비용 부담 없이 최신 사무기기를 도입하고 효율적인 관리 서비스를 받으세요.', 
      mediaUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', 
      mediaType: 'image' 
    },
    stats: [
      { value: '500+', label: '이용 기업 수', enabled: true },
      { value: '24h', label: 'A/S 대응 속도', enabled: true },
      { value: '30%', label: '비용 절감 효과', enabled: true },
    ],
    solutionsSection: { title: '렌탈 라인업', subtitle: '업무 효율을 극대화하는 최신 장비를 제공합니다.' },
    solutions: [
      { title: '복합기/프린터', description: '고속 출력과 스캔 기능을 갖춘 최신형 복합기 렌탈 서비스입니다.', image: '' },
      { title: 'PC/노트북 패키지', description: '사양별 맞춤 구성으로 신입 사원 및 팀 단위 장비 공급이 가능합니다.', image: '' },
      { title: '정수기/공기청정기', description: '쾌적한 사무 환경을 위한 가전 렌탈 및 정기 관리 서비스입니다.', image: '' },
    ],
    reviews: [{ author: '김 대표', role: '스타트업', content: '초기 비용 없이 최신 장비를 갖출 수 있어 사업 초기 성장에 큰 도움이 되었습니다.' }],
    faqs: [{ question: '최소 계약 기간이 있나요?', answer: '기본 24개월부터 가능하며, 기업 규모에 따라 맞춤 계약이 가능합니다.' }],
    booking: { enabled: true, title: '맞춤 견적 요청', subtitle: '필요한 수량과 사양을 알려주시면 최적의 견적을 드립니다.', availableHours: ['09:00', '10:00', '11:00', '14:00', '16:00'], bookingMessage: '견적 요청이 접수되었습니다.' },
  },
};