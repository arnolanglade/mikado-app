import {
  Status,
} from '@/api/mikado-graph/mikado-graph';
import { aMikadoGraph } from '@/test/test-utils';
import { v4 as uuidv4 } from 'uuid';
import { InMemoryClock, InMemoryMikadoGraphs } from '@/api/mikado-graph/mikado-graph.infra';
import {
  handleAddPrerequisite,
  handleCommitChanges, handleGetMikadoGraphById, handleStartExperimentation,
  handleStartTask,
} from '@/api/mikado-graph/mikado-graph.usecase';

describe('Mikado Graph use cases', () => {
  test('The developer starts a mikado graph', async () => {
    const mikadoGraphId = uuidv4();
    const mikadoGraphs = new InMemoryMikadoGraphs();
    await handleStartTask(mikadoGraphs)({
      mikadoGraphId,
      goal: 'Rework that part',
    });

    expect(await mikadoGraphs.get(mikadoGraphId))
      .toEqual(aMikadoGraph({
        mikadoGraphId,
        goal: 'Rework that part',
      }));
  });

  test('The developer adds a prerequisite to a mikado graph', async () => {
    const mikadoGraphId = uuidv4();
    const prerequisiteId = uuidv4();
    const label = 'Change that';
    const mikadoGraphs = new InMemoryMikadoGraphs([aMikadoGraph({
      mikadoGraphId,
      prerequisites: [],
    })]);

    await handleAddPrerequisite(mikadoGraphs)({
      prerequisiteId,
      mikadoGraphId,
      label,
    });

    expect(await mikadoGraphs.get(mikadoGraphId))
      .toEqual(aMikadoGraph({
        mikadoGraphId,
        prerequisites: [{ prerequisiteId, label, status: Status.TODO }],
      }));
  });

  test('The developer starts an experimentation on a todo prerequisite', async () => {
    const mikadoGraphId = uuidv4();
    const prerequisiteId = uuidv4();
    const mikadoGraphs = new InMemoryMikadoGraphs([aMikadoGraph({
      mikadoGraphId,
      prerequisites: [{ prerequisiteId, status: Status.TODO, startedAt: undefined }],
    })]);
    const clock = new InMemoryClock('2023-07-25T10:24:00');

    await handleStartExperimentation(mikadoGraphs, clock)({
      mikadoGraphId,
      prerequisiteId,
    });

    expect(await mikadoGraphs.get(mikadoGraphId))
      .toEqual(aMikadoGraph({
        mikadoGraphId,
        prerequisites: [{ prerequisiteId, status: Status.EXPERIMENTING, startedAt: '2023-07-25T10:24:00' }],
      }));
  });

  test('The developer adds a prerequisite to a prerequisite', async () => {
    const mikadoGraphId = uuidv4();
    const existingPrerequisiteId = uuidv4();
    const prerequisiteId = uuidv4();
    const label = 'Change that';
    const existingPrerequisite = { prerequisiteId: existingPrerequisiteId, status: Status.EXPERIMENTING };
    const mikadoGraphs = new InMemoryMikadoGraphs([aMikadoGraph({
      mikadoGraphId,
      prerequisites: [existingPrerequisite],
    })]);

    await handleAddPrerequisite(mikadoGraphs)({
      mikadoGraphId,
      prerequisiteId,
      parentId: existingPrerequisiteId,
      label,
    });

    expect(await mikadoGraphs.get(mikadoGraphId))
      .toEqual(aMikadoGraph({
        mikadoGraphId,
        prerequisites: [
          { ...existingPrerequisite, canBeCommitted: false },
          {
            prerequisiteId, parentId: existingPrerequisiteId, label, status: Status.TODO,
          },
        ],
      }));
  });

  test('The developer commits a change when the prerequisite is finished', async () => {
    const mikadoGraphId = uuidv4();
    const prerequisiteId = uuidv4();
    const mikadoGraphs = new InMemoryMikadoGraphs([aMikadoGraph({
      mikadoGraphId,
      prerequisites: [{ prerequisiteId, status: Status.EXPERIMENTING }],
    })]);

    await handleCommitChanges(mikadoGraphs)({
      mikadoGraphId,
      prerequisiteId,
    });

    expect(await mikadoGraphs.get(mikadoGraphId))
      .toEqual(aMikadoGraph({
        mikadoGraphId,
        done: true,
        prerequisites: [{
          prerequisiteId, status: Status.DONE,
        }],
      }));
  });

  test('The developer gets the mikado graph information thanks to the id', async () => {
    const mikadoGraphId = uuidv4();
    const prerequisiteId = uuidv4();
    const goal = 'Rework that part';
    const done = false;
    const label = 'Change that';
    const status = Status.TODO;
    const canBeCommitted = true;
    const mikadoGraphs = new InMemoryMikadoGraphs([aMikadoGraph({
      mikadoGraphId,
      goal,
      done,
      prerequisites: [{
        prerequisiteId, label, status, canBeCommitted,
      }],
    })]);

    const getMikadoGraphById = handleGetMikadoGraphById(mikadoGraphs);

    expect(await getMikadoGraphById(mikadoGraphId)).toEqual({
      mikadoGraphId,
      goal,
      done,
      prerequisites: [{
        prerequisiteId, label, status, parentId: mikadoGraphId, startedAt: undefined, canBeCommitted,
      }],
    });
  });
});
