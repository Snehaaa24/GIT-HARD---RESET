import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

import { Package, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProductCard } from '@/components/dashboard/ProductCard';

const Index = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalReviews: 0,
    suspiciousReviews: 0,

  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all products
      const { data: productData, error: productErr } = await supabase.from('products').select('*');
      const totalProducts = productData?.length || 0;

      // Fetch all reviews
      const { data: reviewData, error: reviewErr } = await supabase.from('reviews').select('*');
      const totalReviews = reviewData?.length || 0;

      // Fetch suspicious reviews
      const { data: suspiciousData, error: suspErr } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_suspicious', true);
      const suspiciousReviews = suspiciousData?.length || 0;

      // Calculate trust score
      const trustScores = reviewData?.map((r) => r.trust_score || 0);
      const trustScore =
        trustScores.length > 0
          ? (trustScores.reduce((a, b) => a + b, 0) / trustScores.length).toFixed(1)
          : 0;

      setStats({
        totalProducts,
        totalReviews,
        suspiciousReviews,

      });

      setProducts(productData || []);
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex-1">
        <Header />

        <main className="p-6 space-y-8 max-w-7xl mx-auto">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
            <p className="text-muted-foreground text-lg">
              Monitor review authenticity and protect your brand reputation
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Products"
              value={stats.totalProducts.toLocaleString()}
              icon={<Package className="h-6 w-6" />}
            />
            <StatsCard
              title="Reviews Analyzed"
              value={stats.totalReviews.toLocaleString()}
              icon={<FileText className="h-6 w-6" />}
            />
            <StatsCard
              title="Suspicious Reviews"
              value={stats.suspiciousReviews.toLocaleString()}
              icon={<AlertTriangle className="h-6 w-6" />}
            />

          </div>

          {/* Product Cards */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Product Analytics</h2>
              <button className="btn-secondary">View All Products</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {products.map((product: any) => (
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