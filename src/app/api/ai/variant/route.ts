import { NextResponse } from 'next/server';
import { z } from 'zod';

import { buildAiPrompt, generateAiText } from '../../../../lib/ai-prompts';

const variantSchema = z.object({
  childNickname: z.string().trim().min(1),
  taskTitle: z.string().trim().min(1),
  taskDescription: z.string().trim().min(1),
  taskTopic: z.string().trim().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = variantSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: '请先提供孩子昵称和任务信息。' }, { status: 400 });
  }

  const prompt = buildAiPrompt('variant', parsed.data);
  const text = generateAiText('variant', parsed.data);

  return NextResponse.json({ kind: 'variant', mode: 'deterministic', prompt, text });
}
