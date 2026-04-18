import { expect, test } from "@playwright/test";

import { getAgeLabelInChinese, parseCalendarDate } from "../../src/lib/age";

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const email = `parent-${runId}@example.com`;
const birthDate = parseCalendarDate("2023-08-01");
const expectedAge = getAgeLabelInChinese(birthDate);

test("parent can register and save a child's birth date", async ({ page }) => {
  await page.goto("/register");

  await page.getByLabel("邮箱").fill(email);
  await page.getByLabel("密码").fill("Password123!");
  await page.getByLabel("孩子昵称").fill("小米");
  await page.getByLabel("出生日期").fill("2023-08-01");
  await page.getByRole("button", { name: "创建档案并开始" }).click();

  await expect(page).toHaveURL("/today");
  await expect(page.locator("main > p").first()).toHaveText(`小米 · ${expectedAge}`);
});
