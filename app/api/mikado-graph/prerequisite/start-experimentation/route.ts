import { NextRequest, NextResponse } from 'next/server';
import { getMikadoGraphById, startExperimentation } from '@/api/mikado-graph/mikadao-graph.usecase';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const userInput = await request.json();
  await startExperimentation(userInput);
  return NextResponse.json(await getMikadoGraphById(userInput.mikadoGraphId));
}
