import {
  Status,
  UnknownMikadoGraph,
} from '@/api/mikado-graph/mikado-graph';
import { aMikadoGraph } from '@/test/test-utils';
import { v4 as uuidv4 } from 'uuid';
import { InMemoryMikadoGraphs, SupabaseMikadoGraphs } from '@/api/mikado-graph/mikado-graph.infra';
import supabaseClient from '@/api/tools/supabase-client';

describe('Mikado Graphs', () => {
  it.each([
    new InMemoryMikadoGraphs(),
    new SupabaseMikadoGraphs(supabaseClient),
  ])('persists a mikado graph', async (mikadoGraphs) => {
    const mikadoGraphId = uuidv4();
    const mikadoGraph = aMikadoGraph({
      mikadoGraphId,
      prerequisites: [{
        prerequisiteId: uuidv4(),
        label: 'a prerequisite',
        status: Status.TODO,
        startedAt: '2021-01-01T00:00:00.000Z',
        parentId: mikadoGraphId,
        allChildrenDone: false,
      }],
    });
    await mikadoGraphs.add(mikadoGraph);

    expect(await mikadoGraphs.get(mikadoGraphId))
      .toEqual(mikadoGraph);
  });

  it.each([
    new InMemoryMikadoGraphs(),
    new SupabaseMikadoGraphs(supabaseClient),
  ])('raises an error if the given id does not match an existing mikado graph', async (mikadoGraphs) => {
    await expect(mikadoGraphs.get('c2e2ddf8-534b-4080-b47c-0f4536b54cae')).rejects.toThrow(
      new UnknownMikadoGraph(
        'The mikado graph with the id c2e2ddf8-534b-4080-b47c-0f4536b54cae does not exist',
      ),
    );
  });
});
