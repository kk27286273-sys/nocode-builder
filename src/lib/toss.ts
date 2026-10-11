const TOSS_BASE = 'https://api.tosspayments.com/v1';

function authHeader() {
  const key = process.env.TOSS_SECRET_KEY;
  if (!key) throw new Error('TOSS_SECRET_KEY 미설정');
  return `Basic ${Buffer.from(`${key}:`).toString('base64')}`;
}

/** authKey → billingKey 발급 */
export async function issueBillingKey(authKey: string, customerKey: string) {
  const res = await fetch(`${TOSS_BASE}/billing/authorizations/issue`, {
    method: 'POST',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ authKey, customerKey }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || '빌링키 발급 실패');
  return data as { billingKey: string; card?: any };
}

/** billingKey로 실제 청구 */
export async function chargeBilling(params: {
  billingKey: string;
  customerKey: string;
  amount: number;
  orderId: string;
  orderName: string;
  customerEmail?: string;
  customerName?: string;
}) {
  const { billingKey, ...body } = params;
  const res = await fetch(`${TOSS_BASE}/billing/${billingKey}`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
      'Idempotency-Key': body.orderId,   // 중복 청구 방지
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || '결제 승인 실패');
  return data;
}