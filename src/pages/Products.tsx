import React from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { ProductCard } from '../components/dashboard/ProductCard';
import { mockDashboardData } from '../data/mockData';
import { Plus, Filter, Download } from 'lucide-react';

export default function Products() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-hero text-foreground mb-2">Products</h1>
                <p className="text-muted-foreground">Manage and monitor your product reviews</p>
              </div>
              
              <div className="flex gap-3">
                <button className="btn-secondary">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
                <button className="btn-secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockDashboardData.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}