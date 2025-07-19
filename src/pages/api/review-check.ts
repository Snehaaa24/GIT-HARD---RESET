import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyCjU0OTTvgH1K_HQpGW_di2XsF5hnsqqvk');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

interface ReviewData {
  comment: string;
  score: number;
  reason: string;
  geminiExplanation: string;
  confidence: number;
}

interface AnalysisResult {
  suspiciousCount: number;
  totalReviews: number;
  results: ReviewData[];
  overallConfidence: number;
  summary: string;
}

// Enhanced review extraction with better selectors
const extractReviewsFromPage = async (url: string, maxReviews = 15): Promise<string[]> => {
  try {
    // Ensure URL has protocol
    const safeUrl = url.startsWith('http') ? url : `https://${url}`;
    
    const response = await fetch(safeUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const reviews: string[] = [];
    
    // Comprehensive selectors for different e-commerce platforms
    const selectors = [
      // Amazon
      '[data-hook="review-body"] span',
      '.review-text-content span',
      '.a-size-base.review-text.review-text-content span',
      '.cr-original-review-text',
      
      // Flipkart
      '.qwjRop',
      '._6K-7Co',
      '.t-ZTKy',
      
      // Generic e-commerce
      '.review-content',
      '.review-text',
      '.review-body',
      '.review-comment',
      '.user-review',
      '.customer-review',
      '.review-description',
      
      // Shopify/WooCommerce
      '.woocommerce-review__text',
      '.review-body p',
      '.review-content p',
      
      // eBay
      '.reviews .ebay-review-text',
      '.ebay-review-item-content',
      
      // Generic fallbacks
      '[class*="review"] p',
      '[class*="comment"] p',
      '[data-testid*="review"]'
    ];

    // Extract reviews using multiple selectors
    for (const selector of selectors) {
      $(selector).each((_, element) => {
        const text = $(element).text().trim();
        // Filter out short, irrelevant text and duplicates
        if (text.length > 25 && text.length < 2000 && !reviews.includes(text)) {
          // Skip navigation elements and common non-review text
          const skipPatterns = [
            /^(verified purchase|helpful|not helpful|yes|no|report|share)$/i,
            /^(read more|show less|see all|view all)$/i,
            /^\d+(\.\d+)?\s*(stars?|out of|\/)/i,
            /^(color:|size:|style:)/i
          ];
          
          const shouldSkip = skipPatterns.some(pattern => pattern.test(text));
          if (!shouldSkip) {
            reviews.push(text);
          }
        }
      });
      
      // Break if we have enough reviews
      if (reviews.length >= maxReviews) break;
    }

    console.log(`Extracted ${reviews.length} reviews from ${url}`);
    return reviews.slice(0, maxReviews);
    
  } catch (error) {
    console.error('Error extracting reviews:', error);
    throw new Error(`Failed to extract reviews: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Enhanced AI prompt for better detection
const buildAnalysisPrompt = (reviews: string[]) => `
You are an expert AI system specialized in detecting fake, AI-generated, or suspicious product reviews. 

Analyze each review for the following red flags:
1. AI-generated patterns (repetitive structure, unnatural phrasing)
2. Generic language without specific product details
3. Overly positive/negative sentiment without justification
4. Template-like structure or formatting
5. Duplicate or near-duplicate content
6. Suspicious timing patterns (if detectable)
7. Lack of personal experience details

For each review, provide:
- comment: the exact review text
- score: 0-100 (0=definitely authentic, 100=definitely fake)
- reason: specific reason for suspicion (max 100 chars)
- confidence: your confidence level in this assessment (0-100)

Return ONLY valid JSON in this exact format:
{
  "reviews": [
    {
      "comment": "review text here",
      "score": 85,
      "reason": "Generic language, no specific details",
      "confidence": 92
    }
  ],
  "summary": "Brief overall assessment of review authenticity"
}

Reviews to analyze:
${JSON.stringify(reviews, null, 2)}
`;

// Main analysis function
export async function analyzeReviews(url: string): Promise<AnalysisResult> {
  try {
    // Extract reviews from the URL
    const reviews = await extractReviewsFromPage(url);
    
    if (!reviews || reviews.length === 0) {
      throw new Error('No reviews found on the provided URL');
    }

    console.log(`Analyzing ${reviews.length} reviews...`);

    // Get initial analysis from Gemini
    const prompt = buildAnalysisPrompt(reviews);
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    let analysis: {
      reviews: Array<{
        comment: string;
        score: number;
        reason: string;
        confidence: number;
      }>;
      summary: string;
    };

    try {
      // Clean the response to extract JSON
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      analysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', rawText);
      throw new Error('AI returned invalid response format');
    }

    // Filter suspicious reviews (score >= 60)
    const suspiciousReviews = analysis.reviews.filter(item => item.score >= 60);

    // Get detailed explanations for suspicious reviews
    const reviewsWithExplanations = await Promise.all(
      suspiciousReviews.map(async (item, index) => {
        try {
          const explainPrompt = `
Provide a detailed but concise explanation (2-3 sentences) of why this review appears to be fake or AI-generated:

Review: "${item.comment}"
Initial reason: ${item.reason}
Suspicion score: ${item.score}

Focus on specific linguistic patterns, lack of authenticity markers, or other red flags.
`;

          const explanationResult = await model.generateContent(explainPrompt);
          const explanation = explanationResult.response.text().trim();
          
          return {
            ...item,
            geminiExplanation: explanation
          };
        } catch (error) {
          console.error(`Failed to get explanation for review ${index}:`, error);
          return {
            ...item,
            geminiExplanation: 'Unable to generate detailed explanation due to API error.'
          };
        }
      })
    );

    // Calculate overall confidence
    const avgConfidence = analysis.reviews.length > 0 
      ? analysis.reviews.reduce((sum, r) => sum + r.confidence, 0) / analysis.reviews.length
      : 0;

    return {
      suspiciousCount: reviewsWithExplanations.length,
      totalReviews: reviews.length,
      results: reviewsWithExplanations,
      overallConfidence: Math.round(avgConfidence),
      summary: analysis.summary || 'Analysis completed successfully'
    };

  } catch (error) {
    console.error('Review analysis error:', error);
    throw error;
  }
}

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { url } = req.body;

  // Validate input
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Valid URL is required' });
  }

  // Basic URL validation
  try {
    const testUrl = url.startsWith('http') ? url : `https://${url}`;
    new URL(testUrl);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  try {
    console.log(`Starting analysis for URL: ${url}`);
    const analysis = await analyzeReviews(url);
    
    return res.status(200).json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('API Handler Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return res.status(500).json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
}