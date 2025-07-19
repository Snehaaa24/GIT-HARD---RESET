import React from 'react';
import AIReviewDetector from '../components/AIReviewchecker';

const ReviewCheckerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <AIReviewDetector />
      </div>
    </div>
  );
};

export default ReviewCheckerPage;