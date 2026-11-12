/** NEXIA billing uses Korean calendar dates, independently of the server timezone. */
export function koreanDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error('Invalid billing timestamp');
  return new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function parseDate(value: string): [number, number, number] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Invalid billing date');
  const [year, month, day] = value.split('-').map(Number);
  if (year < 2000 || year > 9998 || month < 1 || month > 12 || day < 1 ||
    day > new Date(Date.UTC(year, month, 0)).getUTCDate()) throw new Error('Invalid billing date');
  return [year, month, day];
}

/** Keep the ORIGINAL day even after a short month: Jan 31 -> Feb 28 -> Mar 31. */
export function nextBillingDate(currentDue: string, originalDay: number): string {
  const [year, month] = parseDate(currentDue);
  if (!Number.isInteger(originalDay) || originalDay < 1 || originalDay > 31) throw new Error('Invalid billing anchor');
  const nextYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const day = Math.min(originalDay, new Date(Date.UTC(nextYear, nextMonth, 0)).getUTCDate());
  return `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function billingAnchor(approvedAt: string): number {
  if (!approvedAt || !/T.*(?:Z|[+-]\d{2}:\d{2})$/.test(approvedAt)) throw new Error('Missing verified first payment timestamp');
  return parseDate(koreanDate(approvedAt))[2];
}

/** Approved policy: actual paid amount, no discount clawback; refund request day is unused. */
export function unusedPeriodRefund(amount: number, start: string, endExclusive: string, requested: string): number {
  for (const date of [start, endExclusive, requested]) parseDate(date);
  if (!Number.isSafeInteger(amount) || amount < 0) throw new Error('Invalid paid amount');
  const from = Date.parse(start + 'T00:00:00Z');
  const to = Date.parse(endExclusive + 'T00:00:00Z');
  if (to <= from) throw new Error('Invalid paid period');
  const remaining = to - Math.max(from, Math.min(to, Date.parse(requested + 'T00:00:00Z')));
  // Round a fractional won in the customer's favour, never exceeding the payment.
  return Math.min(amount, Math.ceil(amount * (remaining / (to - from))));
}
