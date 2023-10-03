'use client';

import { MikadoGraphView } from '@/api/mikado-graph/mikako-graph';
import useMikadoGraph from '@/mikado-graph/use-case/mikado-graph';
import React from 'react';
import RefactoringDashboard from '@/mikado-graph/component/refactoring-dashboard';

export default function Page({ refactoring }: {
  refactoring: MikadoGraphView
}) {
  const {
    addPrerequisiteToMikadoGraph, addPrerequisiteToPrerequisite, startExperimentation, commitChanges,
  } = useMikadoGraph();

  return (
    <RefactoringDashboard
      refactoring={refactoring}
      onAddPrerequisiteToRefactoring={addPrerequisiteToMikadoGraph}
      onStartExperimentation={startExperimentation}
      onAddPrerequisiteToPrerequisite={addPrerequisiteToPrerequisite}
      onCommitChanges={commitChanges}
    />
  );
}
