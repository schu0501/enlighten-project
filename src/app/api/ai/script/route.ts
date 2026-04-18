import { NextResponse } from 'next/server';
import { z } from 'zod';

import { buildAiPrompt, generateAiText } from '../../../../lib/ai-prompts';

const scriptSchema = z.object({
  childNickname: z.string().trim().min(1),
  taskTitle: z.string().trim().min(1),
  taskDescription: z.string().trim().min(1),
  taskTopic: z.string().trim().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = scriptSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: '请先提供孩子昵称和任务信息。' }, { status: 400 });
  }

  const prompt = buildAiPrompt('script', parsed.data);
  const text = generateAiText('script', parsed.data);

  return NextResponse.json({ kind: 'script', mode: 'deterministic', prompt, text });
}
