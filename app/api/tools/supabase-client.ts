import { createClient } from '@supabase/supabase-js';
import env from '@/lib/config';

const supabaseClient = createClient(
  env.get('SUPABASE_URL'),
  env.get('SUPABASE_KEY'),
);

export default supabaseClient;
