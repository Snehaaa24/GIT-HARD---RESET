import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { extractReviewsFromPage } from '@/lib/reviewScraper';
import {analyzeReviews} from './api/review-check'; // ✅ Corrected import for client-side usage

import { Package, FileText, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProductCard } from '@/components/dashboard/ProductCard';
import { Sidebar } from '@/components/layout/Sidebar';

type ReviewData = {
  comment: string;
  score: number;
  reason: string;
  geminiExplanation: string;
};

const Index = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalReviews: 0,
    suspiciousReviews: 0,
  });

  const [products, setProducts] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [plagiarismResults, setPlagiarismResults] = useState<any[]>([]);
  const [loadingPlagiarism, setLoadingPlagiarism] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: productData } = await supabase.from('products').select('*');
      const { data: reviewData } = await supabase.from('reviews').select('*');
      const { data: suspiciousData } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_suspicious', true);

      setStats({
        totalProducts: productData?.length || 0,
        totalReviews: reviewData?.length || 0,
        suspiciousReviews: suspiciousData?.length || 0,
      });

      setProducts(productData || []);
    };

    fetchData();
  }, []);

  const handlePlagiarismCheck = async () => {
    if (!urlInput.trim()) return;

    setLoadingPlagiarism(true);
    setPlagiarismResults([]);
    setConfidence(null);

    try {
      const scrapedReviews = await extractReviewsFromPage(urlInput);
      const { results } = await analyzeReviews(urlInput);
      setPlagiarismResults(results);
      
    } catch (error) { 
      console.error(error);
      setPlagiarismResults([
        { comment: '❌ Error analyzing reviews.', reason: '', score: 0 },
      ]);
    } finally {
      setLoadingPlagiarism(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex-1">
        <Header />

        <main className="p-6 space-y-10 max-w-7xl mx-auto">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
            <p className="text-muted-foreground text-lg">
              Monitor review authenticity and protect your brand reputation
            </p>
          </div>

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

          <div className="space-y-4 border rounded-2xl p-6 shadow bg-card">
            <h3 className="text-xl font-semibold">🧠 Review Integrity Checker</h3>
            <p className="text-muted-foreground">
              Paste a product URL and we’ll analyze its reviews for AI-generated patterns,
              duplicate content, and suspicious behavior.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                className="w-full p-2 border rounded-lg bg-background"
                placeholder="https://example.com/product/123"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <button
                onClick={handlePlagiarismCheck}
                disabled={loadingPlagiarism}
                className="bg-primary text-white px-4 py-2 rounded-lg"
              >
                {loadingPlagiarism ? 'Analyzing...' : 'Check Reviews'}
              </button>
            </div>

            {plagiarismResults.length > 0 && (
              <div className="bg-muted p-4 rounded-lg space-y-4 mt-4 text-sm">
                <div className="font-semibold text-lg text-rose-700">
                  {plagiarismResults.length} suspicious reviews found
                </div>
                {confidence !== null && (
                  <p className="text-muted-foreground">Confidence: {confidence}%</p>
                )}
                <ul className="list-disc pl-5 space-y-3">
                  {plagiarismResults.map((r, i) => (
                    <li key={i}>
                      <p className="font-medium">"{r.comment}"</p>
                      {r.reason && (
                        <p className="text-xs text-muted-foreground">Reason: {r.reason}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Suspicion Score: {r.score}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
