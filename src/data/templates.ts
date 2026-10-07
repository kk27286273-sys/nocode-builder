export interface B2BTemplateData {
  themeColor: string;
  company: { 
    name: string; 
    logoUrl: string; 
    slogan: string; // "글로벌 No.1 자동화 플랫폼 전문기업"
  };
  siteImage: string; 
  supportPhone: string;
  
  // [확장] 계층형 네비게이션 (메가 메뉴 구조)
  navigation: { 
    menus: { 
      label: string; 
      children: { label: string; targetId: string }[]; 
    }[]; 
  };

  // [확장] 기업 상세 정보 (회사소개 탭)
  corporateInfo: {
    ceoGreeting: { title: string; content: string; image: string; };
    missionVision: { mission: string; vision: string; };
    organization: { title: string; content: string; image: string; };
    ciGuide: { title: string; content: string; image: string; };
    location: { 
      headOffice: { address: string; tel: string; fax: string; };
      factory: { address: string; tel: string; fax: string; };
      mapUrl: string;
    };
  };

  // [확장] 전문 솔루션 구조 (사업소개 탭)
  solutions: { 
    title: string; 
    category: string; // 예: "Financial Solution"
    description: string; 
    image: string; 
    detailedFeatures: { featureTitle: string; featureContent: string; }[]; 
  }[];

  // [확장] IR 및 홍보 센터 (홍보센터 탭)
  irCenter: {
    news: { date: string; title: string; }[];
    videos: { title: string; url: string; thumbnail: string; }[];
    recruitment: { 
      talentImage: string; 
      talents: string[]; // 인재상 리스트
      benefits: string[]; // 복리후생 리스트
    };
  };

  // [확장] 고객지원 (고객센터 탭)
  customerSupport: {
    phone: string;
    hours: string;
    notice: string;
  };

  // 기존 호환성 유지 항목
  hero: { badge: string; title: string; subtitle: string; mediaUrl: string; mediaType: 'image' | 'video'; };
  heroImageHeight: number; 
  footer: { companyName: string; ownerName: string; businessNumber: string; address: string; contactEmail: string; };
  fontSizes: { [key: string]: number; };
}

export const defaultB2BTemplateData: B2BTemplateData = {
  themeColor: '#0284C7',
  company: { name: '회사명', logoUrl: '', slogan: '기업 슬로건을 입력하세요' },
  siteImage: '', 
  supportPhone: '010-0000-0000',
  navigation: { 
    menus: [
      { label: '회사소개', children: [{ label: 'CEO 인사말', targetId: 'ceo' }, { label: '미션&비전', targetId: 'mission' }] },
      { label: '사업소개', children: [{ label: '솔루션 리스트', targetId: 'solutions' }] },
    ] 
  },
  corporateInfo: {
    ceoGreeting: { title: 'CEO 인사말', content: '인사말 내용을 입력하세요.', image: '' },
    missionVision: { mission: '미션을 입력하세요.', vision: '비전을 입력하세요.' },
    organization: { title: '조직도', content: '조직도 설명', image: '' },
    ciGuide: { title: 'CI 소개', content: 'CI 설명', image: '' },
    location: { 
      headOffice: { address: '본사 주소', tel: '02-000-0000', fax: '02-000-0000' },
      factory: { address: '공장 주소', tel: '031-000-0000', fax: '031-000-0000' },
      mapUrl: '' 
    },
  },
  solutions: [
    { title: '솔루션 1', category: 'Category 1', description: '설명', image: '', detailedFeatures: [] },
  ],
  irCenter: {
    news: [],
    videos: [],
    recruitment: { talentImage: '', talents: [], benefits: [] },
  },
  customerSupport: { phone: '1800-0000', hours: '09:00 - 18:00', notice: '안내 문구' },
  hero: { badge: 'Badge', title: 'Title', subtitle: 'Subtitle', mediaUrl: '', mediaType: 'image' },
  heroImageHeight: 500, 
  footer: { companyName: 'TH소프트', ownerName: '태헌', businessNumber: '010-2948-2728', address: '주소', contactEmail: 'kk272862@naver.com' },
  fontSizes: {},
};

export const B2B_PRESETS: Record<string, B2BTemplateData> = {
  corporate_atec: {
    ...defaultB2BTemplateData,
    themeColor: '#003366', // Deep Navy
    company: { 
      name: '에이텍(ATEC)', 
      logoUrl: 'https://www.atec.co.kr/img/common/logo.png', 
      slogan: '글로벌 No.1 자동화 플랫폼 전문기업' 
    },
    navigation: { 
      menus: [
        { label: '회사소개', children: [{ label: 'CEO 인사말', targetId: 'ceo' }, { label: '미션 & 비전', targetId: 'mission' }, { label: '조직도', targetId: 'org' }, { label: 'CI 소개', targetId: 'ci' }, { label: '오시는 길', targetId: 'location' }] },
        { label: '사업소개', children: [{ label: 'Financial Solution', targetId: 'sol_fin' }, { label: 'Retail Solution', targetId: 'sol_ret' }, { label: 'Overseas Solution', targetId: 'sol_ove' }, { label: 'ESL Solution', targetId: 'sol_esl' }, { label: 'Service Infra Solution', targetId: 'sol_inf' }] },
        { label: '지속가능경영', children: [{ label: '사회공헌', targetId: 'csr' }, { label: '윤리경영', targetId: 'ethics' }] },
        { label: '홍보센터', children: [{ label: '회사소식', targetId: 'news' }, { label: '홍보영상', targetId: 'video' }] },
        { label: '인재경영', children: [{ label: '인재상', targetId: 'talent' }, { label: '복리후생', targetId: 'benefit' }, { label: '채용정보', targetId: 'recruit' }] },
        { label: '고객센터', children: [{ label: '고객의 의견', targetId: 'cs_voice' }] },
      ] 
    },
    corporateInfo: {
      ceoGreeting: { title: '고객에게 새로운 가치를 제공하고 구성원의 행복을 추구합니다', content: '에이텍은 자동화 플랫폼 전문기업으로서...', image: 'https://www.atec.co.kr/img/sub/ceo/ceo_img.jpg' },
      missionVision: { mission: '유통 파트너에게 차별화된 경험을 선사하는 스마트 솔루션 제공', vision: '글로벌 No.1 자동화 플랫폼 전문기업' },
      organization: { title: '효율적인 경영 체계', content: '글로벌 시장 대응을 위한 최적의 조직 구성', image: '' },
      ciGuide: { title: 'ATEC Identity', content: '미래지향적인 가치를 담은 CI', image: '' },
      location: { 
        headOffice: { address: '경기도 성남시 분당구 판교로 289 에이텍빌딩', tel: '1800-5200', fax: '031-698-8800' },
        factory: { address: '경기도 평택시 진위면 진위산단로 53-94', tel: '031-000-0000', fax: '031-000-0000' },
        mapUrl: 'https://map.naver.com' 
      },
    },
    solutions: [
      { 
        title: '32년 역사의 금융노하우', 
        category: 'Financial Solution', 
        description: '금융 파트너와 새로운 가치를 만들어 나가며, 고객에게 미래의 경험과 감동을 제공합니다.', 
        image: 'https://images.unsplash.com/photo-1560518883-ce1f5397756d?w=800', 
        detailedFeatures: [{ featureTitle: '현금 자동화 솔루션', featureContent: '최고 수준의 보안성과 안정성을 갖춘 ATM 솔루션' }] 
      },
      { 
        title: '차세대 스마트 솔루션', 
        category: 'Retail Solution', 
        description: '복잡한 매장업무를 간편하게 운영할 수 있는 차세대 스마트 솔루션을 제공합니다.', 
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd6001e?w=800', 
        detailedFeatures: [{ featureTitle: '스마트 키오스크', featureContent: '사용자 경험을 극대화한 무인 단말기 시스템' }] 
      },
      // ... 기타 솔루션 데이터 추가 가능
    ],
    irCenter: {
      news: [{ date: '2026-10-07', title: '에이텍, 글로벌 시장 진출 가속화' }],
      videos: [{ title: '에이텍 홍보영상', url: 'https://youtube.com', thumbnail: '' }],
      recruitment: { talentImage: '', talents: ['도전하는 인재', '창의적인 인재'], benefits: ['유연근무제', '자기계발비 지원'] },
    },
    customerSupport: { phone: '1800-5200', hours: '평일 08:30 - 18:00', notice: '공휴일 및 주말은 접수가 지연될 수 있습니다.' },
    hero: { badge: 'Global No.1', title: '자동화 플랫폼\n전문기업 에이텍', subtitle: '유통 파트너에게 차별화된 경험을 선사하고,\n복잡한 매장업무를 간편하게 운영할 수 있는\n차세대 스마트 솔루션을 제공합니다.', mediaUrl: 'https://images.unsplash.com/photo-1486406146936-c998bd26895c?w=1200', mediaType: 'image' },
    heroImageHeight: 700, 
    footer: { companyName: '에이텍', ownerName: '대표이사 OOO', businessNumber: '000-00-00000', address: '경기도 성남시 분당구 판교로 289', contactEmail: 'info@atec.co.kr' },
    fontSizes: {},
  },
  // 기존 프리셋들도 위 구조에 맞춰 마이그레이션 가능
};