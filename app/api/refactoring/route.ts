import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { InMemoryRefactorings, startRefactoring } from '@/api/refactoring/refactoring';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const userInput = await request.json();
  const refactoringId = uuidv4();
  startRefactoring(new InMemoryRefactorings())({ ...userInput, refactoringId });
  return NextResponse.json({ refactoringId });
}
