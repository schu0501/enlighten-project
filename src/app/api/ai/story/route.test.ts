import { describe, expect, it } from 'vitest';

import { POST } from './route';

describe('POST /api/ai/story', () => {
  it('returns a bounded story suggestion', async () => {
    const response = await POST(
      new Request('http://localhost/api/ai/story', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          childNickname: 'Mia',
          taskTitle: 'One line at a time story',
          taskDescription: 'Parent says one line, child adds one line.',
          taskTopic: 'Story',
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      kind: 'story',
      text: expect.stringContaining('Mia'),
    });
  });
});

