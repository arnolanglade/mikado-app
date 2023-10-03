import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getRefactoringById, startRefactoring } from '@/api/refactoring/mikako-graph';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const userInput = await request.json();
  const refactoringId = uuidv4();
  await startRefactoring({ ...userInput, refactoringId });
  return NextResponse.json(await getRefactoringById(refactoringId));
}
