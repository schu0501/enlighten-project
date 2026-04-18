import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight text-stone-900">我的</h1>
      <p className="text-lg leading-8 text-stone-700">
        这里会放孩子档案、偏好和阶段信息的编辑入口。
      </p>
      <Link className="text-stone-900 underline underline-offset-4" href="/register">
        继续完善档案
      </Link>
    </main>
  );
}
