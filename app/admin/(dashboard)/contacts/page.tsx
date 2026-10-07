import { createAdminClient } from "@/lib/server/supabase";
import { format } from "date-fns";

export default async function AdminContactsPage() {
  const supabase = createAdminClient();
  
  const { data: contacts, error } = await supabase
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-4 text-red-600 bg-red-50 rounded">Failed to load contacts.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif text-primary">Contact Enquiries</h1>
      </div>

      <div className="bg-card rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Message</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {contacts?.map((contact) => (
              <tr key={contact.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(contact.created_at), "dd MMM yyyy, HH:mm")}
                </td>
                <td className="px-6 py-4 font-medium">
                  {contact.name}
                  {contact.phone && <div className="text-xs text-muted-foreground mt-1">{contact.phone}</div>}
                </td>
                <td className="px-6 py-4">
                  <a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a>
                </td>
                <td className="px-6 py-4 max-w-md">
                  <div className="truncate" title={contact.message}>{contact.message}</div>
                  {contact.order_number && (
                    <div className="text-xs text-muted-foreground mt-1">Order: {contact.order_number}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    contact.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    contact.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {contact.status}
                  </span>
                </td>
              </tr>
            ))}
            {(!contacts || contacts.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No contact enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
