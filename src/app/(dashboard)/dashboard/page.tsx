import { createClient } from "@/utils/supabase/server";
import { Users, FolderKanban, CheckSquare, Receipt, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { count: clientsCount } = await supabase.from('clients').select('*', { count: 'exact', head: true });
  
  const { count: activeProjectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  const { count: pendingTasksCount } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { data: unpaidInvoices } = await supabase
    .from('invoices')
    .select('amount')
    .eq('status', 'unpaid');
    
  const totalUnpaid = unpaidInvoices?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

  const { data: recentProjects } = await supabase
    .from('projects')
    .select('id, name, status, created_at, clients(name)')
    .order('created_at', { ascending: false })
    .limit(4);

  const { data: upcomingTasks } = await supabase
    .from('tasks')
    .select('id, title, status, created_at, projects(name)')
    .neq('status', 'done')
    .order('created_at', { ascending: false })
    .limit(4);

  const stats = [
    { name: "Total Clients", value: clientsCount || 0, icon: Users },
    { name: "Active Projects", value: activeProjectsCount || 0, icon: FolderKanban },
    { name: "Pending Tasks", value: pendingTasksCount || 0, icon: CheckSquare },
    { name: "Unpaid Invoices", value: `$${totalUnpaid.toLocaleString()}`, icon: Receipt },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Welcome back! Here's what's happening with your projects today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md"
          >
            <dt>
              <div className="absolute rounded-xl bg-indigo-50 dark:bg-indigo-500/10 p-3">
                <stat.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-neutral-500 dark:text-neutral-400">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
              <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                {stat.value}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent Projects</h2>
            <Link href="/projects" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              View all <ArrowUpRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentProjects?.length === 0 ? (
              <div className="h-32 flex items-center justify-center rounded-xl bg-neutral-50 dark:bg-neutral-950/50 border border-dashed border-neutral-200 dark:border-neutral-800">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">No projects yet.</p>
              </div>
            ) : (
              recentProjects?.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                      <FolderKanban size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{project.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{(project.clients as any)?.name}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    project.status === 'active' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' 
                      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-500/10 dark:text-neutral-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Upcoming Tasks</h2>
            <Link href="/tasks" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              View all <ArrowUpRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {upcomingTasks?.length === 0 ? (
              <div className="h-32 flex items-center justify-center rounded-xl bg-neutral-50 dark:bg-neutral-950/50 border border-dashed border-neutral-200 dark:border-neutral-800">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">No upcoming tasks.</p>
              </div>
            ) : (
              upcomingTasks?.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-500 dark:text-neutral-400">
                      <CheckSquare size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{task.title}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{(task.projects as any)?.name}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    task.status === 'in-progress' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' 
                      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-500/10 dark:text-neutral-400'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
