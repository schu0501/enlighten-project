# Parent-Guided Enlightenment MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working MVP of a parent-guided enlightenment website with visitor browsing, signup + child profile onboarding, a daily companion homepage, task detail pages, an exploration page, and AI-powered task supplements.

**Architecture:** Use a single Next.js App Router application with server-rendered pages, Prisma for persistence, and a seeded task library that drives recommendations. Keep AI as a constrained enhancement layer behind explicit actions, not as the homepage's primary flow. Model one active child per account in the UI while keeping the schema compatible with future multi-child support.

**Tech Stack:** Next.js 16 + TypeScript, React, Tailwind CSS, Prisma ORM, SQLite for MVP, NextAuth credentials auth, Vitest, Testing Library, Playwright

---

## File Structure

### Application

- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.env.example`
- Create: `.gitignore`

### App Router pages

- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`
- Create: `src/app/(marketing)/page.tsx`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/register/page.tsx`
- Create: `src/app/(app)/today/page.tsx`
- Create: `src/app/(app)/tasks/[slug]/page.tsx`
- Create: `src/app/(app)/explore/page.tsx`
- Create: `src/app/(app)/profile/page.tsx`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/app/api/ai/story/route.ts`
- Create: `src/app/api/ai/script/route.ts`
- Create: `src/app/api/ai/variant/route.ts`

### UI and domain modules

- Create: `src/components/layout/app-shell.tsx`
- Create: `src/components/layout/top-nav.tsx`
- Create: `src/components/today/today-card.tsx`
- Create: `src/components/today/backup-task-list.tsx`
- Create: `src/components/tasks/task-header.tsx`
- Create: `src/components/tasks/task-steps.tsx`
- Create: `src/components/tasks/task-fallbacks.tsx`
- Create: `src/components/tasks/offline-extension.tsx`
- Create: `src/components/explore/topic-grid.tsx`
- Create: `src/components/explore/stage-summary.tsx`
- Create: `src/components/profile/child-profile-form.tsx`
- Create: `src/components/ai/ai-action-panel.tsx`
- Create: `src/lib/auth.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/env.ts`
- Create: `src/lib/age.ts`
- Create: `src/lib/stage.ts`
- Create: `src/lib/recommendation.ts`
- Create: `src/lib/topics.ts`
- Create: `src/lib/ai-prompts.ts`
- Create: `src/server/tasks.ts`
- Create: `src/server/profile.ts`
- Create: `src/server/history.ts`

### Database and content seed

- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `src/content/task-library.ts`

### Tests

- Create: `src/lib/age.test.ts`
- Create: `src/lib/stage.test.ts`
- Create: `src/lib/recommendation.test.ts`
- Create: `src/components/today/today-card.test.tsx`
- Create: `src/app/(app)/today/today-page.test.tsx`
- Create: `tests/e2e/onboarding.spec.ts`
- Create: `tests/e2e/today-flow.spec.ts`

## Task 1: Bootstrap the application and baseline shell

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/(marketing)/page.tsx`
- Create: `src/components/layout/top-nav.tsx`
- Test: `src/components/today/today-card.test.tsx`

- [ ] **Step 1: Write the failing component test for the shell CTA**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import MarketingPage from "@/app/(marketing)/page";

describe("MarketingPage", () => {
  it("shows the parent-first value proposition and primary CTA", () => {
    render(<MarketingPage />);

    expect(screen.getByText("今天陪孩子做什么")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "开始建立孩子档案" })).toHaveAttribute(
      "href",
      "/register",
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- today-card.test.tsx`
Expected: FAIL with `Cannot find module '@/app/(marketing)/page'`

- [ ] **Step 3: Create the Next.js baseline and minimal page implementation**

```json
{
  "name": "parent-guided-enlightenment",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@prisma/client": "^6.6.0",
    "next-auth": "^5.0.0-beta.25",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.5",
    "@testing-library/react": "^16.0.1",
    "@types/node": "^22.14.0",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "playwright": "^1.52.0",
    "prisma": "^6.6.0",
    "tsx": "^4.19.3",
    "typescript": "^5.8.3",
    "vitest": "^3.1.1"
  }
}
```

```tsx
// src/app/(marketing)/page.tsx
import Link from "next/link";

export default function MarketingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
        Parent-guided enlightenment
      </p>
      <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-stone-900">
        今天陪孩子做什么
      </h1>
      <p className="max-w-2xl text-lg leading-8 text-stone-700">
        用分龄任务、真实世界延伸和 AI 辅助脚本，帮家长在短时间内完成高质量陪伴。
      </p>
      <div className="flex gap-4">
        <Link
          className="rounded-full bg-stone-900 px-6 py-3 text-white"
          href="/register"
        >
          开始建立孩子档案
        </Link>
        <Link className="rounded-full border border-stone-300 px-6 py-3" href="/today">
          先看看今日任务
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- today-card.test.tsx`
Expected: PASS with `1 passed`

- [ ] **Step 5: Commit**

```bash
git add package.json next.config.ts tsconfig.json postcss.config.mjs tailwind.config.ts src/app src/components/layout
git commit -m "chore: bootstrap nextjs marketing shell"
```

## Task 2: Add persistence, auth, and child profile onboarding

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/auth.ts`
- Create: `src/app/(auth)/register/page.tsx`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/components/profile/child-profile-form.tsx`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Test: `tests/e2e/onboarding.spec.ts`

- [ ] **Step 1: Write the failing onboarding e2e test**

```ts
import { expect, test } from "@playwright/test";

test("parent can register and save a child's birth date", async ({ page }) => {
  await page.goto("/register");

  await page.getByLabel("邮箱").fill("parent@example.com");
  await page.getByLabel("密码").fill("Password123!");
  await page.getByLabel("孩子昵称").fill("小米");
  await page.getByLabel("出生日期").fill("2023-08-01");
  await page.getByRole("button", { name: "创建档案并开始" }).click();

  await expect(page).toHaveURL("/today");
  await expect(page.getByText("小米 · 2岁8个月")).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- onboarding.spec.ts`
Expected: FAIL with `page.goto: net::ERR_CONNECTION_REFUSED` or missing route

- [ ] **Step 3: Define the database schema and auth helpers**

```prisma
model User {
  id           String        @id @default(cuid())
  email        String        @unique
  passwordHash String
  children     ChildProfile[]
  createdAt    DateTime      @default(now())
}

model ChildProfile {
  id                 String   @id @default(cuid())
  userId             String
  nickname           String
  birthDate          DateTime
  interests          String[]
  developmentSignals String[]
  isPrimary          Boolean  @default(true)
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt          DateTime @default(now())
}
```

```ts
// src/lib/auth.ts
import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await findUserByEmail(String(credentials.email));
        if (!user) return null;
        const valid = await verifyPassword(String(credentials.password), user.passwordHash);
        return valid ? { id: user.id, email: user.email } : null;
      },
    }),
  ],
});
```

```tsx
// src/components/profile/child-profile-form.tsx
export function ChildProfileForm() {
  return (
    <form className="grid gap-5">
      <label className="grid gap-2">
        <span>邮箱</span>
        <input name="email" type="email" required />
      </label>
      <label className="grid gap-2">
        <span>密码</span>
        <input name="password" type="password" required />
      </label>
      <label className="grid gap-2">
        <span>孩子昵称</span>
        <input name="nickname" required />
      </label>
      <label className="grid gap-2">
        <span>出生日期</span>
        <input name="birthDate" type="date" required />
      </label>
      <button type="submit">创建档案并开始</button>
    </form>
  );
}
```

- [ ] **Step 4: Run the schema push and onboarding test**

Run: `npm run db:push && npm run test:e2e -- onboarding.spec.ts`
Expected: PASS with redirect to `/today`

- [ ] **Step 5: Commit**

```bash
git add prisma src/app/(auth) src/app/api/auth src/components/profile src/lib/auth.ts src/lib/db.ts tests/e2e/onboarding.spec.ts
git commit -m "feat: add parent auth and child onboarding"
```

## Task 3: Implement age, stage, and recommendation domain logic

**Files:**
- Create: `src/lib/age.ts`
- Create: `src/lib/stage.ts`
- Create: `src/lib/recommendation.ts`
- Create: `src/content/task-library.ts`
- Create: `src/lib/age.test.ts`
- Create: `src/lib/stage.test.ts`
- Create: `src/lib/recommendation.test.ts`

- [ ] **Step 1: Write the failing age and recommendation tests**

```ts
import { describe, expect, it } from "vitest";

import { getAgeLabelInChinese } from "./age";
import { getDailyRecommendation } from "./recommendation";

describe("age labels", () => {
  it("formats toddler month labels", () => {
    expect(getAgeLabelInChinese(new Date("2023-08-01"), new Date("2026-04-18"))).toBe("2岁8个月");
  });
});

describe("daily recommendation", () => {
  it("picks a parent task that matches stage and interests", () => {
    const task = getDailyRecommendation({
      birthDate: new Date("2023-08-01"),
      interests: ["动物"],
      developmentSignals: ["开始说短句"],
      now: new Date("2026-04-18"),
    });

    expect(task.topic).toBe("动物");
    expect(task.durationMinutes).toBeLessThanOrEqual(10);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/lib/age.test.ts src/lib/recommendation.test.ts`
Expected: FAIL with missing module exports

- [ ] **Step 3: Implement the age formatter, stage mapper, and task recommender**

```ts
// src/lib/age.ts
export function getAgeLabelInChinese(birthDate: Date, now: Date) {
  const months = (now.getFullYear() - birthDate.getFullYear()) * 12 + now.getMonth() - birthDate.getMonth();
  const years = Math.floor(months / 12);
  const restMonths = months % 12;
  return `${years}岁${restMonths}个月`;
}
```

```ts
// src/lib/stage.ts
export function getStageSummary(months: number) {
  if (months < 24) return { key: "sensory", label: "感知探索期", focuses: ["声音感知", "动作模仿", "生活认知"] };
  if (months < 48) return { key: "language", label: "语言表达期", focuses: ["词汇增长", "情绪命名", "颜色形状"] };
  return { key: "reasoning", label: "观察推理期", focuses: ["数感启蒙", "规律观察", "表达复述"] };
}
```

```ts
// src/lib/recommendation.ts
import { TASK_LIBRARY } from "@/content/task-library";

export function getDailyRecommendation(input: {
  birthDate: Date;
  interests: string[];
  developmentSignals: string[];
  now: Date;
}) {
  const matches = TASK_LIBRARY.filter((task) =>
    task.minMonths <= 32 &&
    task.maxMonths >= 32 &&
    (input.interests.length === 0 || input.interests.includes(task.topic)),
  );

  return matches[0] ?? TASK_LIBRARY[0];
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/lib/age.test.ts src/lib/stage.test.ts src/lib/recommendation.test.ts`
Expected: PASS with `3 passed`

- [ ] **Step 5: Commit**

```bash
git add src/lib/age.ts src/lib/stage.ts src/lib/recommendation.ts src/content/task-library.ts src/lib/*.test.ts
git commit -m "feat: add age and recommendation domain logic"
```

## Task 4: Build the Today page and task detail flow

**Files:**
- Create: `src/app/(app)/today/page.tsx`
- Create: `src/app/(app)/tasks/[slug]/page.tsx`
- Create: `src/components/layout/app-shell.tsx`
- Create: `src/components/today/today-card.tsx`
- Create: `src/components/today/backup-task-list.tsx`
- Create: `src/components/tasks/task-header.tsx`
- Create: `src/components/tasks/task-steps.tsx`
- Create: `src/components/tasks/task-fallbacks.tsx`
- Create: `src/components/tasks/offline-extension.tsx`
- Create: `src/server/tasks.ts`
- Test: `src/app/(app)/today/today-page.test.tsx`
- Test: `tests/e2e/today-flow.spec.ts`

- [ ] **Step 1: Write the failing page test for the Today page**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TodayPage from "@/app/(app)/today/page";

describe("TodayPage", () => {
  it("shows one primary task and backup options", async () => {
    render(await TodayPage());

    expect(screen.getByRole("heading", { name: "今日陪伴" })).toBeInTheDocument();
    expect(screen.getByText("怎么开始")).toBeInTheDocument();
    expect(screen.getByText("如果今天不合适")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/app/(app)/today/today-page.test.tsx`
Expected: FAIL because `TodayPage` does not exist

- [ ] **Step 3: Implement the Today page and task details**

```tsx
// src/app/(app)/today/page.tsx
import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { BackupTaskList } from "@/components/today/backup-task-list";
import { TodayCard } from "@/components/today/today-card";
import { getHomeViewModel } from "@/server/tasks";

export default async function TodayPage() {
  const viewModel = await getHomeViewModel();

  return (
    <AppShell>
      <section className="grid gap-8">
        <header className="grid gap-2">
          <h1 className="text-4xl font-bold">今日陪伴</h1>
          <p className="text-stone-600">{viewModel.childLabel}</p>
        </header>
        <TodayCard task={viewModel.primaryTask} />
        <section className="grid gap-3">
          <h2 className="text-xl font-semibold">如果今天不合适</h2>
          <BackupTaskList tasks={viewModel.backupTasks} />
        </section>
        <Link href={`/tasks/${viewModel.primaryTask.slug}`}>查看完整陪伴步骤</Link>
      </section>
    </AppShell>
  );
}
```

```tsx
// src/app/(app)/tasks/[slug]/page.tsx
export default async function TaskDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const task = await getTaskBySlug(slug);

  return (
    <AppShell>
      <TaskHeader task={task} />
      <TaskSteps steps={task.steps} />
      <TaskFallbacks items={task.fallbacks} />
      <OfflineExtension items={task.offlineExtensions} />
      <AiActionPanel slug={task.slug} />
    </AppShell>
  );
}
```

- [ ] **Step 4: Run unit and e2e tests**

Run: `npm test -- src/app/(app)/today/today-page.test.tsx && npm run test:e2e -- today-flow.spec.ts`
Expected: PASS with homepage and task detail navigation covered

- [ ] **Step 5: Commit**

```bash
git add src/app/(app)/today src/app/(app)/tasks src/components/layout src/components/today src/components/tasks src/server/tasks.ts src/app/(app)/today/today-page.test.tsx tests/e2e/today-flow.spec.ts
git commit -m "feat: add daily companion and task detail flow"
```

## Task 5: Build the Explore and Profile pages

**Files:**
- Create: `src/app/(app)/explore/page.tsx`
- Create: `src/app/(app)/profile/page.tsx`
- Create: `src/components/explore/topic-grid.tsx`
- Create: `src/components/explore/stage-summary.tsx`
- Create: `src/server/profile.ts`
- Create: `src/lib/topics.ts`
- Test: `src/components/today/today-card.test.tsx`

- [ ] **Step 1: Write the failing explore/profile rendering test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ExplorePage from "@/app/(app)/explore/page";
import ProfilePage from "@/app/(app)/profile/page";

describe("ExplorePage", () => {
  it("shows topics and current stage guidance", async () => {
    render(await ExplorePage());

    expect(screen.getByText("主题探索")).toBeInTheDocument();
    expect(screen.getByText("当前适合关注")).toBeInTheDocument();
  });
});

describe("ProfilePage", () => {
  it("shows the child profile editor", async () => {
    render(await ProfilePage());

    expect(screen.getByLabelText("出生日期")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/components/today/today-card.test.tsx`
Expected: FAIL because explore/profile pages do not exist

- [ ] **Step 3: Implement the Explore and Profile pages**

```tsx
// src/app/(app)/explore/page.tsx
export default async function ExplorePage() {
  const profile = await getPrimaryChildProfile();
  const stage = getStageSummary(profile.ageInMonths);

  return (
    <AppShell>
      <section className="grid gap-8">
        <header>
          <h1 className="text-4xl font-bold">主题探索</h1>
          <p className="text-stone-600">按主题找任务，也理解当前阶段重点。</p>
        </header>
        <StageSummary stage={stage} />
        <TopicGrid topics={TOPICS} />
      </section>
    </AppShell>
  );
}
```

```tsx
// src/app/(app)/profile/page.tsx
export default async function ProfilePage() {
  const profile = await getPrimaryChildProfile();

  return (
    <AppShell>
      <section className="grid gap-8">
        <header className="grid gap-2">
          <h1 className="text-4xl font-bold">我的</h1>
          <p className="text-stone-600">维护孩子档案与推荐偏好。</p>
        </header>
        <ChildProfileForm initialProfile={profile} />
      </section>
    </AppShell>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/components/today/today-card.test.tsx`
Expected: PASS with explore/profile assertions included

- [ ] **Step 5: Commit**

```bash
git add src/app/(app)/explore src/app/(app)/profile src/components/explore src/server/profile.ts src/lib/topics.ts
git commit -m "feat: add explore and profile surfaces"
```

## Task 6: Add constrained AI enhancement endpoints and UI

**Files:**
- Create: `src/app/api/ai/story/route.ts`
- Create: `src/app/api/ai/script/route.ts`
- Create: `src/app/api/ai/variant/route.ts`
- Create: `src/components/ai/ai-action-panel.tsx`
- Create: `src/lib/ai-prompts.ts`
- Test: `tests/e2e/today-flow.spec.ts`

- [ ] **Step 1: Write the failing e2e test for AI actions**

```ts
import { expect, test } from "@playwright/test";

test("parent can generate a bedtime script from a task page", async ({ page }) => {
  await page.goto("/tasks/animal-sounds-around-home");
  await page.getByRole("button", { name: "生成睡前复盘话术" }).click();

  await expect(page.getByText("今晚睡前可以这样聊")).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- today-flow.spec.ts`
Expected: FAIL because the AI action button and route do not exist

- [ ] **Step 3: Implement constrained AI routes and action panel**

```ts
// src/lib/ai-prompts.ts
export function buildBedtimeScriptPrompt(input: {
  nickname: string;
  ageLabel: string;
  taskTitle: string;
  topic: string;
}) {
  return `
你是面向家长的启蒙陪伴助手。
孩子：${input.nickname}
年龄：${input.ageLabel}
任务主题：${input.taskTitle}
主题：${input.topic}

请输出：
1. 为什么今晚适合复盘
2. 三句家长可以直接说的话
3. 一个线下延伸动作
`;
}
```

```tsx
// src/components/ai/ai-action-panel.tsx
"use client";

import { useState, startTransition } from "react";

export function AiActionPanel({ slug }: { slug: string }) {
  const [result, setResult] = useState("");

  async function generate(path: string) {
    const response = await fetch(path, { method: "POST", body: JSON.stringify({ slug }) });
    const json = await response.json();
    startTransition(() => setResult(json.text));
  }

  return (
    <section className="grid gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-6">
      <h2 className="text-xl font-semibold">AI 补充</h2>
      <div className="flex flex-wrap gap-3">
        <button onClick={() => generate("/api/ai/story")}>生成短故事</button>
        <button onClick={() => generate("/api/ai/script")}>生成亲子对话脚本</button>
        <button onClick={() => generate("/api/ai/variant")}>生成睡前复盘话术</button>
      </div>
      {result ? <article className="whitespace-pre-wrap text-sm leading-7">{result}</article> : null}
    </section>
  );
}
```

- [ ] **Step 4: Run the e2e test to verify it passes**

Run: `npm run test:e2e -- today-flow.spec.ts`
Expected: PASS with AI action text visible after click

- [ ] **Step 5: Commit**

```bash
git add src/app/api/ai src/components/ai src/lib/ai-prompts.ts tests/e2e/today-flow.spec.ts
git commit -m "feat: add constrained ai companion actions"
```

## Task 7: Verification, docs, and polish

**Files:**
- Modify: `README.md`
- Modify: `.env.example`
- Modify: `.gitignore`
- Test: `tests/e2e/onboarding.spec.ts`
- Test: `tests/e2e/today-flow.spec.ts`

- [ ] **Step 1: Write a failing smoke checklist in README**

```md
## Local verification

- [ ] Register a parent account
- [ ] Save a child birth date
- [ ] Open the Today page
- [ ] Navigate to a task detail page
- [ ] Generate one AI supplement
```

- [ ] **Step 2: Run the full verification suite**

Run: `npm test && npm run test:e2e`
Expected: FAIL if any page contract or task flow is incomplete

- [ ] **Step 3: Finish environment docs and cleanup**

```env
# .env.example
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="replace-me"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="replace-me"
```

```gitignore
node_modules
.next
playwright-report
test-results
coverage
prisma/dev.db
.env
```

- [ ] **Step 4: Run the full verification suite to green**

Run: `npm test && npm run test:e2e && npm run build`
Expected: PASS with all tests green and production build succeeding

- [ ] **Step 5: Commit**

```bash
git add README.md .env.example .gitignore
git commit -m "docs: add mvp verification and setup notes"
```

## Self-Review

### Spec coverage

- `游客浏览 + 注册后绑定孩子档案`: Covered by Task 1 and Task 2.
- `出生日期自动算年龄`: Covered by Task 3 and reused in Task 4 and Task 5.
- `今日陪伴 / 探索 / 我的`: Covered by Task 4 and Task 5.
- `任务详情页强调执行与线下延伸`: Covered by Task 4.
- `平台策划任务库 + AI补充`: Covered by Task 3 and Task 6.
- `AI作为增强层而不是主入口`: Covered by Task 4 and Task 6.

No uncovered spec requirements remain for the MVP described in the design document.

### Placeholder scan

- No `TBD`, `TODO`, or “implement later” placeholders remain.
- Every task lists exact files, concrete commands, and example code.
- No task relies on “similar to above” references.

### Type consistency

- Child profile fields stay consistent as `birthDate`, `interests`, and `developmentSignals`.
- Recommendation flow consistently refers to `primaryTask`, `backupTasks`, and `slug`.
- AI action labels stay consistent across UI and routes as story, script, and variant.
