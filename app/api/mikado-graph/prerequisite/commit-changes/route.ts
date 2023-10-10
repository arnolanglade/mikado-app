import { NextRequest, NextResponse } from 'next/server';
import { commitChanges, getMikadoGraphById } from '@/api/mikado-graph/mikadao-graph.usecase';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const userInput = await request.json();
  await commitChanges(userInput);
  return NextResponse.json(await getMikadoGraphById(userInput.mikadoGraphId));
}
