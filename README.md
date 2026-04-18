# Enlighten Project

面向 `0-6 岁儿童家长` 的家长辅助型蒙学网站。产品把“今天陪孩子做什么”作为主入口，用分龄任务、现实世界延伸和 AI 辅助脚本，帮助家长用更短的准备时间完成更高质量的陪伴。

## 当前能力

- 家长注册、登录与默认孩子档案建立
- 根据孩子出生日期自动计算年龄与阶段
- 今日陪伴推荐、任务详情、探索页和我的档案
- 个性化标签：兴趣偏好、发展特点、性别
- 家长端 AI 辅助：故事、话术、任务变体
- 本地 SQLite 数据存储，适合 MVP 快速迭代

## 技术栈

- `Next.js 16` + `React 19` + `TypeScript`
- `Tailwind CSS`
- `NextAuth`
- `Prisma` + `SQLite`
- `Vitest` + Testing Library
- `Playwright`

## 本地启动

1. 安装依赖

```bash
npm install
```

2. 创建本地环境变量

```bash
copy .env.example .env
```

3. 初始化数据库

```bash
npm run db:push
```

4. 启动开发服务器

```bash
npm run dev
```

默认访问地址：

- 首页：[http://127.0.0.1:3000](http://127.0.0.1:3000)

## 环境变量

| 变量 | 说明 |
| --- | --- |
| `DATABASE_URL` | Prisma 使用的数据库地址。本地默认可用 `file:./prisma/dev.db` |
| `NEXTAUTH_SECRET` | NextAuth 密钥。生产、共享环境必须显式设置 |

说明：

- 本地开发和测试环境在未配置 `NEXTAUTH_SECRET` 时，会回退到稳定的本地 secret，避免开发重启后会话频繁失效。
- 共享环境、CI、线上部署不要依赖这个回退逻辑，必须显式配置真实 secret。

## 常用命令

```bash
npm run dev
npm run build
npm test
npm run test:e2e
npm run db:push
npm run db:seed
```

## 目录概览

```text
src/app                Next.js App Router 页面与 API
src/components         UI 组件
src/lib                通用逻辑、验证、认证与推荐
src/server             服务端聚合逻辑
prisma                 Schema、seed、本地数据库
tests/e2e              Playwright 端到端测试
docs/superpowers       设计文档与实现计划
```

## 安全与敏感信息

提交到 GitHub 前请确认：

- 不要提交 `.env`、`.env.local`、`.env.*`
- 不要提交 `prisma/dev.db`
- 不要把真实邮箱、密码、token、secret 写进源码、测试或文档
- 示例配置请写入 `.env.example`

本仓库当前已经通过 `.gitignore` 排除了本地环境变量、SQLite 数据库和测试产物。

## 产品方向

这个项目的核心原则是：

- 先服务家长，再触达孩子
- 短屏幕时间，强线下延伸
- 每日轻任务，长期有体系
- 平台策划保质量，AI 做个性化增强

如果你要继续扩展功能，建议先阅读：

- [家长辅助型蒙学平台设计](docs/superpowers/specs/2026-04-18-parent-guided-enlightenment-design.md)
- [MVP 实现计划](docs/superpowers/plans/2026-04-18-parent-guided-enlightenment-mvp.md)
