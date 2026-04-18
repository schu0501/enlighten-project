import { auth, getPrimaryChildForEmail } from '../lib/auth';
import { getAgeLabelInChinese, formatCalendarDate } from '../lib/age';
import { getStageSummary, type StageSummary } from '../lib/stage';

export type PrimaryChildProfile = {
  id: string;
  nickname: string;
  birthDate: Date;
  birthDateLabel: string;
  ageLabel: string;
  isPrimary: boolean;
  userEmail: string;
  stage: StageSummary;
};

export async function getPrimaryChildProfile(): Promise<PrimaryChildProfile | null> {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  const child = await getPrimaryChildForEmail(email);

  if (!child) {
    return null;
  }

  const now = new Date();

  return {
    id: child.id,
    nickname: child.nickname,
    birthDate: child.birthDate,
    birthDateLabel: formatCalendarDate(child.birthDate),
    ageLabel: getAgeLabelInChinese(child.birthDate, now),
    isPrimary: child.isPrimary,
    userEmail: child.user.email,
    stage: getStageSummary(child.birthDate, now),
  };
}
