import { createClient } from "@/utils/supabase/server";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { deleteClientAction } from "./actions";

export default async function ClientsPage() {
  const supabase = await createClient();
  
  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Clients</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Manage your clients and their contact information.
          </p>
        </div>
        <Link href="/clients/new" className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Client
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white text-sm"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
          <thead className="bg-neutral-50 dark:bg-neutral-900/50">
            <tr>
              <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Company</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Added</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {clients?.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  No clients found. Click "Add Client" to create one.
                </td>
              </tr>
            ) : (
              clients?.map((client) => (
                <tr key={client.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-neutral-900 dark:text-white">
                    {client.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                    {client.company || "-"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                    {client.email || "-"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                    {new Date(client.created_at).toLocaleDateString()}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <button className="text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <Edit size={18} />
                      </button>
                      <form action={async () => {
                        "use server";
                        await deleteClientAction(client.id);
                      }}>
                        <button type="submit" className="text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
