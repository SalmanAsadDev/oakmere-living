import { requireStaff } from "@/lib/server/staff";
import { format } from "date-fns";

export default async function AdminSwatchesPage() {
  const supabase = await requireStaff();
  
  const { data: requests, error } = await supabase
    .from("swatch_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-4 text-red-600 bg-red-50 rounded">Failed to load swatch requests.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif text-primary">Swatch Requests</h1>
      </div>

      <div className="bg-card rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Recipient</th>
              <th className="px-6 py-4 font-medium">Address</th>
              <th className="px-6 py-4 font-medium">Requested Fabrics</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requests?.map((request) => (
              <tr key={request.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(request.created_at), "dd MMM yyyy")}
                </td>
                <td className="px-6 py-4 font-medium">
                  {request.name}
                  <div className="text-xs text-muted-foreground mt-1 font-normal">
                    <a href={`mailto:${request.email}`} className="hover:underline">{request.email}</a>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="whitespace-pre-wrap text-xs">{request.address}</div>
                </td>
                <td className="px-6 py-4">
                  {request.notes ? (
                    <div className="text-xs">{request.notes}</div>
                  ) : (
                    <span className="text-muted-foreground italic text-xs">No notes provided</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {request.status}
                  </span>
                </td>
              </tr>
            ))}
            {(!requests || requests.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No swatch requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
