import {
  Clock, MikadoGraph, MikadoGraphs, UnknownMikadoGraph,
} from '@/api/mikado-graph/mikado-graph';
import { Database } from '@/api/tools/supabase/supabase-client';
import { SupabaseClient } from '@supabase/supabase-js';

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
  constructor(private supabaseClient: SupabaseClient<Database>) {}

  async add(mikadoGraph: MikadoGraph): Promise<void> {
    const state = mikadoGraph.toState();

    await this.supabaseClient
      .from('mikado_graph')
      .upsert({ mikado_graph_id: state.mikado_graph_id, goal: state.goal, done: state.done }, { onConflict: 'mikado_graph_id' });

    await this.supabaseClient
      .from('prerequisite')
      .upsert(state.prerequisite.map((p) => ({ ...p, mikado_graph_id: state.mikado_graph_id })), { onConflict: 'prerequisite_id' });
  }

  async get(id: string): Promise<MikadoGraph> {
    const { data } = await this.supabaseClient
      .from('mikado_graph')
      .select('*, prerequisite(*)')
      .eq('mikado_graph_id', id)
      .single();

    if (!data) {
      throw UnknownMikadoGraph.fromId(id);
    }

    return MikadoGraph.fromState(data);
  }
}
