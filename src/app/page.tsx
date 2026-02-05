'use client';

import { trpc } from '@/utils/trpc';

export default function Home() {
  // We call our "getProducts" procedure
  const productsQuery = trpc.products.getProducts.useQuery();

  if (productsQuery.isLoading) return <p>Loading products...</p>;
  if (productsQuery.error) return <p>Error: {productsQuery.error.message}</p>;

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Product Dashboard</h1>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {productsQuery.data?.map((product: any) => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>In Stock:</strong> {product.stock}</p>
          </div>
        ))}
      </div>
    </main>
  );
}