import React from 'react';
import Page from '@/refactoring/component/refactoring-page';
import refactoringApi from '@/refactoring/mikado-graph';
import styles from './page.module.css';

export default async function RefactoringPage({ params: { id } }: { params: { id: string } }) {
  const refactoring = (await refactoringApi.getById(id));

  return (
    <div className={styles.dashboard}>
      <Page refactoring={refactoring} />
    </div>
  );
}
