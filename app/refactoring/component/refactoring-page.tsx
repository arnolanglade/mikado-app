'use client';

import { RefactoringGraph } from '@/api/refactoring/refactoring';
import useRefactoring from '@/refactoring/use-case/refactoring';
import React from 'react';
import RefactoringDashboard from '@/refactoring/component/refactoring-dashboard';

export default function Page({ refactoring }: {
  refactoring: RefactoringGraph
}) {
  const { addPrerequisiteToRefactoring, addPrerequisiteToPrerequisite, startExperimentation } = useRefactoring();

  return (
    <RefactoringDashboard
      refactoring={refactoring}
      onAddPrerequisiteToRefactoring={addPrerequisiteToRefactoring}
      onStartExperimentation={startExperimentation}
      onAddPrerequisiteToPrerequisite={addPrerequisiteToPrerequisite}
    />
  );
}
