import { createClient } from "@/utils/supabase/server";
import { Plus, Search, Trash2, Edit, FolderKanban } from "lucide-react";
import Link from "next/link";
import { deleteProjectAction } from "./actions";

export default async function ProjectsPage() {
  const supabase = await createClient();
  
  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      *,
      clients (
        name
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Manage your ongoing and completed projects.
          </p>
        </div>
        <Link href="/projects/new" className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Project
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects?.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl">
            <FolderKanban className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-white">No projects</h3>
            <p className="mt-1 text-sm text-neutral-500">Get started by creating a new project.</p>
          </div>
        ) : (
          projects?.map((project) => (
            <div key={project.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <FolderKanban size={24} />
                </div>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  project.status === 'active' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' 
                    : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-500/10 dark:text-neutral-400'
                }`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1 truncate">
                {project.name}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 flex-1">
                Client: {(project.clients as any)?.name || 'Unknown'}
              </p>

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                <span className="text-xs text-neutral-400">
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
                
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Edit size={16} />
                  </button>
                  <form action={async () => {
                    "use server";
                    await deleteProjectAction(project.id);
                  }}>
                    <button type="submit" className="p-1.5 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
