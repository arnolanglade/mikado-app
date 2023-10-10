import {
  Clock, MikadoGraph, MikadoGraphs, UnknownMikadoGraph,
} from '@/api/mikado-graph/mikado-graph';

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
