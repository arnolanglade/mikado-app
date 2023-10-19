import {
  Clock, MikadoGraph, MikadoGraphs, UnknownMikadoGraph,
} from '@/api/mikado-graph/mikado-graph';
import { SupabaseClient } from '@supabase/supabase-js';
import supabaseClient, { Database } from '@/tools/api/supabase/supabase-client';
import * as Sentry from '@sentry/nextjs';

export class SystemClock implements Clock {
  // eslint-disable-next-line class-methods-use-this
  now(): Date {
    return new Date();
  }
}

export class InMemoryClock implements Clock {
  constructor(private date: string) {
  }

  now(): Date {
    return new Date(this.date);
  }
}

export class InMemoryMikadoGraphs implements MikadoGraphs {
  constructor(private mikadoGraphs: MikadoGraph[] = []) {
  }

  async get(id: string): Promise<MikadoGraph> {
    const matchingMikadoGraph = this.mikadoGraphs
      .filter((mikadoGraph) => mikadoGraph.identifyBy(id));

    if (matchingMikadoGraph.length !== 1) {
      throw UnknownMikadoGraph.fromId(id);
    }

    return matchingMikadoGraph[0];
  }

  async add(mikadoGraph: MikadoGraph): Promise<void> {
    let isMikadoGraphFound = false;
    this.mikadoGraphs = this.mikadoGraphs.map((currentMikadoGraph) => {
      if (currentMikadoGraph.equals(mikadoGraph)) {
        isMikadoGraphFound = true;
        return mikadoGraph;
      }
      return currentMikadoGraph;
    });

    if (!isMikadoGraphFound) {
      this.mikadoGraphs = [...this.mikadoGraphs, mikadoGraph];
    }
  }
}

export class SupabaseMikadoGraphs implements MikadoGraphs {
  constructor(private client: SupabaseClient<Database>) {}

  async add(mikadoGraph: MikadoGraph): Promise<void> {
    const state = mikadoGraph.toState();

    const { error: mikadoGraphError } = await this.client
      .from('mikado_graph')
      .upsert({ mikado_graph_id: state.mikado_graph_id, goal: state.goal, done: state.done }, { onConflict: 'mikado_graph_id' });

    if (mikadoGraphError) {
      throw new Error('The mikado graph cannot be saved', { cause: mikadoGraphError });
    }

    const { error: prerequisiteError } = await this.client
      .from('prerequisite')
      .upsert(state.prerequisite.map((p) => ({ ...p, mikado_graph_id: state.mikado_graph_id })), { onConflict: 'prerequisite_id' });

    if (prerequisiteError) {
      throw new Error('The prerequisites cannot be saved', { cause: prerequisiteError });
    }
  }

  async get(id: string): Promise<MikadoGraph> {
    const { data } = await this.client
      .from('mikado_graph')
      .select('mikado_graph_id, goal, done, prerequisite(prerequisite_id, label, status, started_at, parent_id, all_children_done)')
      .eq('mikado_graph_id', id)
      .single();

    if (!data) {
      throw UnknownMikadoGraph.fromId(id);
    }

    Sentry.captureMessage('Mikado graph loaded from Supabase', { extra: { data } });

    return MikadoGraph.fromState(data);
  }
}
export const supabaseMikadoGraphs = new SupabaseMikadoGraphs(supabaseClient);
