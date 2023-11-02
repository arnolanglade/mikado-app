import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
  addPrerequisite,
  getMikadoGraphById,
} from '@/api/mikado-graph/mikado-graph.usecase';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const userInput = await request.json();
  const prerequisiteId = uuidv4();
  await addPrerequisite({ ...userInput, prerequisiteId });
  return NextResponse.json(await getMikadoGraphById(userInput.mikadoGraphId));
}
