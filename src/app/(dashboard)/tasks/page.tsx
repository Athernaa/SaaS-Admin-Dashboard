import { createClient } from "@/utils/supabase/server";
import { Plus, Trash2, CheckCircle2, CircleDashed, Clock } from "lucide-react";
import Link from "next/link";
import { deleteTaskAction, updateTaskStatusAction } from "./actions";

export default async function TasksPage() {
  const supabase = await createClient();
  
  const { data: tasks } = await supabase
    .from("tasks")
    .select(`
      *,
      projects (
        name
      )
    `)
    .order("created_at", { ascending: false });

  const pendingTasks = tasks?.filter(t => t.status === 'pending') || [];
  const inProgressTasks = tasks?.filter(t => t.status === 'in-progress') || [];
  const doneTasks = tasks?.filter(t => t.status === 'done') || [];

  const columns = [
    { title: "Pending", tasks: pendingTasks, icon: CircleDashed, color: "text-neutral-500", bg: "bg-neutral-100 dark:bg-neutral-800/50" },
    { title: "In Progress", tasks: inProgressTasks, icon: Clock, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { title: "Done", tasks: doneTasks, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Tasks Kanban</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Track and manage project tasks across different stages.
          </p>
        </div>
        <Link href="/tasks/new" className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Task
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col space-y-4">
            <div className={`flex items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 ${col.bg}`}>
              <div className="flex items-center space-x-2">
                <col.icon className={`h-5 w-5 ${col.color}`} />
                <h2 className="font-semibold text-neutral-900 dark:text-white">{col.title}</h2>
              </div>
              <span className="text-sm font-medium bg-white dark:bg-neutral-900 px-2 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-800">
                {col.tasks.length}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {col.tasks.map((task) => (
                <div key={task.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-2">{task.title}</h3>
                  <div className="flex justify-between items-end mt-4">
                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md">
                      {task.projects?.name || 'No Project'}
                    </span>
                    
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {task.status !== 'pending' && (
                        <form action={async () => { "use server"; await updateTaskStatusAction(task.id, 'pending'); }}>
                          <button type="submit" className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300" title="Move to Pending"><CircleDashed size={14} /></button>
                        </form>
                      )}
                      {task.status !== 'in-progress' && (
                        <form action={async () => { "use server"; await updateTaskStatusAction(task.id, 'in-progress'); }}>
                          <button type="submit" className="p-1 text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400" title="Move to In Progress"><Clock size={14} /></button>
                        </form>
                      )}
                      {task.status !== 'done' && (
                        <form action={async () => { "use server"; await updateTaskStatusAction(task.id, 'done'); }}>
                          <button type="submit" className="p-1 text-neutral-400 hover:text-green-600 dark:hover:text-green-400" title="Move to Done"><CheckCircle2 size={14} /></button>
                        </form>
                      )}
                      
                      <form action={async () => { "use server"; await deleteTaskAction(task.id); }}>
                        <button type="submit" className="p-1 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 ml-1">
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
              
              {col.tasks.length === 0 && (
                <div className="p-6 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">No tasks here</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
