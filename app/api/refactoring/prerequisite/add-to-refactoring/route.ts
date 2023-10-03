import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { addPrerequisiteToMikadoGraph, getMikadoGraphById } from '@/api/refactoring/mikako-graph';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const userInput = await request.json();
  const prerequisiteId = uuidv4();
  await addPrerequisiteToMikadoGraph({ ...userInput, prerequisiteId });
  return NextResponse.json(await getMikadoGraphById(userInput.refactoringId));
}
