import { describe, expect, it } from 'vitest';

import { buildAiPrompt, generateAiText } from './ai-prompts';

describe('ai prompts', () => {
  it('builds a constrained story prompt around one task', () => {
    const prompt = buildAiPrompt('story', {
      childNickname: 'Mia',
      taskTitle: 'One line at a time story',
      taskDescription: 'Parent says one line, child adds one line.',
      taskTopic: 'Story',
    });

    expect(prompt).toContain('Mia');
    expect(prompt).toContain('One line at a time story');
    expect(prompt).toContain('Only output');
    expect(prompt).toContain('No chat');
  });

  it('generates a deterministic bedtime variant when no model is configured', () => {
    const text = generateAiText('variant', {
      childNickname: 'Mia',
      taskTitle: 'One line at a time story',
      taskDescription: 'Parent says one line, child adds one line.',
      taskTopic: 'Story',
    });

    expect(text).toContain('Bedtime version');
    expect(text).toContain('Mia');
    expect(text).toContain('One line at a time story');
  });
});

