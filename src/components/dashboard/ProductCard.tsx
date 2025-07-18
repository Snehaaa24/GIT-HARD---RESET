import { useState } from 'react';
import { Product } from '@/types/dashboard';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { FlaggedReviewCard } from './FlaggedReviewCard';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTrustScoreColor = (score: number) => {
    if (score >= 95) return 'trust-excellent';
    if (score >= 90) return 'trust-good';
    if (score >= 80) return 'trust-warning';
    return 'trust-poor';
  };

  const getTrustScoreLabel = (score: number) => {
    if (score >= 95) return 'Excellent';
    if (score >= 90) return 'Good';
    if (score >= 80) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="card-premium overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="text-card-title mb-2">{product.name}</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-label">Total Reviews</p>
                <p className="text-lg font-semibold">{product.totalReviews.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-label">Flagged Reviews</p>
                <p className="text-lg font-semibold text-warning">{product.suspiciousReviews}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getTrustScoreColor(product.trustScore)}`}>
                  {product.trustScore}% {getTrustScoreLabel(product.trustScore)}
                </div>
                {product.trustScore >= 95 ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-warning" />
                )}
              </div>
              
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="btn-secondary gap-2"
              >
                View Details
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-card-border bg-muted/30">
          <div className="p-6">
            <h4 className="text-lg font-semibold mb-4">Flagged Reviews</h4>
            {product.flaggedReviews.length > 0 ? (
              <div className="space-y-4">
                {product.flaggedReviews.map((review) => (
                  <FlaggedReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No flagged reviews found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};