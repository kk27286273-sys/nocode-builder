import { ownedSite, siteError, SiteAccessError } from '@/lib/site-access';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await ownedSite(request, body.siteId);
    // Production sites has no custom_domain column. Do not claim a successful
    // domain registration or change DNS without a verified provisioning flow.
    throw new SiteAccessError(503, '도메인 연결은 관리자 확인이 필요합니다. 기존 연결은 유지됩니다.');
  } catch(error) { return siteError(error); }
}
