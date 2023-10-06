'use client';

import { MikadoGraphView } from '@/api/mikado-graph/mikako-graph';
import useMikadoGraph from '@/mikado-graph/mikado-graph.usecase';
import React from 'react';
import MikadoGraph from '@/mikado-graph/component/mikado-graph';

export default function Page({ mikadoGraphView }: {
  mikadoGraphView: MikadoGraphView
}) {
  const {
    getMikadoGraph,
  } = useMikadoGraph(mikadoGraphView);

  return (
    <MikadoGraph mikadoGraph={getMikadoGraph()} />
  );
}
