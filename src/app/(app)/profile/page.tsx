import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { ensureDatabase } from '@/lib/db-setup';
import { formatCalendarDate, getAgeLabelInChinese } from '@/lib/age';

export default async function ProfilePage() {
  const session = await auth();
  const email = session?.user?.email;

  await ensureDatabase(db);

  const child = email
    ? await db.childProfile.findFirst({
        where: {
          isPrimary: true,
          user: {
            email,
          },
        },
        include: {
          user: true,
        },
      })
    : null;

  return (
    <main className='mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-12'>
      <section className='grid gap-3'>
        <p className='text-sm font-semibold uppercase tracking-[0.3em] text-amber-700'>Parent-guided enlightenment</p>
        <h1 className='text-4xl font-bold tracking-tight text-stone-900'>我的档案</h1>
        <p className='max-w-2xl text-lg leading-8 text-stone-700'>
          MVP 当前只支持一个默认孩子档案，后续会在这个基础上扩展更多孩子和偏好设置。
        </p>
      </section>
      {child ? (
        <section className='grid gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm'>
          <div className='grid gap-2'>
            <h2 className='text-2xl font-semibold tracking-tight text-stone-900'>当前默认孩子</h2>
            <p className='text-lg text-stone-700'>
              {child.nickname} · {getAgeLabelInChinese(child.birthDate, new Date())}
            </p>
            <p className='text-sm text-stone-600'>出生日期：{formatCalendarDate(child.birthDate)}</p>
          </div>
          <p className='text-sm text-stone-600'>家长账号：{child.user.email}</p>
        </section>
      ) : (
        <section className='grid gap-3 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm'>
          <h2 className='text-2xl font-semibold tracking-tight text-stone-900'>还没有默认孩子档案</h2>
          <p className='text-stone-700'>
            先去创建一个孩子档案，之后这里会展示默认孩子和出生日期。
          </p>
        </section>
      )}
    </main>
  );
}
