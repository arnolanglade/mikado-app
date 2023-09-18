'use client';

import { RefactoringGraph } from '@/api/refactoring/refactoring';
import useRefactoring from '@/refactoring/use-case/refactoring';
import React from 'react';
import RefactoringDashboard from '@/refactoring/component/refactoring-dashboard';

export default function Page({ refactoring }: {
  refactoring: RefactoringGraph
}) {
  const { addPrerequisite, startExperimentation } = useRefactoring();

  return (
    <RefactoringDashboard
      refactoring={refactoring}
      onAddPrerequisite={addPrerequisite}
      onStartExperimentation={startExperimentation}
    />
  );
}
