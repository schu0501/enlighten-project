import { describe, expect, it } from 'vitest';

import { buildAiPrompt, generateAiText } from './ai-prompts';

describe('ai prompts', () => {
  it('builds a constrained Chinese story prompt around one task', () => {
    const prompt = buildAiPrompt('story', {
      childNickname: '小米',
      taskTitle: '一句一句接故事',
      taskDescription: '家长说一句，孩子接一句。',
      taskTopic: '故事启蒙',
    });

    expect(prompt).toContain('小米');
    expect(prompt).toContain('一句一句接故事');
    expect(prompt).toContain('只输出最终文案');
    expect(prompt).toContain('不要聊天');
  });

  it.each([
    ['story', '小米，我们来听一个小小的故事', '一句一句接故事'],
    ['script', '你可以先这样轻轻开口', '我们先只做一个很小的动作'],
    ['variant', '如果想放到睡前来做', '最后用一句安静的话收住'],
  ] as const)(
    'generates a structured Chinese %s response',
    (kind, expectedLead, expectedTail) => {
      const text = generateAiText(kind, {
        childNickname: '小米',
        taskTitle: '一句一句接故事',
        taskDescription: '家长说一句，孩子接一句。',
        taskTopic: '故事启蒙',
      });

      expect(text).toContain(expectedLead);
      expect(text).toContain(expectedTail);
      expect(text).not.toMatch(/[A-Za-z]{4,}/);
    },
  );
});

