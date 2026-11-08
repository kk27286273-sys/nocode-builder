import { medinsurePlans } from './medinsure/plans';

export type PricingCard = {
  id: string;
  title: string;
  description: string;
  badge: string;
  price: string;
  button: string;
  product?: string;
  rows: { id: string; label: string; value: string }[];
  features: { id: string; text: string }[];
};
export type PricingSection = { id: string; title: string; description: string; highlighted: string; cards: PricingCard[] };
export type PageSection = { id: 'main-content'; pricing?: never } | { id: string; pricing: PricingSection };
type PricingData = {
  inlineSections?: PageSection[];
  paymentSection?: { enabled?: boolean; title?: string; description?: string; buttonLabel?: string };
};

const main: PageSection = { id: 'main-content' };
const won = (value: number) => `${value.toLocaleString('ko-KR')}원`;

export const defaultMedinsurePricing: PricingSection = {
  id: 'medinsure-pricing',
  title: 'MedinSure 요금제',
  description: '모든 금액은 부가세 포함이며, 모든 요금제에서 동일한 프로그램 기능을 이용할 수 있습니다.',
  highlighted: 'team',
  cards: medinsurePlans.map((plan, index) => ({
    id: plan.id, product: plan.id, title: plan.name,
    description: ['개인 설계사용', '소규모 조직용', '중규모 조직용', '대규모 조직용'][index],
    badge: plan.id === 'solo' ? '1명' : `${plan.minimum}명 이상`,
    price: `${won(plan.unit)} / ${plan.id === 'solo' ? '월' : '인·월'}`,
    button: '요금제 선택',
    rows: [
      { id: 'minimum', label: '최소 월 결제액', value: won(plan.minimum * plan.unit) },
      { id: 'discount', label: '할인', value: `${plan.discount}%` },
      { id: 'billing', label: '결제 주기', value: '월 단위' },
    ],
    features: [{ id: 'analysis', text: 'MedinSure 전체 분석 기능' }, { id: 'documents', text: 'PDF·Excel 자료 분석' }],
  })),
};

export function newPricingCard(): PricingCard {
  return { id: crypto.randomUUID(), title: '새 요금제', description: '', badge: '', price: '',
    button: '요금제 선택', rows: [], features: [] };
}

export function getPageSections(data: PricingData | null | undefined, siteId?: string | null): PageSection[] {
  if (Array.isArray(data?.inlineSections) && data.inlineSections.some((section) => section.id === main.id)) return data.inlineSections;
  const legacy = data?.paymentSection;
  if (siteId === 'medinsure') return [main, { id: defaultMedinsurePricing.id, pricing: {
    ...defaultMedinsurePricing, title: legacy?.title ?? defaultMedinsurePricing.title,
    description: legacy?.description ?? defaultMedinsurePricing.description,
    cards: defaultMedinsurePricing.cards.map((card) => ({ ...card, button: legacy?.buttonLabel ?? card.button })),
  } }];
  if (legacy?.enabled) return [main, { id: 'legacy-pricing', pricing: {
    id: 'legacy-pricing', title: legacy.title ?? '결제 / 구독', description: legacy.description ?? '', highlighted: '', cards: [],
  } }];
  return [main];
}

export function moveItem<T>(items: T[], index: number, by: number) {
  if (index + by < 0 || index + by >= items.length) return items;
  const next = [...items];
  [next[index], next[index + by]] = [next[index + by], next[index]];
  return next;
}
