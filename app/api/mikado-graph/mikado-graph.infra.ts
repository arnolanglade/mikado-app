import {
  Clock, MikadoGraph, MikadoGraphs, UnknownMikadoGraph,
} from '@/api/mikado-graph/mikado-graph';
import { SupabaseClient } from '@supabase/supabase-js';
import supabaseClient, { Database } from '@/tools/api/supabase/supabase-client';

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

    const { error } = await this.client
      .from('mikado_graph')
      .upsert({ mikado_graph_id: state.mikado_graph_id, aggregate: state }, { onConflict: 'mikado_graph_id' });

    if (error) {
      throw new Error('The mikado graph cannot be saved', { cause: error });
    }
  }

  async get(id: string): Promise<MikadoGraph> {
    const { data, error } = await this.client
      .from('mikado_graph')
      .select('aggregate')
      .eq('mikado_graph_id', id)
      .maybeSingle();

    if (error) {
      throw new Error('The mikado graph cannot be retrieved', { cause: error });
    }

    if (!data) {
      throw UnknownMikadoGraph.fromId(id);
    }

    return MikadoGraph.fromState(data.aggregate);
  }
}
export const supabaseMikadoGraphs = new SupabaseMikadoGraphs(supabaseClient);
