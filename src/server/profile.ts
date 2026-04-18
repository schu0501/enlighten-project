import { getPrimaryChildForEmail, readChildPreferenceTags, readSessionSafely } from '../lib/auth';
import { getAgeLabelInChinese, formatCalendarDate } from '../lib/age';
import { getGenderLabel } from '../lib/child-profile-options';
import { getStageSummary, type StageSummary } from '../lib/stage';

export type PrimaryChildProfile = {
  id: string;
  nickname: string;
  gender: string;
  genderLabel: string;
  birthDate: Date;
  birthDateLabel: string;
  ageLabel: string;
  isPrimary: boolean;
  userEmail: string;
  interestTags: string[];
  developmentSignalTags: string[];
  stage: StageSummary;
};

export async function getPrimaryChildProfile(): Promise<PrimaryChildProfile | null> {
  const session = await readSessionSafely();
  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  const child = await getPrimaryChildForEmail(email);

  if (!child) {
    return null;
  }

  const now = new Date();
  const preferenceTags = readChildPreferenceTags(child);

  return {
    id: child.id,
    nickname: child.nickname,
    gender: child.gender,
    genderLabel: getGenderLabel(child.gender),
    birthDate: child.birthDate,
    birthDateLabel: formatCalendarDate(child.birthDate),
    ageLabel: getAgeLabelInChinese(child.birthDate, now),
    isPrimary: child.isPrimary,
    userEmail: child.user.email,
    interestTags: preferenceTags.interestTags,
    developmentSignalTags: preferenceTags.developmentSignalTags,
    stage: getStageSummary(child.birthDate, now),
  };
}
