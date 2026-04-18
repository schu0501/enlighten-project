import { describe, expect, it } from 'vitest';

import { validateRegisterInput } from './register-validation';

describe('validateRegisterInput', () => {
  it('returns a clear password error', () => {
    const result = validateRegisterInput(
      {
        email: '869187331@qq.com',
        password: '123456',
        nickname: '小酥',
        gender: 'girl',
        birthDate: '2023-08-01',
      },
      new Date('2026-04-18'),
    );

    expect(result).toEqual({
      success: false,
      message: '密码至少需要 8 位。',
    });
  });

  it('returns a clear future birth date error', () => {
    const result = validateRegisterInput(
      {
        email: '869187331@qq.com',
        password: '12345678',
        nickname: '小酥',
        gender: 'girl',
        birthDate: '2026-11-04',
      },
      new Date('2026-04-18'),
    );

    expect(result).toEqual({
      success: false,
      message: '出生日期不能晚于今天。',
    });
  });
});
