// pages/api/analyzeReview.ts

import type { NextApiRequest, NextApiResponse } from 'next';
// Assuming your gemini.ts exports an initialized client like this
import { gemini } from '@/lib/gemini';

type ResponseData = {
  isAiGenerated: boolean | null;
  justification: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
        isAiGenerated: null, 
        justification: 'Method Not Allowed' 
    });
  }

  const { reviewText } = req.body;

  if (!reviewText || typeof reviewText !== 'string') {
    return res.status(400).json({ 
        isAiGenerated: null, 
        justification: 'Review text is required.' 
    });
  }

  try {
    const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `
      Analyze the following review to determine if it was written by an AI.
      1.  Start your response with "Verdict: Yes" or "Verdict: No".
      2.  On a new line, provide a brief justification for your verdict.
      Review: "${reviewText}"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse the structured response from Gemini
    const lines = responseText.split('\n');
    const verdict = lines[0]?.replace('Verdict: ', '').trim().toLowerCase();
    const justification = lines.slice(1).join('\n').trim();

    res.status(200).json({
      isAiGenerated: verdict === 'yes',
      justification: justification || 'No justification provided.',
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      isAiGenerated: null,
      justification: 'An internal server error occurred while analyzing the review.',
      error: (error as Error).message,
    });
  }
}