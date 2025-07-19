import * as cheerio from 'cheerio';

type ReviewData = {
  comment: string;
  trust_score?: number;
  suspicion_reason?: string;
  is_suspicious?: boolean;
};

export async function extractReviewsFromPage(url: string): Promise<ReviewData[]> {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const reviews: ReviewData[] = [];

    // Universal selectors for product reviews on common eCommerce sites
    const selectors = [
      '.review-text-content span',             // Amazon
      '.a-size-base.review-text.review-text-content span', // Amazon (alt)
      '.review-content',                       // Flipkart / generic
      '.review, .comment',                     // Generic
    ];

    selectors.forEach(selector => {
      $(selector).each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 20) {
          reviews.push({ comment: text });
        }
      });
    });

    // Deduplicate
    const uniqueReviews = Array.from(
      new Map(reviews.map((r) => [r.comment, r])).values()
    );

    return uniqueReviews;
  } catch (error) {
    console.error('❌ Error scraping reviews:', error);
    return [];
  }
}
