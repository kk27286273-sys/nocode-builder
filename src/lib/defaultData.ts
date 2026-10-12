export const defaultData = {
    corporate: {
      templateType: 'corporate',
      hero: {
        badge: '혁신적인 솔루션',
        title: '미래를 만드는 기업',
        subtitle: '고객의 신뢰를 바탕으로 지속 가능한 성장을 추구합니다',
        mediaUrl: '',
        mediaSrcSet: '',
      },
      company: {
        name: '회사명',
        logoUrl: '',
        logoSrcSet: '',
      },
      corporateInfo: {
        representativeName: '대표이사',
        about: '슬로건',
        vision: '비전',
        ceoMessage: '대표 인사말',
        ceoGreeting: {
          name: '대표이사',
          image: '',
          content: '대표 인사말',
        },
        history: [],
        esg: {
          mainTitle: '지속가능경영',
          mainDesc: '환경, 사회, 투명경영을 통해 지속 가능한 미래를 만듭니다',
          goals: [
            { label: 'ENVIRONMENT', title: '환경경영', content: '친환경 기술 개발' },
            { label: 'SOCIAL', title: '사회공헌', content: '지역사회 발전' },
            { label: 'GOVERNANCE', title: '투명경영', content: '윤리 경영' },
          ],
        },
      },
      solutionMain: {
        title: '우리의 솔루션',
        description: '고객의 문제를 해결하는 혁신적인 솔루션',
      },
      solutions: [],
      prCenter: {
        news: [{ title: '최신 뉴스', summary: '뉴스 요약' }],
      },
      recruit: {
        talentValue: '인재상',
        benefitInfo: '복리후생',
        openPositions: [],
      },
      csCenter: {
        contactInfo: {
          phone: '02-1234-5678',
          email: 'info@company.com',
          address: '서울시 강남구',
        },
      },
      footer: {
        companyName: '회사명',
        businessNumber: '123-45-67890',
        ownerName: '대표이사',
        address: '서울시 강남구',
        contactEmail: 'info@company.com',
      },
    },
  
    'one-page': {
      templateType: 'one-page',
      hero: {
        title: '당신의 꿈의 공간을 만듭니다',
        subtitle: '전문적인 시공으로 가치 있는 인테리어',
        mediaUrl: '',
      },
      projects: [],
      services: [],
      process: [],
      csCenter: {
        contactInfo: {
          phone: '02-1234-5678',
          email: 'info@interior.com',
          address: '서울시 강남구',
        },
      },
      footer: {
        companyName: '인테리어 회사',
        address: '서울시 강남구',
        businessNumber: '123-45-67890',
      },
    },
  
    legal: {
      templateType: 'legal',
      hero: {
        title: '신뢰할 수 있는 법률 파트너',
        subtitle: '의뢰인의 권리를 지키는 전문적인 법률 서비스',
      },
      csCenter: {
        contactInfo: {
          phone: '02-1234-5678',
          email: 'info@legal.com',
          address: '서울시 강남구',
        },
      },
      footer: {
        companyName: '법률사무소',
        address: '서울시 강남구',
      },
    },
  
    fitness: {
      templateType: 'fitness',
      hero: {
        title: '당신의 피트니스 목표를 달성하세요',
        subtitle: '전문 트레이너와 함께하는 맞춤형 운동 프로그램',
        backgroundImage: '',
      },
      about: {
        title: '우리는 누구인가',
        description: '최신 시설과 경험 많은 트레이너들이 당신의 건강한 삶을 응원합니다.',
        image: '',
      },
      classes: [],
      memberships: [],
      schedule: {
        title: '운영시간',
        description: '저희는 다음과 같은 시간에 운영 중입니다',
        hours: [
          { day: '월~금', open: '06:00', close: '22:00' },
          { day: '토', open: '08:00', close: '20:00' },
          { day: '일', open: '09:00', close: '18:00' },
        ],
      },
      location: {
        address: '서울시 강남구 테헤란로 123',
        phone: '02-1234-5678',
        email: 'info@fitness.com',
      },
      csCenter: {
        contactInfo: {
          phone: '02-1234-5678',
          email: 'info@fitness.com',
          address: '서울시 강남구 테헤란로 123',
        },
      },
      footer: {
        companyName: '피트니스 스튜디오',
        address: '서울시 강남구 테헤란로 123',
      },
      kakaoLink: 'https://pf.kakao.com/_xnxoxnxK',
      themeColor: '#EA580C',
    },
  };
  
  export const getDefaultData = (templateType: string) => {
    return defaultData[templateType as keyof typeof defaultData] || defaultData.corporate;
  };