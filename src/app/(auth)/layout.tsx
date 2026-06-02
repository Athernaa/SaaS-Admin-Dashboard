import React from "react";
import { Command } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-center items-center relative overflow-hidden selection:bg-indigo-500/30">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 dark:bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 dark:bg-indigo-500/10 blur-[120px] pointer-events-none" />
      
      <div className="z-10 mb-8 flex items-center space-x-2 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/20">
          <Command size={28} />
        </div>
        <span>ClientFlow</span>
      </div>

      <div className="z-10 w-full max-w-md px-6 sm:px-0">
        <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          {children}
        </div>
      </div>
    </div>
  );
}
