'use client';

import { useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { DEVELOPMENT_SIGNAL_TAGS, INTEREST_TAGS } from '@/lib/child-tags';
import { GENDER_OPTIONS, type ChildGender } from '@/lib/child-profile-options';
import { validateChildProfileInput, validateRegisterInput } from '@/lib/register-validation';
import { CalendarDatePicker } from './calendar-date-picker';

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

type ChildProfileFormProps = {
  signedIn?: boolean;
};

export function ChildProfileForm({ signedIn = false }: ChildProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<ChildGender | ''>('');
  const [interestTags, setInterestTags] = useState<string[]>([]);
  const [developmentSignalTags, setDevelopmentSignalTags] = useState<string[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const nickname = String(formData.get('nickname') ?? '').trim();

    const validated = signedIn
      ? validateChildProfileInput({
          nickname,
          gender,
          birthDate,
          interestTags,
          developmentSignalTags,
        })
      : validateRegisterInput({
          email,
          password,
          nickname,
          gender,
          birthDate,
          interestTags,
          developmentSignalTags,
        });

    if (!validated.success) {
      setError(validated.message);
      setIsSubmitting(false);
      return;
    }

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...validated.data,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(payload?.message ?? '注册失败，请重试。');
      setIsSubmitting(false);
      return;
    }

    if (signedIn) {
      router.replace('/profile');
      router.refresh();
      return;
    }

    const signInResult = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (signInResult?.error) {
      setError('档案已创建，但登录失败，请使用邮箱和密码重新登录。');
      setIsSubmitting(false);
      return;
    }

    router.replace('/today');
    router.refresh();
  }

  return (
    <form className='surface-panel grid gap-5 p-7 sm:p-8' onSubmit={handleSubmit}>
      {signedIn ? null : (
        <>
          <label className='grid gap-2'>
            <span className='text-sm font-medium text-[color:var(--text-soft)]'>邮箱</span>
            <input
              className='field-input'
              name='email'
              type='email'
              autoComplete='email'
              required
            />
          </label>
          <label className='grid gap-2'>
            <span className='text-sm font-medium text-[color:var(--text-soft)]'>密码</span>
            <input
              className='field-input'
              name='password'
              type='password'
              autoComplete='new-password'
              required
            />
          </label>
        </>
      )}
      <label className='grid gap-2'>
        <span className='text-sm font-medium text-[color:var(--text-soft)]'>孩子昵称</span>
        <input
          className='field-input'
          name='nickname'
          type='text'
          required
        />
      </label>
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
      <section className='grid gap-5 rounded-[1.8rem] border border-[color:var(--line)] bg-[rgba(255,250,242,0.72)] p-5'>
        <div className='grid gap-2'>
          <p className='page-kicker'>个性化设置</p>
          <h2 className='section-title text-[clamp(1.45rem,2.2vw,1.8rem)]'>让推荐先更懂一点你的孩子</h2>
          <p className='section-copy text-sm'>这部分可以先轻轻选几项，不选也能继续，之后在档案里还可以修改。</p>
        </div>

        <div className='grid gap-4'>
          <div className='grid gap-3'>
            <div className='grid gap-1'>
              <p className='text-sm font-medium text-[color:var(--text)]'>兴趣偏好</p>
              <p className='text-sm text-[color:var(--text-faint)]'>建议选 1-3 个，帮助系统更快聚焦喜欢的主题。</p>
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
              <p className='text-sm text-[color:var(--text-faint)]'>这些标签会帮助推荐更贴近当前节奏和表达方式。</p>
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
      </section>
      {error ? <p className='text-sm text-red-700'>{error}</p> : null}
      <button
        className='primary-button disabled:cursor-not-allowed disabled:opacity-60'
        type='submit'
        disabled={isSubmitting}
      >
        {signedIn ? '保存孩子档案' : '创建档案并开始'}
      </button>
    </form>
  );
}
