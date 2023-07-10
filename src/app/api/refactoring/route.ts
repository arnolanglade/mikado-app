import { NextRequest, NextResponse } from 'next/server';
import { InMemoryRefactorings, startRefactoring } from '@/mikado-method/refactoring';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const userInput = await request.json();
  startRefactoring(new InMemoryRefactorings())({ ...userInput, refactoringId: uuidv4() });
  return NextResponse.json({ status: 'success' });
}
