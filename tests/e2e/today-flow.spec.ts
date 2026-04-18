import { expect, test } from '@playwright/test';

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const email = `parent-${runId}@example.com`;
const textFromCodes = (...codes: number[]) => String.fromCodePoint(...codes);
const startLabel = textFromCodes(0x5f00, 0x59cb, 0x5efa, 0x7acb, 0x5b69, 0x5b50, 0x6863, 0x6848);
const emailLabel = textFromCodes(0x90ae, 0x7bb1);
const passwordLabel = textFromCodes(0x5bc6, 0x7801);
const nicknameLabel = textFromCodes(0x5b69, 0x5b50, 0x6635, 0x79f0);
const createProfileLabel = textFromCodes(0x521b, 0x5efa, 0x6863, 0x6848, 0x5e76, 0x5f00, 0x59cb);
const todayTitle = textFromCodes(0x4eca, 0x65e5, 0x966a, 0x4f34);
const offlineLabel = textFromCodes(0x79bb, 0x7ebf, 0x5ef6, 0x4f38);

test('homepage links into today and then task detail', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: startLabel }).click();
  await expect(page).toHaveURL('/register');

  await page.getByLabel(emailLabel).fill(email);
  await page.getByLabel(passwordLabel).fill('Password123!');
  await page.getByLabel(nicknameLabel).fill(textFromCodes(0x5c0f, 0x7c73));
  await page.getByRole('button', { name: '女孩' }).click();
  await page.getByRole('button', { name: '请选择出生日期' }).click();
  await page.getByLabel('出生年份').selectOption('2023');
  await page.getByLabel('出生月份').selectOption('8');
  await page.getByRole('button', { name: '2023-08-01' }).click();
  await page.getByRole('button', { name: createProfileLabel }).click();

  await expect(page).toHaveURL('/today');
  await expect(page.getByRole('heading', { name: todayTitle })).toBeVisible();

  await page.getByRole('link', { name: textFromCodes(0x600e, 0x4e48, 0x5f00, 0x59cb) }).click();
  await expect(page).toHaveURL(/\/tasks\/[a-z0-9-]+/);
  await expect(page.getByText(textFromCodes(0x600e, 0x4e48, 0x5f00, 0x59cb))).toBeVisible();
  await expect(page.getByText(offlineLabel)).toBeVisible();

  await page.getByRole('button', { name: '改写成短故事' }).click();
  await expect(page.getByRole('status')).toContainText('把当前任务改写成一段更容易讲给孩子听的短故事。');
});
