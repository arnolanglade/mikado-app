import { NextRequest, NextResponse } from 'next/server';
import {
  addPrerequisiteToPrerequisite,
} from '@/api/refactoring/refactoring';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const userInput = await request.json();
  const prerequisiteId = uuidv4();
  await addPrerequisiteToPrerequisite({ ...userInput, prerequisiteId });
  return NextResponse.json({ prerequisiteId });
}
