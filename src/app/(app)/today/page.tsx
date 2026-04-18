import Link from "next/link";

export default function TodayPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight text-stone-900">今日陪伴</h1>
      <p className="text-lg leading-8 text-stone-700">
        这里会展示今天最适合家长和孩子一起完成的任务。
      </p>
      <Link className="text-stone-900 underline underline-offset-4" href="/explore">
        去探索更多主题
      </Link>
    </main>
  );
}
