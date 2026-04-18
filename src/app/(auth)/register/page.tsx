import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight text-stone-900">创建孩子档案</h1>
      <p className="text-lg leading-8 text-stone-700">
        这里会在下一步引导家长填写基础信息并开始个性化推荐。
      </p>
      <Link className="text-stone-900 underline underline-offset-4" href="/today">
        先看看今日任务
      </Link>
    </main>
  );
}
