import React from 'react';
import Page from '@/mikado-graph/component/mikado-graph-page';
import mikadoGraphApi from '@/mikado-graph/mikado-graph';
import styles from './page.module.css';

export default async function RefactoringPage({ params: { id } }: { params: { id: string } }) {
  const mikadoGraphView = (await mikadoGraphApi.getById(id));

  return (
    <div className={styles.dashboard}>
      <Page mikadoGraphView={mikadoGraphView} />
    </div>
  );
}
