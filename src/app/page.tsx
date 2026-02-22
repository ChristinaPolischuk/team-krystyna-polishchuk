"use client";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { Product } from "@/server/schema";

// Define a type for a new product without an ID
type NewProduct = Omit<Product, 'id'>;

export default function Dashboard() {
  const utils = trpc.useUtils();
  const { data: products, isLoading } = trpc.products.getProducts.useQuery();

  // Initial state for a fresh product - updated to include image
  const emptyProduct: NewProduct = {
    name: "",
    price: 0,
    category: "",
    stock: 0,
    description: "",
    image: "/images/placeholder.jpg" // Default path
  };

  // State for the creation form with explicit type
  const [newProduct, setNewProduct] = useState<NewProduct>(emptyProduct);

  // State for tracking which product is being edited
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Product | null>(null);

  // CREATE mutation
  const addMutation = trpc.products.addProduct.useMutation({
    onSuccess: () => {
      utils.products.getProducts.invalidate();
      setNewProduct(emptyProduct); // Reset form
    },
  });

  // DELETE mutation
  const deleteMutation = trpc.products.deleteProduct.useMutation({
    onSuccess: () => utils.products.getProducts.invalidate(),
  });

  // UPDATE mutation
  const updateMutation = trpc.products.updateProduct.useMutation({
    onSuccess: () => {
      utils.products.getProducts.invalidate();
      setEditingId(null); // Close edit mode
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(newProduct);
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm) {
      updateMutation.mutate(editForm);
    }
  };

  if (isLoading) return <div className="p-8">Loading inventory...</div>;

  return (
    <main className="p-8 max-w-6xl mx-auto min-h-screen bg-white text-zinc-900">
      <h1 className="text-3xl font-bold mb-8 text-zinc-800">Product Inventory</h1>

      {/* CREATE FORM */}
      <section className="mb-10 p-6 bg-zinc-50 rounded-xl border border-zinc-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-6 text-zinc-700">Create New Product</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-bold uppercase text-zinc-500">Name</label>
              <input 
                className="p-2 border rounded border-zinc-300 focus:ring-2 focus:ring-zinc-900 outline-none"
                placeholder="Product name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-zinc-500">Price ($)</label>
              <input 
                className="p-2 border rounded border-zinc-300 focus:ring-2 focus:ring-zinc-900 outline-none"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-zinc-500">Category</label>
              <input 
                className="p-2 border rounded border-zinc-300 focus:ring-2 focus:ring-zinc-900 outline-none"
                placeholder="Electronics"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-zinc-500">Stock</label>
              <input 
                className="p-2 border rounded border-zinc-300 focus:ring-2 focus:ring-zinc-900 outline-none"
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                required
              />
            </div>
          <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-zinc-500">Image Path</label>
              <input
                className="p-2 border rounded border-zinc-300 focus:ring-2 focus:ring-zinc-900 outline-none"
                placeholder="/images/product.jpg"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-zinc-500">Description</label>
            <textarea 
              className="p-2 border rounded border-zinc-300 focus:ring-2 focus:ring-zinc-900 outline-none h-20"
              placeholder="Product details..."
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="px-8 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 disabled:bg-zinc-400"
          >
            {addMutation.isPending ? "Creating..." : "Create Product"}
          </button>
        </form>
      </section>

      {/* PRODUCT LIST */}
      <div className="grid gap-6">
        {products?.map((product) => (
          <div key={product.id} className="p-5 border border-zinc-200 rounded-xl bg-white shadow-sm flex flex-col md:flex-row gap-6 transition-all hover:border-zinc-300">

            {/* Product Image Preview */}
            <div className="w-full md:w-32 h-32 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={product.image || "/images/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image" }}
              />
                  </div>

            {editingId === product.id && editForm ? (
              /* EDIT MODE UI */
              <form onSubmit={handleUpdate} className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input
                    className="p-2 border rounded w-full"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                  <input 
                    type="number"
                    className="p-2 border rounded w-full"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})}
                  />
                  <input
                    className="p-2 border rounded w-full"
                    placeholder="Image URL"
                    value={editForm.image}
                    onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                  />
      </div>
                <textarea
                  className="w-full p-2 border rounded h-20"
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                />
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                  <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-zinc-100 rounded">Cancel</button>
                </div>
              </form>
            ) : (
              /* VIEW MODE UI */
              <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 bg-zinc-100 rounded text-zinc-500 uppercase">{product.category}</span>
                    <h3 className="font-bold text-xl">{product.name}</h3>
                  </div>
                  <p className="text-zinc-500 text-sm line-clamp-2 max-w-2xl">{product.description}</p>
                  <div className="flex gap-4 pt-2 font-medium">
                    <span className="text-zinc-900">${product.price}</span>
                    <span className="text-zinc-400 text-sm">Stock: {product.stock}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <button onClick={() => startEditing(product)} className="px-4 py-2 text-sm border rounded-lg hover:bg-zinc-50">Edit</button>
                  <button onClick={() => deleteMutation.mutate({ id: product.id })} className="px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

