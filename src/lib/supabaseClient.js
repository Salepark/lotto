import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] .env 파일에 VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY 가 설정되어 있는지 확인해 주세요.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // OAuth 리다이렉트 후 URL의 인가 코드를 자동으로 세션으로 교환해 줍니다.
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
});
