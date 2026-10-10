import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      '서버 환경변수(SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)가 설정되지 않았습니다.'
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * 기존 `supabaseAdmin.from(...)` 등의 호출 형태를 유지하면서,
 * 실제 속성을 사용할 때만 관리자 클라이언트를 생성합니다.
 */
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, property) {
    const client = createAdminClient();
    const value = Reflect.get(client, property, client);

    return typeof value === 'function' ? value.bind(client) : value;
  },
});