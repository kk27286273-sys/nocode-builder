export const pricingReview = process.env.NEXT_PUBLIC_PRICING_REVIEW === 'true';
export const reviewStorageKey = 'thsoft-pricing-review-medinsure';

const initialData = {
  templateType: 'corporate',
  company: { name: 'MedinSure' },
  hero: { badge: 'MEDINSURE FOR WINDOWS', title: 'MedinSure', subtitle: '설계사를 위한 PDF·Excel 분석 도구' },
};

export function reviewSite() {
  let data = initialData;
  try {
    const saved = localStorage.getItem(reviewStorageKey);
    if (saved) data = JSON.parse(saved);
  } catch { /* A new browser can start with the sample data. */ }
  return { id: 'medinsure', name: 'MedinSure', template_type: 'corporate', data };
}
