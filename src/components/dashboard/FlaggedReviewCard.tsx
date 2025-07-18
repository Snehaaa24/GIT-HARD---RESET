import { useState } from 'react';
import { FlaggedReview } from '@/types/dashboard';
import { AlertTriangle, User, CheckCircle, X, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FlaggedReviewCardProps {
  review: FlaggedReview;
}

export const FlaggedReviewCard = ({ review }: FlaggedReviewCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-danger bg-danger-muted';
    if (confidence >= 60) return 'text-warning bg-warning-muted';
    return 'text-muted-foreground bg-muted';
  };

  const truncatedText = review.text.length > 120 ? 
    review.text.substring(0, 120) + '...' : review.text;

  return (
    <div className="bg-surface border border-card-border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{review.reviewerName}</span>
          {review.reviewerVerified && (
            <CheckCircle className="h-4 w-4 text-success" />
          )}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(review.timestamp), { addSuffix: true })}
          </span>
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(review.confidence)}`}>
          {review.confidence}% confidence
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm">
          {showFullText ? review.text : truncatedText}
          {review.text.length > 120 && (
            <button
              onClick={() => setShowFullText(!showFullText)}
              className="ml-2 text-primary text-xs hover:underline"
            >
              {showFullText ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>

        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span className="text-sm text-muted-foreground">
            Flagged for: <span className="font-medium">{review.reason}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-card-border">
        <button className="btn-primary text-xs px-3 py-1">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approve
        </button>
        <button className="btn-secondary text-xs px-3 py-1 text-danger border-danger/20">
          <X className="h-3 w-3 mr-1" />
          Reject
        </button>
        <button className="btn-secondary text-xs px-3 py-1">
          <Eye className="h-3 w-3 mr-1" />
          Investigate
        </button>
      </div>
    </div>
  );
};