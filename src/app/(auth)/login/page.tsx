import { login } from "@/app/auth/actions";
import Link from "next/link";
import { ArrowRight, Mail, Lock } from "lucide-react";

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams;
  const message = searchParams?.message;

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Welcome back</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">Enter your credentials to access your dashboard</p>
      </div>

      <form className="flex flex-col space-y-4">
        {message && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-900/50">
            {message}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="email">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="password">Password</label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>
        </div>

        <button
          formAction={login}
          className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center group"
        >
          Sign in
          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        Don't have an account?{" "}
        <Link href="/register" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
          Create one now
        </Link>
      </div>
    </div>
  );
}
