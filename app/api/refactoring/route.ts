import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getMikadoGraphById, startTask } from '@/api/refactoring/mikako-graph';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const userInput = await request.json();
  const refactoringId = uuidv4();
  await startTask({ ...userInput, refactoringId });
  return NextResponse.json(await getMikadoGraphById(refactoringId));
}
