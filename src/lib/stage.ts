export type ChildStageKey = 'infant' | 'toddler' | 'preschool';

export type StageSummary = {
  stageKey: ChildStageKey;
  stageLabel: string;
  ageRangeMonths: [number, number];
  focusAreas: string[];
  summary: string;
};

function getAgeInMonths(birthDate: Date, now: Date) {
  const birthYear = birthDate.getFullYear();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  let totalMonths = (currentYear - birthYear) * 12 + (currentMonth - birthMonth);

  if (currentDay < birthDay) {
    totalMonths -= 1;
  }

  return Math.max(0, totalMonths);
}

function getStageFromAgeInMonths(ageInMonths: number): StageSummary {
  if (ageInMonths < 12) {
    return {
      stageKey: 'infant',
      stageLabel: '婴儿觉察期',
      ageRangeMonths: [0, 11],
      focusAreas: ['感官探索', '安全感建立', '亲子回应'],
      summary: '以感官体验和稳定回应为主，帮助孩子建立安全感。',
    };
  }

  if (ageInMonths < 36) {
    return {
      stageKey: 'toddler',
      stageLabel: '幼儿启蒙期',
      ageRangeMonths: [12, 35],
      focusAreas: ['词汇表达', '模仿游戏', '分类认知'],
      summary: '围绕语言、模仿和基础分类能力，安排短时、可完成的亲子任务。',
    };
  }

  return {
    stageKey: 'preschool',
    stageLabel: '学前准备期',
    ageRangeMonths: [36, 72],
    focusAreas: ['故事表达', '规则意识', '专注力练习'],
    summary: '围绕表达、规则和专注力，安排更完整但仍然轻量的陪伴任务。',
  };
}

export function getStageSummary(birthDate: Date, now: Date = new Date()) {
  return getStageFromAgeInMonths(getAgeInMonths(birthDate, now));
}
