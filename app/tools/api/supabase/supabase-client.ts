import { createClient } from '@supabase/supabase-js';
import env from '@/tools/config';
import { MergeDeep } from 'type-fest';
import { MikadoGraphState } from '@/api/mikado-graph/mikado-graph';
import { Database as DatabaseGenerated } from './generated-type';

export type Database = MergeDeep<
DatabaseGenerated,
{
  public: {
    Tables: {
      mikado_graph: {
        Row: {
          aggregate: MikadoGraphState
        }
      }
    }
  }
}
>;

const supabaseClient = createClient<Database>(
  env.get('SUPABASE_URL'),
  env.get('SUPABASE_ACCESS_TOKEN'),
);

export default supabaseClient;
