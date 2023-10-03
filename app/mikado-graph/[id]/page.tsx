import React from 'react';
import Page from '@/mikado-graph/component/refactoring-page';
import mikadoGraphApi from '@/mikado-graph/mikado-graph';
import styles from './page.module.css';

export default async function RefactoringPage({ params: { id } }: { params: { id: string } }) {
  const refactoring = (await mikadoGraphApi.getById(id));

  return (
    <div className={styles.dashboard}>
      <Page refactoring={refactoring} />
    </div>
  );
}
