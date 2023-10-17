import React from 'react';
import Page from '@/mikado-graph/component/mikado-graph-page';
import { getMikadoGraphById } from '@/api/mikado-graph/mikado-graph.usecase';
import styles from './page.module.css';

export default async function MikadoGraphPage({ params: { id } }: { params: { id: string } }) {
  const mikadoGraphView = (await getMikadoGraphById(id));

  return (
    <div className={styles.dashboard}>
      <Page mikadoGraphView={mikadoGraphView} />
    </div>
  );
}
