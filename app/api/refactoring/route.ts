import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { startRefactoring } from '@/api/refactoring/refactoring';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const userInput = await request.json();
  const refactoringId = uuidv4();
  await startRefactoring({ ...userInput, refactoringId });
  return NextResponse.json({ refactoringId });
}
