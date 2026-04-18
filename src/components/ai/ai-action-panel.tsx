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
    label: 'Make it a story',
    endpoint: '/api/ai/story',
    description: 'Rewrites the current task as a short story.',
  },
  {
    kind: 'script',
    label: 'Give me an opening line',
    endpoint: '/api/ai/script',
    description: 'Generates a direct opening line a parent can say.',
  },
  {
    kind: 'variant',
    label: 'Make it bedtime style',
    endpoint: '/api/ai/variant',
    description: 'Turns the task into a softer bedtime-style version.',
  },
];

export function AIActionPanel({ childNickname, task }: AiActionPanelProps) {
  const [status, setStatus] = useState('Pick one bounded AI action to rewrite the task.');
  const [result, setResult] = useState('');
  const [loadingKind, setLoadingKind] = useState<AiActionKind | null>(null);

  async function runAction(action: AiActionConfig) {
    setLoadingKind(action.kind);
    setStatus(`Generating ${action.label.toLowerCase()}...`);
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
      setStatus('That did not generate. Try the same button again.');
    } finally {
      setLoadingKind(null);
    }
  }

  return (
    <section className='grid gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm'>
      <div className='grid gap-2'>
        <p className='text-sm font-semibold uppercase tracking-[0.28em] text-amber-700'>AI action panel</p>
        <h2 className='text-2xl font-semibold tracking-tight text-stone-900'>Three bounded rewrites for one task</h2>
        <p className='text-sm leading-7 text-stone-600'>
          There is no free-form chat box here. The task can only be rewritten as a story, an opening line, or a bedtime style.
        </p>
      </div>
      <div className='flex flex-wrap gap-3'>
        {ACTIONS.map((action) => (
          <button
            key={action.kind}
            className='rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-900 hover:text-stone-900 disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400'
            disabled={loadingKind !== null}
            onClick={() => {
              void runAction(action);
            }}
            type='button'
          >
            {loadingKind === action.kind ? 'Generating...' : action.label}
          </button>
        ))}
      </div>
      <div aria-live='polite' className='grid gap-2 rounded-2xl bg-stone-50 p-4' role='status'>
        <p className='text-sm font-medium text-stone-500'>{status}</p>
        {result ? <p className='text-base leading-7 text-stone-800'>{result}</p> : null}
      </div>
    </section>
  );
}
