import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getMikadoGraphById, startTask } from '@/api/mikado-graph/mikado-graph.usecase';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const userInput = await request.json();
  const mikadoGraphId = uuidv4();
  await startTask({ ...userInput, mikadoGraphId });
  return NextResponse.json(await getMikadoGraphById(mikadoGraphId));
}
