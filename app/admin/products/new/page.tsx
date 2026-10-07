import { createClient } from "@/lib/server/supabase";
import { createProduct } from "../actions";
import Link from "next/link";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("id, name");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">New Product</h1>
        <Link href="/admin/products" className="text-indigo-600 hover:underline">
          Cancel
        </Link>
      </div>

      <form action={createProduct} className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" name="name" required className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input type="text" name="slug" required className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select name="categoryId" className="mt-1 block w-full border border-gray-300 rounded p-2">
            <option value="">No Category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" rows={4} className="mt-1 block w-full border border-gray-300 rounded p-2"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Base Price (£)</label>
          <input type="number" step="0.01" name="basePrice" required className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>

        <div className="flex items-center">
          <input type="checkbox" name="isActive" id="isActive" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Active
          </label>
        </div>

        <div className="pt-4">
          <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
}
