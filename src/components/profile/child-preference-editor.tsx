'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { DEVELOPMENT_SIGNAL_TAGS, INTEREST_TAGS } from '@/lib/child-tags';

type ChildPreferenceEditorProps = {
  initialInterestTags: string[];
  initialDevelopmentSignalTags: string[];
  mode?: 'section' | 'card';
};

function toggleTag(values: string[], tag: string) {
  return values.includes(tag) ? values.filter((value) => value !== tag) : [...values, tag];
}

function chipClassName(selected: boolean) {
  return `rounded-full border px-3 py-2 text-sm font-medium transition ${
    selected
      ? 'border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--text)]'
      : 'border-[color:var(--line)] bg-[rgba(255,251,245,0.88)] text-[color:var(--text-soft)] hover:border-[color:var(--line-strong)] hover:bg-white'
  }`;
}

export function ChildPreferenceEditor({
  initialInterestTags,
  initialDevelopmentSignalTags,
  mode = 'section',
}: ChildPreferenceEditorProps) {
  const router = useRouter();
  const [interestTags, setInterestTags] = useState(initialInterestTags ?? []);
  const [developmentSignalTags, setDevelopmentSignalTags] = useState(initialDevelopmentSignalTags ?? []);
  const [status, setStatus] = useState('后续可以随时调整这些标签，让每日推荐更贴近孩子。');
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const selectedTags = [...interestTags, ...developmentSignalTags];

  async function handleSave() {
    setIsSaving(true);
    setStatus('正在保存偏好设置...');

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interestTags,
          developmentSignalTags,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? '保存失败');
      }

      setStatus('已经更新完成，后续推荐会逐步按这些偏好来调整。');
      if (mode === 'card') {
        setIsOpen(false);
      }
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '保存失败，请稍后再试。');
    } finally {
      setIsSaving(false);
    }
  }

  function renderEditorBody() {
    return (
      <>
        <div className='grid gap-5'>
          <div className='grid gap-3'>
            <div className='grid gap-1'>
              <p className='text-sm font-medium text-[color:var(--text)]'>兴趣偏好</p>
              <p className='text-sm text-[color:var(--text-faint)]'>这些会影响任务主题和 AI 辅助表达。</p>
            </div>
            <div className='flex flex-wrap gap-2'>
              {INTEREST_TAGS.map((tag) => (
                <button
                  key={tag}
                  type='button'
                  className={chipClassName(interestTags.includes(tag))}
                  onClick={() => setInterestTags((current) => toggleTag(current, tag))}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className='grid gap-3'>
            <div className='grid gap-1'>
              <p className='text-sm font-medium text-[color:var(--text)]'>发展特点</p>
              <p className='text-sm text-[color:var(--text-faint)]'>这些会帮助系统把任务难度和表达方式调得更合适。</p>
            </div>
            <div className='flex flex-wrap gap-2'>
              {DEVELOPMENT_SIGNAL_TAGS.map((tag) => (
                <button
                  key={tag}
                  type='button'
                  className={chipClassName(developmentSignalTags.includes(tag))}
                  onClick={() => setDevelopmentSignalTags((current) => toggleTag(current, tag))}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-4'>
          <button type='button' className='primary-button disabled:cursor-not-allowed disabled:opacity-60' onClick={() => void handleSave()} disabled={isSaving}>
            {isSaving ? '保存中...' : '保存偏好设置'}
          </button>
          {mode === 'card' ? (
            <button type='button' className='soft-link text-sm font-medium' onClick={() => setIsOpen(false)}>
              取消
            </button>
          ) : null}
          <p className='text-sm leading-7 text-[color:var(--text-faint)]'>{status}</p>
        </div>
      </>
    );
  }

  if (mode === 'card') {
    return (
      <>
        <div className='grid gap-3 rounded-[1.35rem] border border-[rgba(126,99,73,0.14)] bg-[rgba(255,251,245,0.9)] px-4 py-3 shadow-[0_18px_40px_-30px_rgba(84,63,43,0.38)] backdrop-blur-sm'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='grid gap-1'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-faint)]'>个性化标签</p>
              <p className='text-sm text-[color:var(--text-soft)]'>这些标签也会参与今天的推荐画像。</p>
            </div>
            <button
              type='button'
              className='inline-flex items-center rounded-full border border-[color:var(--line)] bg-[rgba(255,251,245,0.82)] px-2.5 py-1 text-xs font-medium text-[color:var(--text-soft)] transition hover:border-[color:var(--line-strong)] hover:bg-white hover:text-[color:var(--text)]'
              onClick={() => setIsOpen(true)}
            >
              编辑标签
            </button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {selectedTags.map((tag) => (
              <span key={tag} className='rounded-full border border-[rgba(126,99,73,0.14)] bg-[rgba(255,248,240,0.96)] px-2.5 py-1 text-xs font-medium text-[color:var(--text-soft)]'>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {isOpen ? (
          <div className='fixed inset-0 z-40 grid place-items-center bg-[rgba(48,37,26,0.32)] p-4'>
            <section role='dialog' aria-modal='true' aria-label='编辑个性化标签' className='surface-panel grid w-full max-w-2xl gap-5 p-6 sm:p-7'>
              <div className='flex items-start justify-between gap-4'>
                <div className='grid gap-2'>
                  <p className='page-kicker'>编辑个性化标签</p>
                  <h2 className='section-title text-[clamp(1.6rem,3vw,2rem)]'>让画像更贴近孩子的当下状态</h2>
                  <p className='section-copy text-sm'>每类选 1-3 个就够了，保存后会同步影响每日推荐。</p>
                </div>
                <button type='button' className='secondary-button px-3 py-1 text-sm' onClick={() => setIsOpen(false)}>
                  关闭
                </button>
              </div>
              {renderEditorBody()}
            </section>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <section className='surface-soft grid gap-5 p-6 sm:p-7'>
      <div className='grid gap-2'>
        <p className='page-kicker'>个性化标签</p>
        <h2 className='section-title text-[clamp(1.6rem,3vw,2rem)]'>让推荐更贴近孩子的当下状态</h2>
        <p className='section-copy text-sm'>每类选 1-3 个就够了，后续随时都可以回来修改。</p>
      </div>
      {renderEditorBody()}
    </section>
  );
}
