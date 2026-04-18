# AGENTS.md

## 项目定位

这是一个面向 `0-6 岁儿童家长` 的家长辅助型蒙学网站。设计和实现都优先服务家长，不把产品做成让孩子长时间停留在屏幕前的内容平台。

协作时请优先保持这些产品原则：

- 先服务家长，再触达孩子
- 短屏幕时间，强线下延伸
- 每日轻任务，长期有体系
- 平台策划保质量，AI 做个性化增强

## 当前技术栈

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS`
- `NextAuth`
- `Prisma + SQLite`
- `Vitest`
- `Playwright`

## 开发约定

1. 优先延续现有家长端视觉语言
   当前 UI 走的是温和、自然、偏纸感和木质感的方向，避免做成儿童内容 App 的强刺激风格。

2. 新功能尽量沿着现有信息架构扩展
   一级主导航目前围绕 `今日陪伴 / 探索 / 我的` 组织，不轻易再加新的一级入口。

3. 推荐逻辑以平台任务库和规则驱动为主
   AI 在这里是增强层，不是主推荐源。新增功能时不要把主流程直接改成纯生成式体验。

4. 改动注册、档案、推荐链路时，要同时关注三件事
   - 前端交互
   - 接口校验
   - 推荐是否真正接到新字段

5. 任何影响家长输入的交互，都要优先考虑 IAB 兼容性
   之前 `type="date"` 在内置浏览器里出现过兼容问题，所以日期、选择器、弹层都尽量用更稳的自定义实现。

## 常用命令

```bash
npm run dev
npm run build
npm test
npm run test:e2e
npm run db:push
npm run db:seed
```

## 数据与环境

- 本地数据库默认是 `prisma/dev.db`
- 环境变量参考 `.env.example`
- 生产和共享环境必须显式设置 `NEXTAUTH_SECRET`

## 敏感信息约束

提交前请确认：

- 不提交 `.env`、`.env.local`、`.env.*`
- 不提交 `prisma/dev.db`
- 不把真实 token、secret、密码、数据库连接串写进仓库
- 示例配置统一放在 `.env.example`

如果要新增新的本地配置文件，记得同步更新 `.gitignore`。

## 测试建议

以下改动通常要补回归验证：

- 注册/登录/档案：至少跑相关 `Vitest` 和 `Playwright`
- 推荐逻辑：至少跑 `src/lib/recommendation.test.ts`
- 页面结构调整：至少跑对应页面测试和 `npm run build`

## 关键目录

- `src/app`：页面和 API Route
- `src/components`：界面组件
- `src/lib`：认证、验证、推荐、数据库辅助
- `src/server`：服务端聚合逻辑
- `prisma`：Schema、seed、本地数据库
- `tests/e2e`：Playwright 端到端测试
- `docs/superpowers`：产品设计和计划文档
