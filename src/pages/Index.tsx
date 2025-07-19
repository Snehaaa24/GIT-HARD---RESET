import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Package, FileText, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProductCard } from '@/components/dashboard/ProductCard';
import { Sidebar } from '@/components/layout/Sidebar';

// More specific interfaces for each analysis type
interface UrlAnalysisItem {
  review: string;
  isAI: boolean;
  justification: string;
}

interface TextAnalysisResult {
  isAiGenerated: boolean;
  confidence: number;
  analysis: string;
  reasons: string[];
}

const Index = () => {
  // Unchanged dashboard state
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalReviews: 0,
    suspiciousReviews: 0,
  });
  const [products, setProducts] = useState<any[]>([]);

  // Refactored state for the integrity checker
  const [activeTab, setActiveTab] = useState<'url' | 'text'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [reviewText, setReviewText] = useState('');
  
  const [urlAnalysis, setUrlAnalysis] = useState<{ results: UrlAnalysisItem[]; confidence: number | null }>({ results: [], confidence: null });
  const [textAnalysis, setTextAnalysis] = useState<TextAnalysisResult | null>(null);

  const [loading, setLoading] = useState({ url: false, text: false });
  const [error, setError] = useState({ url: '', text: '' });


  useEffect(() => {
    const fetchData = async () => { //huinjinhhhjbhbh
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

  // --- Refactored Analysis Handlers ---

  const handleUrlAnalysis = async () => {
    if (!urlInput.trim()) return;

    setLoading({ ...loading, url: true });
    setUrlAnalysis({ results: [], confidence: null });
    setError({ ...error, url: '' });

    try {
      // Using a more descriptive API endpoint name
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch or analyze the URL.');
      }

      const data = await response.json();
      const avgConfidence = Math.round(
        data.results.reduce((acc: number, r: UrlAnalysisItem) => acc + (r.isAI ? 100 : 0), 0) / data.results.length
      ) || 0;
      
      setUrlAnalysis({ results: data.results, confidence: avgConfidence });

    } catc  h (err) {
      console.error(err);
      setError({ ...error, url: 'Failed to analyze reviews from URL. Please check the URL and try again.' });
    } finally {
      setLoading({ ...loading, url: false });
    }
  };

  const handleTextAnalysis = async () => {
    if (!reviewText.trim()) return;
    
    setLoading({ ...loading, text: true });
    setTextAnalysis(null);
    setError({ ...error, text: '' });

    try {
      // Using a more descriptive API endpoint name
      const response = await fetch('/api/analyzereview', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ reviewText: reviewText.trim() }),
      }); 

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An unknown error occurred.');
      }

      const data = await response.json();
      setTextAnalysis(data); // API response directly matches the state structure
    } catch (err: any) {
      setError({ ...error, text: err.message || 'Failed to analyze the review. Please try again.' });
      console.error('Error:', err);
    } finally {
      setLoading({ ...loading, text: false });
    }
  };

  const handleClearText = () => {
    setReviewText('');
    setTextAnalysis(null);
    setError({ ...error, text: '' });
  };

  // --- Refactored Helper Functions ---

  const getResultColor = (result: TextAnalysisResult | null) => {
    if (!result) return 'text-gray-600';
    return result.isAiGenerated ? 'text-red-600' : 'text-green-600';
  };

  const getResultIcon = (result: TextAnalysisResult | null) => {
    if (!result) return null;
    return result.isAiGenerated ? (
      <XCircle className="w-6 h-6 text-red-600" />
    ) : (
      <CheckCircle className="w-6 h-6 text-green-600" />
    );
  };
  
  const getConfidenceBarColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-red-500';
    if (confidence >= 60) return 'bg-orange-500';
    if (confidence >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getConfidenceLevelText = (confidence: number) => {
    if (confidence >= 80) return 'Very High';
    if (confidence >= 60) return 'High';
    if (confidence >= 40) return 'Medium';
    return 'Low';
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

          {/* --- Refactored Review Integrity Checker --- */}
          <div className="space-y-4 border rounded-2xl p-6 shadow bg-card">
            <h3 className="text-xl font-semibold">🧠 Review Integrity Checker</h3>
            <p className="text-muted-foreground">
              Analyze reviews for AI-generated patterns, duplicate content, and suspicious behavior.
            </p>

            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('url')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'url'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Analyze URL
              </button>
              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'text'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Analyze Text
              </button>
            </div>

            {activeTab === 'url' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg bg-background"
                    placeholder="https://example.com/product/123"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                  <button
                    onClick={handleUrlAnalysis}
                    disabled={loading.url || !urlInput.trim()}
                    className="bg-primary text-white px-4 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading.url && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading.url ? 'Analyzing...' : 'Check Reviews'}
                  </button>
                </div>
                
                {error.url && <p className="text-red-600 text-sm">{error.url}</p>}

                {urlAnalysis.results.length > 0 && (
                  <div className="bg-muted p-4 rounded-lg space-y-4 mt-4 text-sm">
                    <div className="font-semibold text-lg text-rose-700">
                      {urlAnalysis.results.filter((r) => r.isAI).length} suspicious (AI) reviews found
                    </div>
                    {urlAnalysis.confidence !== null && (
                      <p className="text-muted-foreground">Overall Confidence: {urlAnalysis.confidence}% AI likelihood</p>
                    )}
                    <ul className="list-disc pl-5 space-y-4">
                      {urlAnalysis.results.map((r, i) => (
                        <li key={i}>
                          <p className="font-medium">"{r.review}"</p>
                          <p className="text-xs text-muted-foreground">
                            AI-Generated: <strong>{r.isAI ? 'Yes' : 'No'}</strong>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Justification: {r.justification}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="review-text" className="block text-sm font-medium text-foreground mb-2">Review Text</label>
                  <textarea
                    id="review-text"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Paste the review text here..."
                    className="w-full h-32 px-4 py-3 border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    maxLength={2000}
                  />
                  <div className="text-right text-sm text-muted-foreground mt-1">{reviewText.length}/2000</div>
                </div>

                {error.text && <p className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error.text}</p>}

                <div className="flex gap-3">
                  <button
                    onClick={handleTextAnalysis}
                    disabled={!reviewText.trim() || loading.text}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading.text ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                    {loading.text ? 'Checking...' : 'Check Review'}
                  </button>
                  <button
                    onClick={handleClearText}
                    className="px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    Clear
                  </button>
                </div>

                {textAnalysis && (
                  <div className="bg-card border rounded-lg p-6 space-y-6">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      {getResultIcon(textAnalysis)} Analysis Results
                    </h4>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 border-l-4 border-blue-500 bg-blue-50/50 rounded">
                        <h5 className="font-semibold mb-2">Assessment</h5>
                        <p className={`text-lg font-bold ${getResultColor(textAnalysis)}`}>
                          {textAnalysis.isAiGenerated ? 'AI-Generated' : 'Human-Written'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">Confidence: {textAnalysis.confidence}%</p>
                      </div>

                      <div className="p-4 border-l-4 border-purple-500 bg-purple-50/50 rounded">
                        <h5 className="font-semibold mb-2">Confidence Level</h5>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-muted rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-500 ${getConfidenceBarColor(textAnalysis.confidence)}`}
                              style={{ width: `${textAnalysis.confidence}%` }}
                            ></div>
                          </div>
                          <span className="font-bold">{textAnalysis.confidence}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{getConfidenceLevelText(textAnalysis.confidence)} Confidence</p>
                      </div>
                    </div>

                    <div className="p-4 border-l-4 border-orange-500 bg-orange-50/50 rounded">
                      <h5 className="font-semibold mb-3">AI Analysis</h5>
                      <p className="text-sm leading-relaxed">{textAnalysis.analysis}</p>
                    </div>

                    {textAnalysis.reasons && textAnalysis.reasons.length > 0 && (
                      <div className={`p-4 border-l-4 rounded ${textAnalysis.isAiGenerated ? 'border-red-500 bg-red-50/50' : 'border-green-500 bg-green-50/50'}`}>
                        <h5 className="font-semibold mb-3">
                          {textAnalysis.isAiGenerated ? 'AI Generation Indicators' : 'Human Writing Characteristics'}
                        </h5>
                        <ul className="space-y-2">
                          {textAnalysis.reasons.map((reason, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${textAnalysis.isAiGenerated ? 'bg-red-500' : 'bg-green-500'}`}></span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="p-4 bg-muted rounded-lg">
                      <h5 className="font-semibold mb-2">Important Note</h5>
                      <p className="text-sm text-muted-foreground">
                        This analysis uses advanced AI detection powered by Google's Gemini API to identify patterns typical of AI-generated content. While highly accurate, results should be considered as part of a broader content authenticity assessment strategy.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index; 