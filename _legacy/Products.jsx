const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { Skeleton } from '@/components/ui/skeleton';

export default function Products() {
  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get('category') || '';

  const [filters, setFilters] = useState({
    category: initialCategory,
    capacity: '',
    material: '',
    wall_type: '',
    surface_type: '',
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => db.entities.Product.list('-created_date', 100),
  });

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (filters.category && p.category !== filters.category) return false;
      if (filters.capacity && p.capacity !== filters.capacity) return false;
      if (filters.material && p.material !== filters.material) return false;
      if (filters.wall_type && p.wall_type !== filters.wall_type) return false;
      if (filters.surface_type && p.surface_type !== filters.surface_type) return false;
      return true;
    });
  }, [products, filters]);

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({ category: '', capacity: '', material: '', wall_type: '', surface_type: '' });

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            محصولات
          </h1>
          <p className="text-lg text-muted-foreground">
            کاتالوگ کامل لیوانها و لوازم جانبی قابل سفارشیسازی
          </p>
        </div>

        <div className="flex lg:gap-12">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28">
              <ProductFilters filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
            </div>
          </div>

          <div className="flex-1">
            <div className="lg:hidden mb-6">
              <ProductFilters filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
            </div>

            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-muted-foreground">
                {isLoading ? 'در حال بارگذاری...' : `${filtered.length} محصول`}
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="aspect-square rounded-3xl mb-4" />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-2">محصولی یافت نشد</p>
                <button onClick={clearFilters} className="text-sm text-cobalt hover:underline">
                  حذف همه فیلترها
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}