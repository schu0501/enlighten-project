import { describe, expect, it } from 'vitest';

import { POST } from './route';

describe('POST /api/ai/story', () => {
  it('returns a bounded Chinese story suggestion', async () => {
    const response = await POST(
      new Request('http://localhost/api/ai/story', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          childNickname: '小米',
          taskTitle: '一句一句接故事',
          taskDescription: '家长说一句，孩子接一句。',
          taskTopic: '故事启蒙',
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      kind: 'story',
      text: expect.stringContaining('小米，我们来听一个小小的故事'),
    });
  });
});

