import { createClient } from "@/utils/supabase/server";
import { Plus, Search, Trash2, CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { deleteInvoiceAction, updateInvoiceStatusAction } from "./actions";

export default async function InvoicesPage() {
  const supabase = await createClient();
  
  const { data: invoices } = await supabase
    .from("invoices")
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Invoices</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Manage your billing and payments.
          </p>
        </div>
        <Link href="/invoices/new" className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Create Invoice
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search invoices..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white text-sm"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
          <thead className="bg-neutral-50 dark:bg-neutral-900/50">
            <tr>
              <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Client</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {invoices?.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  No invoices found. Click "Create Invoice" to add one.
                </td>
              </tr>
            ) : (
              invoices?.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group">
                  <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-neutral-900 dark:text-white">
                    {invoice.clients?.name || 'Unknown'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-900 dark:text-white font-semibold">
                    ${invoice.amount.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400' :
                      invoice.status === 'unpaid' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400'
                    }`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      
                      {invoice.status !== 'paid' && (
                        <form action={async () => { "use server"; await updateInvoiceStatusAction(invoice.id, 'paid'); }}>
                          <button type="submit" className="p-1.5 text-neutral-400 hover:text-green-600 dark:hover:text-green-400" title="Mark as Paid">
                            <CheckCircle2 size={18} />
                          </button>
                        </form>
                      )}
                      {invoice.status !== 'unpaid' && (
                        <form action={async () => { "use server"; await updateInvoiceStatusAction(invoice.id, 'unpaid'); }}>
                          <button type="submit" className="p-1.5 text-neutral-400 hover:text-yellow-600 dark:hover:text-yellow-400" title="Mark as Unpaid">
                            <Clock size={18} />
                          </button>
                        </form>
                      )}
                      {invoice.status !== 'overdue' && (
                        <form action={async () => { "use server"; await updateInvoiceStatusAction(invoice.id, 'overdue'); }}>
                          <button type="submit" className="p-1.5 text-neutral-400 hover:text-red-600 dark:hover:text-red-400" title="Mark as Overdue">
                            <XCircle size={18} />
                          </button>
                        </form>
                      )}

                      <form action={async () => { "use server"; await deleteInvoiceAction(invoice.id); }}>
                        <button type="submit" className="p-1.5 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 ml-2">
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
