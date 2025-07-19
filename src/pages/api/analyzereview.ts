// pages/api/analyzeReview.ts

import type { NextApiRequest, NextApiResponse } from 'next';
// Assuming your gemini.ts exports an initialized client like this
import { gemini } from '@/lib/gemini';

// This interface should match the frontend's TextAnalysisResult
interface ResponseData {
  isAiGenerated: boolean;
  confidence: number;
  analysis: string;
  reasons: string[];
  error?: string; // Optional error field
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { reviewText } = req.body;

  if (!reviewText || typeof reviewText !== 'string') {
    return res.status(400).json({ error: 'Review text is required.' });
  }

  try {
    // Using a model that supports JSON output might be better if available,
    // but we can construct a reliable prompt for standard models.
    const model = gemini.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Analyze the following review to determine if it was written by an AI. 
      Respond with ONLY a valid JSON object matching this structure:
      {
        "isAiGenerated": boolean, // true if AI-generated, false if human-written
        "confidence": number, // A value from 0 to 100 representing your confidence
        "analysis": "string", // A brief, neutral, one-paragraph analysis of the text's characteristics
        "reasons": ["string"] // A list of 3-5 bullet-point reasons supporting your verdict
      }

      Review: "${reviewText}"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean the response to ensure it's a valid JSON string
    const jsonString = responseText.replace(/```json|```/g, '').trim();
    const parsedResponse: ResponseData = JSON.parse(jsonString);

    res.status(200).json(parsedResponse);

  } catch (error) {
    console.error('Gemini API Error or JSON parsing failed:', error);
    res.status(500).json({
      error: 'An internal server error occurred while analyzing the review.',
    });
  }
}