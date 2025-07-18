import { Package, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProductCard } from '@/components/dashboard/ProductCard';
import { mockDashboardData } from '@/data/mockData';

const Index = () => {
  const { stats, products } = mockDashboardData;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6 space-y-8 max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
            <p className="text-muted-foreground text-lg">
              Monitor review authenticity and protect your brand reputation
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Products"
              value={stats.totalProducts.toLocaleString()}
              trend={{ value: 12.5, isPositive: true }}
              icon={<Package className="h-6 w-6" />}
            />
            <StatsCard
              title="Reviews Analyzed"
              value={stats.totalReviews.toLocaleString()}
              trend={{ value: 8.2, isPositive: true }}
              icon={<FileText className="h-6 w-6" />}
            />
            <StatsCard
              title="Suspicious Reviews"
              value={stats.suspiciousReviews.toLocaleString()}
              trend={{ value: 3.1, isPositive: false }}
              icon={<AlertTriangle className="h-6 w-6" />}
            />
            <StatsCard
              title="Trust Score"
              value={`${stats.trustScore}%`}
              trend={{ value: 2.4, isPositive: true }}
              icon={<TrendingUp className="h-6 w-6" />}
              gradient
            />
          </div>

          {/* Products Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Product Analytics</h2>
              <button className="btn-secondary">
                View All Products
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
