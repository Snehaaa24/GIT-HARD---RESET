// pages/FlaggedReviews.tsx

import AiReviewChecker from '@/components/AIReviewchecker'; // 👈 Import the component

export default function FlaggedReviews() {
  
  // ... your existing logic and JSX for displaying flagged reviews

  return (
    <div>
      <h1>Flagged Reviews</h1>
      
      {/* Your existing list of flagged reviews would go here */}

      <hr style={{ margin: '2rem 0' }} />

      {/* 👇 Add the AI checker component to the page */}
      <AiReviewChecker />

    </div>
  );
}