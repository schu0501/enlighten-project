export const INTEREST_TAGS = ['动物', '交通工具', '音乐', '故事', '食物', '日常生活'] as const;
export const DEVELOPMENT_SIGNAL_TAGS = [
  '爱听故事',
  '喜欢模仿声音',
  '开始说短句',
  '喜欢追问',
  '愿意表达想法',
  '能完成两步指令',
] as const;

export type InterestTag = (typeof INTEREST_TAGS)[number];
export type DevelopmentSignalTag = (typeof DEVELOPMENT_SIGNAL_TAGS)[number];

export function filterAllowedTags(input: string[], allowed: readonly string[]) {
  const allowedSet = new Set(allowed);

  return input.filter((value, index) => allowedSet.has(value) && input.indexOf(value) === index);
}

export function parseStoredTags(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function serializeTags(tags: string[]) {
  return JSON.stringify(tags);
}
