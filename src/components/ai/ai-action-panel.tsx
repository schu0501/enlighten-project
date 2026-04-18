'use client';

import React, { useState } from 'react';

import type { AiActionKind } from '../../lib/ai-prompts';

type AiActionPanelProps = {
  childNickname: string;
  task: {
    title: string;
    description: string;
    topic: string;
  };
};

type AiActionResponse = {
  text?: string;
  message?: string;
};

type AiActionConfig = {
  kind: AiActionKind;
  label: string;
  endpoint: string;
  description: string;
};

const ACTIONS: AiActionConfig[] = [
  {
    kind: 'story',
    label: '改写成短故事',
    endpoint: '/api/ai/story',
    description: '把当前任务改写成一段更容易讲给孩子听的短故事。',
  },
  {
    kind: 'script',
    label: '生成开场话术',
    endpoint: '/api/ai/script',
    description: '生成一句家长现在就能说出口的开场话术。',
  },
  {
    kind: 'variant',
    label: '换成睡前安静版',
    endpoint: '/api/ai/variant',
    description: '把任务调成更轻、更安静的睡前陪伴版本。',
  },
];

export function AIActionPanel({ childNickname, task }: AiActionPanelProps) {
  const [status, setStatus] = useState('选一个轻量动作，让今天的任务更贴近当下场景。');
  const [result, setResult] = useState('');
  const [loadingKind, setLoadingKind] = useState<AiActionKind | null>(null);

  async function runAction(action: AiActionConfig) {
    setLoadingKind(action.kind);
    setStatus(`正在生成：${action.label}`);
    setResult('');

    try {
      const response = await fetch(action.endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          childNickname,
          taskTitle: task.title,
          taskDescription: task.description,
          taskTopic: task.topic,
        }),
      });
      const payload = (await response.json()) as AiActionResponse;

      if (!response.ok) {
        throw new Error(payload.message ?? 'Generation failed');
      }

      setResult(payload.text ?? '');
      setStatus(action.description);
    } catch {
      setStatus('这次没有生成成功，可以再试一次同一个按钮。');
    } finally {
      setLoadingKind(null);
    }
  }

  return (
    <section className='surface-panel grid gap-5 p-7 sm:p-8'>
      <div className='grid gap-2'>
        <p className='page-kicker'>AI 辅助</p>
        <h2 className='section-title'>给今天的任务加一点适合当下的表达</h2>
        <p className='section-copy text-sm'>
          这里不做自由聊天，只提供几个边界清楚的小改写，让家长更快拿到可直接使用的话术和版本。
        </p>
      </div>
      <div className='flex flex-wrap gap-3'>
        {ACTIONS.map((action) => (
          <button
            key={action.kind}
            className='secondary-button disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400'
            disabled={loadingKind !== null}
            onClick={() => {
              void runAction(action);
            }}
            type='button'
          >
            {loadingKind === action.kind ? '生成中...' : action.label}
          </button>
        ))}
      </div>
      <div aria-live='polite' className='surface-inset grid gap-3 p-5' role='status'>
        <p className='text-sm font-medium text-[color:var(--text-faint)]'>{status}</p>
        {result ? <p className='text-base leading-8 text-[color:var(--text)]'>{result}</p> : null}
      </div>
    </section>
  );
}
