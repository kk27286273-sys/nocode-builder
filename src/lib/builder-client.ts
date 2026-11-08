export type SiteRecord = { id: string; name: string | null; data: Record<string, unknown> | null; template_type?: string | null };
type Result<T> = { data: T | null; error: { message: string } | null };

async function readSites(siteId?: string): Promise<Result<SiteRecord[]>> {
  try {
    const response = await fetch('/api/manage/sites' + (siteId ? `?siteId=${encodeURIComponent(siteId)}` : ''), { cache: 'no-store' });
    const body = await response.json();
    return { data: response.ok ? body.data : null, error: response.ok ? null : { message: body.error || '조회 실패' } };
  } catch { return { data: null, error: { message: '서버에 연결할 수 없습니다.' } }; }
}
export async function listSites() { return readSites(); }
export async function getSite(siteId: string): Promise<Result<SiteRecord>> {
  const result = await readSites(siteId);
  return { data: result.data?.[0] || null, error: result.error || (!result.data?.[0] ? { message: '사이트를 찾을 수 없습니다.' } : null) };
}
export async function changeSite(action: 'create' | 'publish' | 'delete', siteId: string, data?: unknown, templateType?: string): Promise<Result<unknown>> {
  try {
    const response = await fetch('/api/manage/sites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, siteId, data, templateType }) });
    const body = await response.json();
    return { data: body.data, error: response.ok ? null : { message: body.error || '저장 실패' } };
  } catch { return { data: null, error: { message: '서버에 연결할 수 없습니다.' } }; }
}
