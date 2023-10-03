import { NextRequest, NextResponse } from 'next/server';
import { commitChanges, getMikadoGraphById } from '@/api/mikado-graph/mikako-graph';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const userInput = await request.json();
  await commitChanges(userInput);
  return NextResponse.json(await getMikadoGraphById(userInput.refactoringId));
}
