import { createClient } from '@supabase/supabase-js';
import env from '@/lib/config';
import { MergeDeep } from 'type-fest';
import { StatusState } from '@/api/mikado-graph/mikado-graph';
import { Database as DatabaseGenerated } from './generated-type';

export type Database = MergeDeep<
DatabaseGenerated,
{
  public: {
    Tables: {
      mikado_graph: {
        Row: {
          goal: string,
          done: boolean,
        }
      },
      prerequisite: {
        Row: {
          all_children_done: boolean,
          label: string,
          mikado_graph_id: string,
          parent_id: string,
          prerequisite_id: string,
          started_at: string,
          status: StatusState,
        }
      }
    }
  }
}
>;

const supabaseClient = createClient<Database>(
  env.get('SUPABASE_URL'),
  env.get('SUPABASE_KEY'),
);

export default supabaseClient;
