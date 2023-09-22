import { NextRequest, NextResponse } from 'next/server';
import { getRefactoringById, startExperimentation } from '@/api/refactoring/refactoring';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const userInput = await request.json();
  await startExperimentation(userInput);
  return NextResponse.json(await getRefactoringById(userInput.refactoringId));
}
