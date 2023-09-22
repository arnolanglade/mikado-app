import { NextRequest, NextResponse } from 'next/server';
import { commitChanges, getRefactoringById } from '@/api/refactoring/refactoring';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const userInput = await request.json();
  await commitChanges(userInput);
  return NextResponse.json(await getRefactoringById(userInput.refactoringId));
}
