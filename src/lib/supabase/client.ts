import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 여기서 에러를 명확하게 잡아내기 위해 체크 로직을 넣습니다.
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다. Vercel Settings를 확인하세요.');
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);