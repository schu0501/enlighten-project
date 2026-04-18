export const GENDER_OPTIONS = [
  { value: 'boy', label: '男孩' },
  { value: 'girl', label: '女孩' },
] as const;

export type ChildGender = (typeof GENDER_OPTIONS)[number]['value'];

export function getGenderLabel(gender: string | null | undefined) {
  return GENDER_OPTIONS.find((option) => option.value === gender)?.label ?? '';
}

export function isValidGender(gender: string | null | undefined): gender is ChildGender {
  return GENDER_OPTIONS.some((option) => option.value === gender);
}
