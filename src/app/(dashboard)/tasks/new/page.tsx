import { createTaskAction } from "../actions";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, CheckSquare, FolderKanban } from "lucide-react";

export default async function NewTaskPage() {
  const supabase = await createClient();
  
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name")
    .order("name");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link 
          href="/tasks"
          className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Create Task</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Add a new task and assign it to a project.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <form action={createTaskAction} className="space-y-6">
          <div className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="title">Task Title <span className="text-red-500">*</span></label>
              <div className="relative">
                <CheckSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="Design new landing page"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="project_id">Assign to Project <span className="text-red-500">*</span></label>
              <div className="relative">
                <FolderKanban className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <select
                  id="project_id"
                  name="project_id"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white appearance-none"
                >
                  <option value="" disabled selected>Select a project...</option>
                  {projects?.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="status">Initial Status</label>
              <select
                id="status"
                name="status"
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link 
              href="/tasks"
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
