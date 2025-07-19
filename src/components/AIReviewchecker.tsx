// components/AiReviewChecker.tsx

import React, { useState } from 'react';

// Define the shape of the API response data
interface AnalysisResult {
  isAiGenerated: boolean | null;
  justification: string;
}

export default function AiReviewChecker() {
  const [reviewText, setReviewText] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
        setError('Please enter a review to analyze.');
        return;
    }
    
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/analyzereview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewText }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);

    } catch (err) {
      setError('Failed to get analysis. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', border: '1px solid #333', borderRadius: '8px' }}>
      <h3>🤖 AI Content Detector</h3>
      <form onSubmit={handleAnalysis}>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Paste review here to check for AI generation..."
          rows={7}
          style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze Review'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4>Analysis Result:</h4>
          <p>
            <strong>Likely AI-Generated:</strong>{' '}
            {result.isAiGenerated === null ? 'Uncertain' : result.isAiGenerated ? '✅ Yes' : '❌ No'}
          </p>
          <p>
            <strong>Justification:</strong>
          </p>
          <p style={{ whiteSpace: 'pre-wrap', background: '#222', padding: '1rem', borderRadius: '4px' }}>
            {result.justification}
          </p>
        </div>
      )}
    </div>
  );
}