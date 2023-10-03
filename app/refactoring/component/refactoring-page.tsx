'use client';

import { MikadoGraphView } from '@/api/mikado-graph/mikako-graph';
import useMikadoGraph from '@/refactoring/use-case/mikado-graph';
import React from 'react';
import RefactoringDashboard from '@/refactoring/component/refactoring-dashboard';

export default function Page({ refactoring }: {
  refactoring: MikadoGraphView
}) {
  const {
    addPrerequisiteToRefactoring, addPrerequisiteToPrerequisite, startExperimentation, commitChanges,
  } = useMikadoGraph();

  return (
    <RefactoringDashboard
      refactoring={refactoring}
      onAddPrerequisiteToRefactoring={addPrerequisiteToRefactoring}
      onStartExperimentation={startExperimentation}
      onAddPrerequisiteToPrerequisite={addPrerequisiteToPrerequisite}
      onCommitChanges={commitChanges}
    />
  );
}
