'use client';

import { MikadoGraphView } from '@/api/mikado-graph/mikako-graph';
import useMikadoGraph from '@/mikado-graph/use-case/mikado-graph';
import React from 'react';
import MikadoGraph from '@/mikado-graph/component/mikado-graph';

export default function Page({ refactoring }: {
  refactoring: MikadoGraphView
}) {
  const {
    addPrerequisiteToMikadoGraph, addPrerequisiteToPrerequisite, startExperimentation, commitChanges,
  } = useMikadoGraph();

  return (
    <MikadoGraph
      refactoring={refactoring}
      onAddPrerequisiteToRefactoring={addPrerequisiteToMikadoGraph}
      onStartExperimentation={startExperimentation}
      onAddPrerequisiteToPrerequisite={addPrerequisiteToPrerequisite}
      onCommitChanges={commitChanges}
    />
  );
}
