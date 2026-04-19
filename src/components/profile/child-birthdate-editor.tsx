'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

import { DEVELOPMENT_SIGNAL_TAGS, INTEREST_TAGS } from '@/lib/child-tags';
import { GENDER_OPTIONS, type ChildGender } from '@/lib/child-profile-options';
import { CalendarDatePicker } from './calendar-date-picker';

type ChildBirthDateEditorProps = {
  initialBirthDate: string;
  initialGender: ChildGender | '';
  initialInterestTags: string[];
  initialDevelopmentSignalTags: string[];
  nickname: string;
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

export function ChildBirthDateEditor({
  initialBirthDate,
  initialGender,
  initialInterestTags,
  initialDevelopmentSignalTags,
  nickname,
}: ChildBirthDateEditorProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [birthDate, setBirthDate] = useState(initialBirthDate);
  const [gender, setGender] = useState<ChildGender | ''>(initialGender);
  const [interestTags, setInterestTags] = useState(initialInterestTags ?? []);
  const [developmentSignalTags, setDevelopmentSignalTags] = useState(initialDevelopmentSignalTags ?? []);
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  function resetForm() {
    setBirthDate(initialBirthDate);
    setGender(initialGender);
    setInterestTags(initialInterestTags ?? []);
    setDevelopmentSignalTags(initialDevelopmentSignalTags ?? []);
    setStatus('');
  }

  function handleClose() {
    setIsOpen(false);
    resetForm();
  }

  async function handleSave() {
    setIsSaving(true);
    setStatus('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthDate,
          gender,
          interestTags,
          developmentSignalTags,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? '保存失败，请稍后再试。');
      }

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '保存失败，请稍后再试。');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <button
        type='button'
        className='inline-flex items-center rounded-full border border-[color:var(--line)] bg-[rgba(255,251,245,0.82)] px-2.5 py-1 text-xs font-medium text-[color:var(--text-soft)] transition hover:border-[color:var(--line-strong)] hover:bg-white hover:text-[color:var(--text)]'
        onClick={() => setIsOpen(true)}
      >
        编辑资料
      </button>

      {mounted && isOpen
        ? createPortal(
            <div className='fixed inset-0 z-40 grid overflow-y-auto bg-[rgba(48,37,26,0.32)] p-4 sm:place-items-center'>
              <section
                role='dialog'
                aria-modal='true'
                aria-label='编辑孩子资料'
                className='surface-panel my-4 grid max-h-[calc(100dvh-2rem)] w-full max-w-2xl gap-5 self-start overflow-y-auto p-6 sm:my-0 sm:self-auto sm:p-7'
              >
                <div className='flex items-start justify-between gap-4'>
                  <div className='grid gap-2'>
                    <p className='page-kicker'>编辑孩子资料</p>
                    <h2 className='section-title text-[clamp(1.6rem,3vw,2rem)]'>调整 {nickname} 的画像资料</h2>
                    <p className='section-copy text-sm'>保存后会同步更新阶段画像和每日推荐。</p>
                  </div>
                  <button type='button' className='secondary-button px-3 py-1 text-sm' onClick={handleClose}>
                    关闭
                  </button>
                </div>

                <div className='grid gap-4'>
                  <div className='grid gap-2'>
                    <span className='text-sm font-medium text-[color:var(--text-soft)]'>性别</span>
                    <div className='flex flex-wrap gap-2'>
                      {GENDER_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type='button'
                          className={chipClassName(gender === option.value)}
                          onClick={() => setGender(option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className='grid gap-2'>
                    <span className='text-sm font-medium text-[color:var(--text-soft)]'>出生日期</span>
                    <CalendarDatePicker value={birthDate} onChange={setBirthDate} />
                  </div>

                  <div className='grid gap-3'>
                    <div className='grid gap-1'>
                      <p className='text-sm font-medium text-[color:var(--text)]'>兴趣偏好</p>
                      <p className='text-sm text-[color:var(--text-faint)]'>这些会影响任务主题和 AI 辅助表达。</p>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {INTEREST_TAGS.map((tag) => (
                        <button key={tag} type='button' className={chipClassName(interestTags.includes(tag))} onClick={() => setInterestTags((current) => toggleTag(current, tag))}>
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
                        <button key={tag} type='button' className={chipClassName(developmentSignalTags.includes(tag))} onClick={() => setDevelopmentSignalTags((current) => toggleTag(current, tag))}>
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className='flex flex-wrap items-center gap-4'>
                  <button type='button' className='primary-button disabled:cursor-not-allowed disabled:opacity-60' onClick={() => void handleSave()} disabled={isSaving}>
                    {isSaving ? '保存中...' : '保存资料'}
                  </button>
                  <button type='button' className='soft-link text-sm font-medium' onClick={handleClose}>
                    取消
                  </button>
                  {status ? <p className='text-sm text-red-700'>{status}</p> : null}
                </div>
              </section>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
