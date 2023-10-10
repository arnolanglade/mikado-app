import {
  UnknownMikadoGraph,
} from '@/api/mikado-graph/mikado-graph';
import { aMikadoGraph } from '@/test/test-utils';
import { v4 as uuidv4 } from 'uuid';
import { InMemoryMikadoGraphs } from '@/api/mikado-graph/mikado-graph.infra';

describe('Mikado Graphs', () => {
  it('persists a mikado graph', async () => {
    const mikadoGraphId = uuidv4();
    const mikadoGraphs = new InMemoryMikadoGraphs();

    await mikadoGraphs.add(aMikadoGraph({ mikadoGraphId }));

    expect(await mikadoGraphs.get(mikadoGraphId))
      .toEqual(aMikadoGraph({ mikadoGraphId }));
  });

  it('raises an error if the given id does not match an existing mikado graph', async () => {
    const mikadoGraphs = new InMemoryMikadoGraphs([
      aMikadoGraph({ mikadoGraphId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' }),
    ]);

    await expect(mikadoGraphs.get('c2e2ddf8-534b-4080-b47c-0f4536b54cae')).rejects.toThrow(
      new UnknownMikadoGraph(
        'The mikado graph with the id c2e2ddf8-534b-4080-b47c-0f4536b54cae does not exist',
      ),
    );
  });
});
