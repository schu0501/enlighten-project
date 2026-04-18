import { expect, test } from '@playwright/test';

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const email = `preferences-${runId}@example.com`;

test('parent can update child preference tags from profile', async ({ page }) => {
  await page.goto('/register');

  await page.getByLabel('邮箱').fill(email);
  await page.getByLabel('密码').fill('Password123!');
  await page.getByLabel('孩子昵称').fill('小酥');
  await page.getByRole('button', { name: '女孩' }).click();
  await page.getByRole('button', { name: '请选择出生日期' }).click();
  await page.getByLabel('出生年份').selectOption('2023');
  await page.getByLabel('出生月份').selectOption('8');
  await page.getByRole('button', { name: '2023-08-01' }).click();
  await page.getByRole('button', { name: '创建档案并开始' }).click();

  await expect(page).toHaveURL('/today');

  await page.goto('/profile');
  await page.getByRole('button', { name: '动物', exact: true }).click();
  await page.getByRole('button', { name: '故事', exact: true }).click();
  await page.getByRole('button', { name: '开始说短句', exact: true }).click();
  await page.getByRole('button', { name: '保存偏好设置' }).click();

  await expect(page.getByRole('button', { name: '保存偏好设置' })).toHaveCount(0);
  await expect(page.getByText(/^动物$/)).toBeVisible();
  await expect(page.getByText(/^故事$/)).toBeVisible();
  await expect(page.getByText(/^开始说短句$/)).toBeVisible();
});
