import { createClient } from '@supabase/supabase-js';

// 1. 클라이언트를 생성하는 함수 (유연한 사용을 위해 유지)
export function createAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('서버 환경변수(SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY)가 설정되지 않았습니다.');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// 2. 기존 파일들이 찾고 있는 'supabaseAdmin' 변수를 여기서 미리 생성해서 내보냅니다.
// 이렇게 하면 다른 파일들을 수정하지 않아도 즉시 에러가 해결됩니다.
export const supabaseAdmin = createAdminClient();