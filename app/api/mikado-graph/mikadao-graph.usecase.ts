import {
  Clock, MikadoGraph, MikadoGraphs, MikadoGraphView,
} from '@/api/mikado-graph/mikado-graph';
import { InMemoryMikadoGraphs, SystemClock } from '@/api/mikado-graph/mikado-graph.infra';

export type StartTask = {
  mikadoGraphId: string
  goal: string
};

export const handleStartTask = (mikadoGraphs: MikadoGraphs) => async (input: StartTask) => {
  await mikadoGraphs.add(MikadoGraph.start(input.mikadoGraphId, input.goal));
};

// Todo: Export for the testing purpose
export const inMemoryMikadoGraphs = new InMemoryMikadoGraphs();
export const startTask = handleStartTask(inMemoryMikadoGraphs);
export type AddPrerequisiteToMikadoGraph = {
  prerequisiteId: string
  mikadoGraphId: string
  label: string
};

export const handleAddPrerequisiteToMikadoGraph = (mikadoGraphs: MikadoGraphs) => async (input: AddPrerequisiteToMikadoGraph) => {
  const mikakoGraph = await mikadoGraphs.get(input.mikadoGraphId);
  mikakoGraph.addPrerequisiteToMikadoGraph(input.prerequisiteId, input.label);
  await mikadoGraphs.add(mikakoGraph);
};

export const addPrerequisiteToMikadoGraph = handleAddPrerequisiteToMikadoGraph(inMemoryMikadoGraphs);

export type AddPrerequisiteToPrerequisite = {
  mikadoGraphId: string
  prerequisiteId: string
  parentId: string
  label: string
};

export const handleAddPrerequisiteToPrerequisite = (mikadoGraphs: MikadoGraphs) => async (input: AddPrerequisiteToPrerequisite) => {
  const mikakoGraph = await mikadoGraphs.get(input.mikadoGraphId);
  mikakoGraph.addPrerequisiteToPrerequisite(input.prerequisiteId, input.parentId, input.label);
  await mikadoGraphs.add(mikakoGraph);
};

export const addPrerequisiteToPrerequisite = handleAddPrerequisiteToPrerequisite(inMemoryMikadoGraphs);

export type CommitChanges = {
  mikadoGraphId: string
  prerequisiteId: string
};

export const handleCommitChanges = (mikadoGraphs: MikadoGraphs) => async (input: CommitChanges) => {
  const mikakoGraph = await mikadoGraphs.get(input.mikadoGraphId);
  mikakoGraph.commitChanges(input.prerequisiteId);
  await mikadoGraphs.add(mikakoGraph);
};

export const commitChanges = handleCommitChanges(inMemoryMikadoGraphs);

export const handleGetMikadoGraphById = (mikadoGraphs: MikadoGraphs) => async (mikadoGraphId: string): Promise<MikadoGraphView> => {
  const mikakoGraph = await mikadoGraphs.get(mikadoGraphId);
  return mikakoGraph.toView();
};

export const getMikadoGraphById = handleGetMikadoGraphById(inMemoryMikadoGraphs);

export type StartExperimentation = {
  prerequisiteId: string
  mikadoGraphId: string
};

export const handleStartExperimentation = (mikadoGraphs: MikadoGraphs, clock: Clock) => async (input: StartExperimentation): Promise<void> => {
  const mikakoGraph = await mikadoGraphs.get(input.mikadoGraphId);
  mikakoGraph.startExperimentation(input.prerequisiteId, clock.now());
  await mikadoGraphs.add(mikakoGraph);
};

export const startExperimentation = handleStartExperimentation(inMemoryMikadoGraphs, new SystemClock());
