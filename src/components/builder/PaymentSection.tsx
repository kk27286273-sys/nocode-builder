import Link from 'next/link';

export type PaymentSectionSettings = {
  enabled?: boolean;
  title?: string;
  description?: string;
  buttonLabel?: string;
};

export default function PaymentSection({ settings, checkoutPath }: {
  settings?: PaymentSectionSettings;
  checkoutPath?: string;
}) {
  if (!settings?.enabled) return null;
  const title = settings.title ?? '결제 / 구독';
  const description = settings.description ?? '이용 가능한 상품과 요금제를 확인하세요.';
  const buttonLabel = settings.buttonLabel ?? '요금제 보기';
  return <section className="border-y border-slate-200 bg-slate-50 px-5 py-10 text-center text-slate-900">
    {title && <h2 className="text-2xl font-bold">{title}</h2>}
    {description && <p className="mt-3 text-slate-600">{description}</p>}
    {checkoutPath && buttonLabel && <Link className="mt-4 inline-block rounded bg-blue-700 px-4 py-2 font-bold text-white" href={checkoutPath}>{buttonLabel}</Link>}
  </section>;
}
