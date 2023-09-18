import React from 'react';
import { getRefactoringById } from '@/api/refactoring/refactoring';
import Page from '@/refactoring/component/refactoring-page';
import styles from './page.module.css';

export default async function RefactoringPage({ params: { id } }: { params: { id: string } }) {
  const refactoring = (await getRefactoringById(id));

  return (
    <div className={styles.dashboard}>
      <Page refactoring={refactoring} />
    </div>
  );
}
