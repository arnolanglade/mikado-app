'use client';

import { MikadoGraphView } from '@/api/refactoring/mikako-graph';
import useRefactoring from '@/refactoring/use-case/refactoring';
import React from 'react';
import RefactoringDashboard from '@/refactoring/component/refactoring-dashboard';

export default function Page({ refactoring }: {
  refactoring: MikadoGraphView
}) {
  const {
    addPrerequisiteToRefactoring, addPrerequisiteToPrerequisite, startExperimentation, commitChanges,
  } = useRefactoring();

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
