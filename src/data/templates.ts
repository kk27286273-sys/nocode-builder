export interface StoryItem {
  id: string;
  title: string;
  content: string;
  images: string[];
}

export interface PageData {
  siteId: string;
  imageUrl: string;
  backgroundColor: string;
  title: string;
  titleColor: string;
  titleFont: 'sans' | 'serif' | 'mono';
  titleSizePx: number;
  subtitle: string;
  subtitleColor: string;
  subtitleFont: 'sans' | 'serif' | 'mono';
  subtitleSizePx: number;
  featureAlign: 'left' | 'center' | 'right';
  featureFont: 'sans' | 'serif' | 'mono';
  featureTitleSizePx: number;
  featureDescSizePx: number;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  stories: StoryItem[];
  faq1Q: string;
  faq1A: string;
  faq2Q: string;
  faq2A: string;
  faq3Q: string;
  faq3A: string;
  buttonText: string;
  buttonLink: string;
  primaryColor: string;
  buttonFont: 'sans' | 'serif' | 'mono';
  buttonSizePx: number;
}

export const TEMPLATES: Record<string, Partial<PageData>> = {
  market: {
    title: '봄 시즌 한정 홈카페 오로라 글라스',
    titleColor: '#4a3b32',
    titleFont: 'serif',
    titleSizePx: 22,
    subtitle: '빛에 따라 영롱하게 빛나는 감성 테이블웨어. 단 3일간 30% 할인 공구 오픈!',
    subtitleColor: '#8c7b70',
    subtitleFont: 'serif',
    subtitleSizePx: 13,
    backgroundColor: '#faf7f2',
    primaryColor: '#c2785c',
    buttonText: '공구 특별가로 주문하기',
    buttonFont: 'serif',
    buttonSizePx: 14,
    featureAlign: 'center',
    featureFont: 'serif',
    featureTitleSizePx: 13,
    featureDescSizePx: 11,
    feature1Title: '영롱한 오로라 코팅',
    feature1Desc: '음료를 담는 순간 감성적인 분위기를 연출합니다.',
    feature2Title: '내열 강화 유리',
    feature2Desc: '뜨거운 커피부터 차가운 에이드까지 안전합니다.',
    feature3Title: '무료 배송 & 선물 포장',
    feature3Desc: '2세트 이상 구매 시 기프트 박스에 포장됩니다.',
    stories: [
      {
        id: '1',
        title: '일상에 작은 빛을 더하는 글라스웨어',
        content: '매일 마시는 커피 한 잔도 특별해질 수 있도록 제작했습니다. 수작업 이온 코팅 공법으로 빛의 각도마다 영롱한 빛을 냅니다.',
        images: [
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=60'
        ],
      }
    ],
    faq1Q: '식기세척기나 전자레인지 사용이 가능한가요?',
    faq1A: '특수 코팅 보호를 위해 전자레인지 및 식기세척기 사용은 피해주시고 부드러운 손세척을 권장합니다.',
    faq2Q: '배송은 언제 시작되나요?',
    faq2A: '공구 마감 익일부터 순차 출고되며 영업일 기준 2~3일 내 수령 가능합니다.',
    faq3Q: '',
    faq3A: '',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=60',
  },
  consulting: {
    title: '복잡한 세무·보험, 전문가가 1:1 맞춤 진단합니다',
    titleColor: '#0f172a',
    titleFont: 'sans',
    titleSizePx: 21,
    subtitle: '놓치고 있는 환급금과 과다 지출 보험료를 꼼꼼하게 찾아드립니다.',
    subtitleColor: '#475569',
    subtitleFont: 'sans',
    subtitleSizePx: 13,
    backgroundColor: '#ffffff',
    primaryColor: '#2563eb',
    buttonText: '무료 1:1 진단 신청하기',
    buttonFont: 'sans',
    buttonSizePx: 14,
    featureAlign: 'left',
    featureFont: 'sans',
    featureTitleSizePx: 13,
    featureDescSizePx: 11,
    feature1Title: '빅데이터 기반 정밀 진단',
    feature1Desc: '수만 건의 약관 데이터를 기반으로 분석합니다.',
    feature2Title: '100% 무료 비대면 상담',
    feature2Desc: '전화 또는 카카오톡으로 부담 없이 상담받으세요.',
    feature3Title: '철저한 개인정보 보호',
    feature3Desc: '상담 목적 외에는 정보를 일절 보관하지 않습니다.',
    stories: [
      {
        id: '1',
        title: '왜 지금 진단받아야 할까요?',
        content: '대부분의 사람들은 본인이 가입한 약관의 80%를 알지 못한 채 매달 불필요한 비용을 지출합니다. 전문 플래너가 중복 보장을 덜어내 드립니다.',
        images: [],
      }
    ],
    faq1Q: '정말 상담 비용이 전혀 없나요?',
    faq1A: '네, 1차 종합 진단 리포트 발행 및 분석 상담은 100% 무료로 진행됩니다.',
    faq2Q: '상담 신청 후 언제 연락이 오나요?',
    faq2A: '신청서 접수 후 담당 전문 플래너가 영업시간 기준 2시간 내로 연락드립니다.',
    faq3Q: '',
    faq3A: '',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60',
  },
  waitlist: {
    title: '차세대 AI 생산성 툴, Horizon',
    titleColor: '#f8fafc',
    titleFont: 'mono',
    titleSizePx: 23,
    subtitle: '반복 업무는 이제 그만. 당신의 일상에 AI 비서를 도입하세요.',
    subtitleColor: '#94a3b8',
    subtitleFont: 'mono',
    subtitleSizePx: 12,
    backgroundColor: '#0f172a',
    primaryColor: '#10b981',
    buttonText: '얼리버드 사전예약 참여',
    buttonFont: 'mono',
    buttonSizePx: 13,
    featureAlign: 'left',
    featureFont: 'mono',
    featureTitleSizePx: 13,
    featureDescSizePx: 11,
    feature1Title: 'LIGHTNING FAST',
    feature1Desc: '단축키 하나로 워크플로우를 자동 실행합니다.',
    feature2Title: 'SEAMLESS SYNC',
    feature2Desc: '기기 간 실시간 무제한 동기화를 지원합니다.',
    feature3Title: 'EARLY ACCESS ONLY',
    feature3Desc: '사전예약자 한정 평생 50% 할인 혜택을 드립니다.',
    stories: [
      {
        id: '1',
        title: 'ABOUT HORIZON',
        content: 'Horizon은 문서 작성, 데이터 정제, 스케줄링을 단 몇 초 만에 자율 에이전트에게 위임할 수 있도록 설계된 차세대 생산성 도구입니다.',
        images: [],
      }
    ],
    faq1Q: '정식 출시는 언제인가요?',
    faq1A: '2026년 4분기 중 클로즈드 베타를 시작으로 공식 런칭됩니다.',
    faq2Q: '사전예약 혜택은 어떻게 받나요?',
    faq2A: '사전예약 시 등록한 연락처로 베타 초대권 및 50% 할인 프로모션 코드가 전송됩니다.',
    faq3Q: '',
    faq3A: '',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
  },
};