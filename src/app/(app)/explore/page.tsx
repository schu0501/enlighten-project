import Link from "next/link";

export default function ExplorePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight text-stone-900">探索</h1>
      <p className="text-lg leading-8 text-stone-700">
        这里会按主题浏览内容，并帮助家长理解当前阶段重点。
      </p>
      <Link className="text-stone-900 underline underline-offset-4" href="/profile">
        查看孩子档案
      </Link>
    </main>
  );
}
