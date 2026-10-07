import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogue Management | Admin",
};

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif text-primary">Catalogue Management</h1>
      </div>

      <div className="bg-card rounded-md border border-border p-8 text-center text-muted-foreground">
        <p>The catalogue management interface will be available after the product schema and source parsing modules are finalised.</p>
        <p className="mt-2 text-sm">Currently, the catalogue is being served from the static JSON projection provided by Codex.</p>
      </div>
    </div>
  );
}
