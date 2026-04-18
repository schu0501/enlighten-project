import Link from 'next/link';

import { AppShell } from '../../../components/layout/app-shell';
import { ChildBirthDateEditor } from '../../../components/profile/child-birthdate-editor';
import { ChildPreferenceEditor } from '../../../components/profile/child-preference-editor';
import { ChildStageRadarCard } from '../../../components/profile/child-stage-radar-card';
import { getPrimaryChildProfile } from '../../../server/profile';

export default async function ProfilePage() {
  const profile = await getPrimaryChildProfile();
  const hasPreferenceTags =
    (profile?.interestTags.length ?? 0) > 0 || (profile?.developmentSignalTags.length ?? 0) > 0;

  return (
    <AppShell>
      <section className='page-hero'>
        <p className='page-kicker'>Parent-guided enlightenment</p>
        <h1 className='page-title text-[clamp(2.4rem,4.6vw,3.8rem)]'>我的档案</h1>
        <p className='page-lead'>
          这里先保留当前默认孩子的查看页，方便父母快速确认年龄、阶段和账号信息。
        </p>
      </section>

      {profile ? (
        <div className='grid gap-6'>
          <ChildStageRadarCard
            profile={profile}
            action={
              <ChildBirthDateEditor
                initialBirthDate={profile.birthDateLabel}
                initialGender={profile.gender}
                initialInterestTags={profile.interestTags}
                initialDevelopmentSignalTags={profile.developmentSignalTags}
                nickname={profile.nickname}
              />
            }
          />
          {hasPreferenceTags ? null : (
            <ChildPreferenceEditor
              initialInterestTags={profile.interestTags}
              initialDevelopmentSignalTags={profile.developmentSignalTags}
            />
          )}
        </div>
      ) : (
        <section className='surface-panel grid gap-4 p-7 sm:p-8'>
          <h2 className='section-title'>还没有默认孩子档案</h2>
          <p className='section-copy'>
            先创建一个孩子档案，之后这里就会显示默认孩子的查看信息。
          </p>
          <Link className='primary-button w-fit' href='/register'>
            去创建档案
          </Link>
        </section>
      )}
    </AppShell>
  );
}
