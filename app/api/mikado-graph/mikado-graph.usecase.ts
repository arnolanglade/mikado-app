import {
  Clock, MikadoGraph, MikadoGraphs, MikadoGraphView,
} from '@/api/mikado-graph/mikado-graph';
import { InMemoryMikadoGraphs, SystemClock } from '@/api/mikado-graph/mikado-graph.infra';

// Todo: Export for the testing purpose
export const inMemoryMikadoGraphs = new InMemoryMikadoGraphs();

export type StartTask = {
  mikadoGraphId: string
  goal: string
};

export const handleStartTask = (mikadoGraphs: MikadoGraphs) => async (input: StartTask) => {
  await mikadoGraphs.add(MikadoGraph.start(input.mikadoGraphId, input.goal));
};

export const startTask = handleStartTask(inMemoryMikadoGraphs);

export type AddPrerequisiteToMikadoGraph = {
  prerequisiteId: string
  mikadoGraphId: string
  label: string
};

export const handleAddPrerequisiteToMikadoGraph = (mikadoGraphs: MikadoGraphs) => async (input: AddPrerequisiteToMikadoGraph) => {
  const mikadoGraph = await mikadoGraphs.get(input.mikadoGraphId);
  mikadoGraph.addPrerequisiteToMikadoGraph(input.prerequisiteId, input.label);
  await mikadoGraphs.add(mikadoGraph);
};

export const addPrerequisiteToMikadoGraph = handleAddPrerequisiteToMikadoGraph(inMemoryMikadoGraphs);

export type AddPrerequisiteToPrerequisite = {
  mikadoGraphId: string
  prerequisiteId: string
  parentId: string
  label: string
};

export const handleAddPrerequisiteToPrerequisite = (mikadoGraphs: MikadoGraphs) => async (input: AddPrerequisiteToPrerequisite) => {
  const mikadoGraph = await mikadoGraphs.get(input.mikadoGraphId);
  mikadoGraph.addPrerequisiteToPrerequisite(input.prerequisiteId, input.parentId, input.label);
  await mikadoGraphs.add(mikadoGraph);
};

export const addPrerequisiteToPrerequisite = handleAddPrerequisiteToPrerequisite(inMemoryMikadoGraphs);

export type CommitChanges = {
  mikadoGraphId: string
  prerequisiteId: string
};

export const handleCommitChanges = (mikadoGraphs: MikadoGraphs) => async (input: CommitChanges) => {
  const mikadoGraph = await mikadoGraphs.get(input.mikadoGraphId);
  mikadoGraph.commitChanges(input.prerequisiteId);
  await mikadoGraphs.add(mikadoGraph);
};

export const commitChanges = handleCommitChanges(inMemoryMikadoGraphs);

export const handleGetMikadoGraphById = (mikadoGraphs: MikadoGraphs) => async (mikadoGraphId: string): Promise<MikadoGraphView> => {
  const mikadoGraph = await mikadoGraphs.get(mikadoGraphId);
  return mikadoGraph.toView();
};

export const getMikadoGraphById = handleGetMikadoGraphById(inMemoryMikadoGraphs);

export type StartExperimentation = {
  prerequisiteId: string
  mikadoGraphId: string
};

export const handleStartExperimentation = (mikadoGraphs: MikadoGraphs, clock: Clock) => async (input: StartExperimentation): Promise<void> => {
  const mikadoGraph = await mikadoGraphs.get(input.mikadoGraphId);
  mikadoGraph.startExperimentation(input.prerequisiteId, clock.now());
  await mikadoGraphs.add(mikadoGraph);
};

export const startExperimentation = handleStartExperimentation(inMemoryMikadoGraphs, new SystemClock());
