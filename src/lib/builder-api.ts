import { supabase } from '@/lib/supabase/client';
let redirecting = false;
function loginRequired() {
  if (!redirecting) { redirecting = true; window.location.replace('/login?next=/builder'); }
}

export async function builderApi(method: string, id?: string, body?: object) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { loginRequired(); return { data: null, error: { message: '개인 로그인이 필요합니다.' } }; }
    const response = await fetch('/api/builder/sites' + (id ? '?id=' + encodeURIComponent(id) : ''), {
      method, headers: { Authorization: 'Bearer ' + session.access_token, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined, cache: 'no-store',
    });
    const result = await response.json();
    if (response.status === 401) loginRequired();
    return response.ok ? { data: result.data, error: null } : { data: null, error: { message: result.error || '요청 실패' } };
  } catch { return { data: null, error: { message: '서버에 연결할 수 없습니다.' } }; }
}
