export const defaultB2BTemplateData: B2BTemplateData = {
  templateType: 'corporate',
  themeColor: '#003366', 
  company: { 
    name: 'ATEC', 
    logoUrl: '', 
    slogan: '첨단 기술로 스마트한 미래를 여는 기업' 
  },
  siteImage: '', 
  supportPhone: '031-000-0000',
  navigation: { 
    menus: [
      { 
        label: '회사소개', 
        children: [
          { label: 'CEO 인사말', targetId: 'ceo' }, 
          { label: '미션 & 비전', targetId: 'mission' }, 
          { label: '조직도', targetId: 'org' }, 
          { label: 'CI 소개', targetId: 'ci' }, 
          { label: '오시는 길', targetId: 'location' }
        ] 
      },
      { 
        label: '사업영역', 
        children: [
          { label: '디스플레이 솔루션', targetId: 'sol' }, 
          { label: '스마트워크 시스템', targetId: 'sol' }, 
          { label: '특수 하드웨어', targetId: 'sol' }
        ] 
      },
      { 
        label: '홍보센터', 
        children: [
          { label: '회사소식', targetId: 'news' }, 
          { label: '홍보영상', targetId: 'video' }
        ] 
      },
      { 
        label: '인재경영', 
        children: [
          { label: '인재상', targetId: 'talent' }, 
          { label: '복리후생', targetId: 'benefit' }
        ] 
      },
      { 
        label: '고객센터', 
        children: [
          { label: '문의하기', targetId: 'cs' }
        ] 
      },
    ] 
  },
  corporateInfo: {
    ceoGreeting: { 
      title: '스마트 기술 혁신을 주도하는 기업', 
      content: '고객과 함께 지속 가능한 미래 가치를 창출합니다.', 
      image: '' 
    },
    missionVision: { 
      mission: '최고의 기술과 품질로 고객 가치 극대화', 
      vision: '글로벌 스마트 디바이스 및 솔루션 선도 기업' 
    },
    organization: { title: '조직도', content: '연구개발, 사업본부, 경영지원 등', image: '' },
    ciGuide: { title: 'CI 소개', content: '신뢰와 혁신을 상징하는 심볼마크', image: '' },
    location: { 
      headOffice: { address: '경기도 성남시 분당구 판교로', tel: '031-000-0000', fax: '031-000-0001' },
      factory: { address: '경기도 용인시 공장', tel: '031-000-0002', fax: '031-000-0003' },
      mapUrl: '' 
    },
  },
  solutions: [
    { 
      title: '디스플레이 솔루션 (Display Solution)', 
      category: 'Display', 
      description: '공공 및 기업 환경에 최적화된 고해상도 모니터와 스마트 안내 단말 시스템을 공급합니다.', 
      image: '', 
      detailedFeatures: [{ featureTitle: '고신뢰성 패널', featureContent: '24시간 무중단 환경 지원' }] 
    },
    { 
      title: '스마트워크 시스템 (Smart Work Solution)', 
      category: 'Smart Hardware', 
      description: '망분리 듀얼 PC, 일체형 PC 등 업무 효율과 보안을 동시에 만족하는 환경을 구축합니다.', 
      image: '', 
      detailedFeatures: [{ featureTitle: '강력한 보안성', featureContent: '업무망/인터넷망 완벽 분리 구현' }] 
    },
    { 
      title: '특수 제어 시스템 (Customized IoT)', 
      category: 'IoT / Special', 
      description: '산업현장 및 공공 인프라 특화 하드웨어 설계 및 관제 시스템을 연동합니다.', 
      image: '', 
      detailedFeatures: [{ featureTitle: '맞춤형 설계', featureContent: '고객 요구 규격 커스텀 제작' }] 
    },
  ],
  irCenter: {
    news: [{ date: '2026-10-01', title: '공공 조달 우수제품 신규 지정' }],
    videos: [{ title: '기업 소개 영상', url: '', thumbnail: '' }],
    recruitment: { talentImage: '', talents: ['도전적 혁신가', '전문성'], benefits: ['자녀 학자금', '종합건강검진'] },
  },
  customerSupport: { phone: '031-000-0000', hours: '09:00 - 18:00 (주말/공휴일 휴무)', notice: '온라인 문의 접수 시 신속히 회신드립니다.' },
  hero: { 
    badge: 'INNOVATION & TRUST', 
    title: 'Technology Leading the Smart Future', 
    subtitle: '최고의 기술력과 신뢰를 바탕으로 스마트 오피스 및 첨단 하드웨어 솔루션을 제공합니다.', 
    mediaUrl: '', 
    mediaType: 'image' 
  },
  heroImageHeight: 600, 
  footer: { 
    companyName: 'ATEC Co., Ltd.', 
    ownerName: '대표이사', 
    businessNumber: '111-22-33333', 
    address: '경기도 성남시 분당구 판교로', 
    contactEmail: 'contact@atec.kr' 
  },
  fontSizes: {},
};