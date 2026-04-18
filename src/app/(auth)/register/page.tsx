import Link from 'next/link';

import { readSessionSafely } from '@/lib/auth';
import { ChildProfileForm } from '@/components/profile/child-profile-form';

export default async function RegisterPage() {
  const session = await readSessionSafely();
  const signedIn = Boolean(session?.user?.email);

  return (
    <main className='auth-shell flex min-h-[calc(100vh-4.5rem)] flex-col gap-8'>
      <section className='page-hero'>
        <p className='page-kicker'>Parent-guided enlightenment</p>
        <h1 className='page-title'>创建孩子档案</h1>
        <p className='page-lead'>
          {signedIn
            ? '你已经登录，可以直接补充或更新孩子档案，系统会继续沿用当前家长账号。'
            : '先把家长账号和孩子出生日期建好，系统就能从今天开始给出更贴近年龄的陪伴建议。'}
        </p>
      </section>
      <ChildProfileForm signedIn={signedIn} />
      {signedIn ? (
        <p className='text-sm text-[color:var(--text-soft)]'>
          想回到当前账号的档案页？
          <Link className='soft-link ml-2 font-medium text-[color:var(--text)]' href='/profile'>
            去查看我的档案
          </Link>
        </p>
      ) : (
        <p className='text-sm text-[color:var(--text-soft)]'>
          已经有账号了？
          <Link className='soft-link ml-2 font-medium text-[color:var(--text)]' href='/login'>
            直接登录
          </Link>
        </p>
      )}
    </main>
  );
}
