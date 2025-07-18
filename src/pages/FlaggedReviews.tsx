import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { FlaggedReviewCard } from '../components/dashboard/FlaggedReviewCard';
import { mockDashboardData } from '../data/mockData';
import { Filter, Download, Search } from 'lucide-react';

export default function FlaggedReviews() {
  const [filter, setFilter] = useState('all');
  
  // Get all flagged reviews from all products
  const allFlaggedReviews = mockDashboardData.products.flatMap(product => 
    product.flaggedReviews.map(review => ({
      ...review,
      productName: product.name,
      productId: product.id
    }))
  );

  const filteredReviews = allFlaggedReviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'high') return review.confidence >= 80;
    if (filter === 'medium') return review.confidence >= 60 && review.confidence < 80;
    if (filter === 'low') return review.confidence < 60;
    return true;
  });

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
                <h1 className="text-hero text-foreground mb-2">Flagged Reviews</h1>
                <p className="text-muted-foreground">Review and manage suspicious reviews detected by AI</p>
              </div>
              
              <div className="flex gap-3">
                <select 
                  className="px-4 py-2 border border-border rounded-lg bg-card text-card-foreground"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Confidence</option>
                  <option value="high">High (80%+)</option>
                  <option value="medium">Medium (60-79%)</option>
                  <option value="low">Low (&lt;60%)</option>
                </select>
                <button className="btn-secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="card-premium p-4">
                <div className="text-label">Total Flagged</div>
                <div className="text-stat text-foreground">{allFlaggedReviews.length}</div>
              </div>
              <div className="card-premium p-4">
                <div className="text-label">High Confidence</div>
                <div className="text-stat text-danger">{allFlaggedReviews.filter(r => r.confidence >= 80).length}</div>
              </div>
              <div className="card-premium p-4">
                <div className="text-label">Pending Review</div>
                <div className="text-stat text-warning">{allFlaggedReviews.filter(r => r.confidence >= 60 && r.confidence < 80).length}</div>
              </div>
              <div className="card-premium p-4">
                <div className="text-label">Auto-Approved</div>
                <div className="text-stat text-success">{allFlaggedReviews.filter(r => r.confidence < 60).length}</div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={`${review.productId}-${review.id}`} className="card-premium">
                  <div className="mb-3">
                    <span className="text-sm text-muted-foreground">Product: </span>
                    <span className="font-medium text-foreground">{review.productName}</span>
                  </div>
                  <FlaggedReviewCard review={review} />
                </div>
              ))}

              {filteredReviews.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No flagged reviews found</p>
                  <p className="text-sm">Try adjusting your filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}