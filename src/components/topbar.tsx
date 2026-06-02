"use client";

import { useTheme } from "next-themes";
import { LogOut, Moon, Sun, User, Menu } from "lucide-react";
import { signout } from "@/app/auth/actions";

export default function Topbar({ userEmail, onMenuClick }: { userEmail?: string, onMenuClick?: () => void }) {
  const { theme, setTheme, systemTheme } = useTheme();
  
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-4 sm:px-6 transition-colors">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-neutral-700 dark:text-neutral-300 lg:hidden"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <button
          type="button"
          className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
          onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
        >
          <span className="sr-only">Toggle theme</span>
          {currentTheme === "dark" ? (
            <Sun className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Moon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>

        <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800" aria-hidden="true" />

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            <User size={16} />
          </div>
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hidden sm:block">
            {userEmail}
          </span>
          
          <button
            onClick={() => signout()}
            className="ml-2 rounded-full p-2 text-neutral-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
