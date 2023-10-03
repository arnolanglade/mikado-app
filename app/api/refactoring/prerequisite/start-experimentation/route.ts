import { NextRequest, NextResponse } from 'next/server';
import { getMikadoGraphById, startExperimentation } from '@/api/refactoring/mikako-graph';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const userInput = await request.json();
  await startExperimentation(userInput);
  return NextResponse.json(await getMikadoGraphById(userInput.refactoringId));
}
