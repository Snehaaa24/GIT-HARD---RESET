// pages/api/analyze-text.ts

import type { NextApiRequest, NextApiResponse } from 'next';

interface TextAnalysisResult {
  isAiGenerated: boolean;
  confidence: number;
  analysis: string;
  reasons: string[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TextAnalysisResult | { error: string }>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reviewText } = req.body;

  // Validate input
  if (!reviewText || typeof reviewText !== 'string' || reviewText.trim().length === 0) {
    return res.status(400).json({ error: 'Review text is required' });
  }

  if (reviewText.length > 2000) {
    return res.status(400).json({ error: 'Review text too long (max 2000 characters)' });
  }

  console.log("✅ /api/analyze-text endpoint called with text:", reviewText.substring(0, 100) + "...");

  // Simulate different responses based on content for testing
  const text = reviewText.toLowerCase();
  let fakeData: TextAnalysisResult;

  if (text.includes('amazing') && text.includes('perfect') && text.includes('recommend')) {
    // Simulate AI-generated response
    fakeData = {
      isAiGenerated: true,
      confidence: 88,
      analysis: "This review exhibits several characteristics typical of AI-generated content, including overly positive language, generic phrasing, and a structured format that suggests automated generation.",
      reasons: [
        "Excessive use of superlative adjectives without specific details",
        "Generic praise patterns commonly found in AI-generated reviews",
        "Lack of personal experience details or specific product features",
        "Formulaic sentence structure typical of language models"
      ]
    };
  } else if (text.includes('terrible') || text.includes('awful') || text.includes('worst')) {
    // Simulate another AI-generated response
    fakeData = {
      isAiGenerated: true,
      confidence: 92,
      analysis: "This review shows strong indicators of AI generation, particularly in its extreme negative sentiment and lack of constructive criticism or specific details about the product experience.",
      reasons: [
        "Extreme negative language without balanced perspective",
        "Generic complaints without specific product details",
        "Suspicious uniformity in sentence structure",
        "Lack of authentic personal experience markers"
      ]
    };
  }

  // Simulate API processing time
  setTimeout(() => {
    return res.status(200).json(fakeData);
  }, 1000);
}