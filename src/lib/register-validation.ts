import { DEVELOPMENT_SIGNAL_TAGS, INTEREST_TAGS, filterAllowedTags } from './child-tags';
import { parseCalendarDate } from './age';
import { isValidGender, type ChildGender } from './child-profile-options';

export type RegisterInput = {
  email: string;
  password: string;
  nickname: string;
  gender: ChildGender | '';
  birthDate: string;
  interestTags?: string[];
  developmentSignalTags?: string[];
};

export type RegisterValidationResult =
  | {
      success: true;
      data: RegisterInput;
    }
  | {
      success: false;
      message: string;
    };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export type ChildProfileInput = {
  nickname: string;
  gender: ChildGender | '';
  birthDate: string;
  interestTags?: string[];
  developmentSignalTags?: string[];
};

export type ChildProfileValidationResult =
  | {
      success: true;
      data: ChildProfileInput;
    }
  | {
      success: false;
      message: string;
    };

export function buildBirthDateString(year: string, month: string, day: string) {
  if (!year || !month || !day) {
    return '';
  }

  return `${year}-${month}-${day}`;
}

export function validateChildProfileInput(input: ChildProfileInput, now: Date = new Date()): ChildProfileValidationResult {
  const nickname = input.nickname.trim();
  const gender = input.gender;
  const birthDate = input.birthDate.trim();
  const interestTags = filterAllowedTags(input.interestTags ?? [], INTEREST_TAGS);
  const developmentSignalTags = filterAllowedTags(input.developmentSignalTags ?? [], DEVELOPMENT_SIGNAL_TAGS);

  if (!nickname) {
    return { success: false, message: '请输入孩子昵称。' };
  }

  if (!isValidGender(gender)) {
    return { success: false, message: '请选择孩子性别。' };
  }

  if (!birthDate) {
    return { success: false, message: '请选择出生日期。' };
  }

  let parsedBirthDate: Date;

  try {
    parsedBirthDate = parseCalendarDate(birthDate);
  } catch {
    return { success: false, message: '请选择有效的出生日期。' };
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (parsedBirthDate > today) {
    return { success: false, message: '出生日期不能晚于今天。' };
  }

  return {
    success: true,
    data: {
      nickname,
      gender,
      birthDate,
      interestTags,
      developmentSignalTags,
    },
  };
}

export function validateRegisterInput(input: RegisterInput, now: Date = new Date()): RegisterValidationResult {
  const email = input.email.trim();
  const password = input.password;

  if (!email) {
    return { success: false, message: '请输入邮箱地址。' };
  }

  if (!isValidEmail(email)) {
    return { success: false, message: '请输入有效的邮箱地址。' };
  }

  if (!password) {
    return { success: false, message: '请输入密码。' };
  }

  if (password.length < 8) {
    return { success: false, message: '密码至少需要 8 位。' };
  }

  const childProfileValidated = validateChildProfileInput(input, now);

  if (!childProfileValidated.success) {
    return childProfileValidated;
  }

  return {
    success: true,
    data: {
      email: email.toLowerCase(),
      password,
      ...childProfileValidated.data,
    },
  };
}
