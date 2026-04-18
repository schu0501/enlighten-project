import Link from 'next/link';

import { AppShell } from '../../../components/layout/app-shell';
import { getPrimaryChildProfile } from '../../../server/profile';

export default async function ProfilePage() {
  const profile = await getPrimaryChildProfile();

  return (
    <AppShell>
      <section className='grid gap-3'>
        <p className='text-sm font-semibold uppercase tracking-[0.28em] text-amber-700'>Parent-guided enlightenment</p>
        <h1 className='text-4xl font-bold tracking-tight text-stone-900'>我的档案</h1>
        <p className='max-w-2xl text-lg leading-8 text-stone-700'>
          这里先保留当前默认孩子的查看页，方便父母快速确认年龄、阶段和账号信息。
        </p>
      </section>

      {profile ? (
        <section className='grid gap-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm'>
          <div className='grid gap-2'>
            <p className='text-sm font-semibold uppercase tracking-[0.28em] text-stone-500'>当前默认孩子</p>
            <h2 className='text-2xl font-semibold tracking-tight text-stone-900'>{profile.nickname}</h2>
            <p className='text-lg text-stone-700'>
              {profile.ageLabel} · {profile.stage.stageLabel}
            </p>
          </div>
          <dl className='grid gap-4 text-sm text-stone-700 sm:grid-cols-2'>
            <div className='grid gap-1'>
              <dt className='font-medium text-stone-500'>出生日期</dt>
              <dd>{profile.birthDateLabel}</dd>
            </div>
            <div className='grid gap-1'>
              <dt className='font-medium text-stone-500'>家长账号</dt>
              <dd>{profile.userEmail}</dd>
            </div>
            <div className='grid gap-1'>
              <dt className='font-medium text-stone-500'>阶段重点</dt>
              <dd>{profile.stage.focusAreas.join('、')}</dd>
            </div>
            <div className='grid gap-1'>
              <dt className='font-medium text-stone-500'>查看说明</dt>
              <dd>后续可以在这里接入编辑入口；当前先保留轻量查看体验。</dd>
            </div>
          </dl>
        </section>
      ) : (
        <section className='grid gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm'>
          <h2 className='text-2xl font-semibold tracking-tight text-stone-900'>还没有默认孩子档案</h2>
          <p className='text-stone-700'>
            先创建一个孩子档案，之后这里就会显示默认孩子的查看信息。
          </p>
          <Link className='w-fit rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white' href='/register'>
            去创建档案
          </Link>
        </section>
      )}
    </AppShell>
  );
}
