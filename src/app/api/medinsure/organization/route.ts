import { createHash, randomBytes } from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/admin';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const actions = ['list', 'dashboard', 'invite', 'cancel_invite', 'accept', 'delegate', 'seats', 'remove_member'];
const messages: Record<string, string> = {
  seat_limit_exceeded: '배정 가능한 이용권 수를 초과했습니다.',
  already_assigned: '이미 배정된 직원이 있습니다.',
  subscription_not_assignable: '현재 구독 상태에서는 이용권을 배정할 수 없습니다.',
  invite_invalid: '초대가 만료되었거나 로그인 이메일이 초대 대상과 일치하지 않습니다.',
  organization_access_denied: '이 조직에 대한 권한이 없습니다.',
  organization_transfer_required: '이미 다른 조직에 소속되어 있습니다. 조직 이동은 운영자에게 문의해 주세요.',
  already_member: '이미 소속된 직원입니다.',
};

function hash(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export async function POST(request: Request) {
  const token = request.headers.get('authorization')?.match(/^Bearer (\S+)$/i)?.[1];
  if (!token) return Response.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!actions.includes(body?.action)) return Response.json({ error: '요청을 확인해 주세요.' }, { status: 400 });
  const { action } = body;
  const organizationId = action === 'list' || action === 'accept' ? null : body.organizationId;
  if (organizationId !== null && (typeof organizationId !== 'string' || !uuid.test(organizationId))) {
    return Response.json({ error: '조직을 선택해 주세요.' }, { status: 400 });
  }

  const payload: Record<string, unknown> = {};
  let inviteToken: string | undefined;
  const invalid = () => Response.json({ error: '입력값을 확인해 주세요.' }, { status: 400 });
  if (action === 'invite' || action === 'cancel_invite') {
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return invalid();
    payload.email = email;
    if (action === 'invite') {
      inviteToken = randomBytes(32).toString('hex');
      payload.hash = hash(inviteToken);
    }
  } else if (action === 'accept') {
    if (typeof body.token !== 'string' || !/^[a-f0-9]{64}$/.test(body.token)) return invalid();
    payload.hash = hash(body.token);
  } else if (action === 'delegate') {
    if (typeof body.userId !== 'string' || !uuid.test(body.userId) || typeof body.enabled !== 'boolean') return invalid();
    Object.assign(payload, { userId: body.userId, enabled: body.enabled });
  } else if (action === 'remove_member') {
    if (typeof body.userId !== 'string' || !uuid.test(body.userId)) return invalid();
    payload.userId = body.userId;
  } else if (action === 'seats') {
    const { assign, revoke } = body;
    if (![assign, revoke].every((list) => Array.isArray(list) &&
      list.length <= 200 && list.every((id) => typeof id === 'string' && uuid.test(id)))) return invalid();
    Object.assign(payload, { assign, revoke });
  }

  try {
    const db = createAdminClient();
    const { data: { user }, error: authError } = await db.auth.getUser(token);
    if (authError || !user) return Response.json({ error: '로그인이 만료되었습니다.' }, { status: 401 });
    const { data, error } = await db.rpc('medinsure_organization', {
      actor: user.id, verified_email: user.email_confirmed_at ? user.email : null,
      org: organizationId, action, payload,
    });
    if (error) return Response.json({ error: messages[error.message] || '조직 작업을 처리하지 못했습니다.' },
      { status: error.code === '42501' ? 403 : ['22023', '23514', '23505'].includes(error.code) ? 409 : 503 });
    return Response.json({ data, inviteToken });
  } catch {
    return Response.json({ error: '조직 서버를 사용할 수 없습니다.' }, { status: 503 });
  }
}
