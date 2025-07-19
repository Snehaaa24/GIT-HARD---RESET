/**
 * Extract ASIN from Amazon product URL
 */
function extractASIN() {
  const url = window.location.href;

  // Common Amazon URL patterns for ASIN extraction
  const asinPatterns = [
    /\/dp\/([A-Z0-9]{10})/i, // /dp/B0CT9552BL
    /\/product\/([A-Z0-9]{10})/i, // /product/B0CT9552BL
    /\/gp\/product\/([A-Z0-9]{10})/i, // /gp/product/B0CT9552BL
    /asin=([A-Z0-9]{10})/i, // ?asin=B0CT9552BL
    /\/([A-Z0-9]{10})(?:\/|\?|$)/i, // /B0CT9552BL/ or /B0CT9552BL?
  ];

  for (const pattern of asinPatterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Fetch reviews from Oxylabs API
 */
async function fetchReviewsFromAPI(asin, maxPages = 3) {
  // Replace with your actual Oxylabs credentials
  const USERNAME = "Snehahah24_1ixm3"; // Your Oxylabs username
  const PASSWORD = "6b=ArjA35FNG7Lj"; // Replace with your actual password
  const API_URL = "https://realtime.oxylabs.io/v1/queries";

  const allReviews = [];

  try {
    // Create authentication header
    const auth = btoa(`${USERNAME}:${PASSWORD}`);

    for (let page = 1; page <= maxPages; page++) {
      console.log(`Fetching reviews page ${page} for ASIN: ${asin}`);

      const requestBody = {
        source: "amazon_reviews",
        query: asin,
        geo_location: "90210", // US location
        parse: true,
        pages: page,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();

      // Extract reviews from Oxylabs response structure
      const reviews = data?.results?.[0]?.content?.reviews || [];

      if (reviews.length === 0) {
        console.log(`No more reviews found at page ${page}`);
        break;
      }

      // Transform Oxylabs data to match our expected format
      const transformedReviews = reviews.map((review) => ({
        title: review.title || "",
        text: review.content || review.text || "",
        url: review.url || "",
        stars: review.rating || review.star_rating || "",
        date: review.date || review.review_date || "",
        author: review.author || review.reviewer_name || "",
        verified: review.verified_purchase || false,
        helpful_votes: review.helpful_votes || 0,
      }));

      allReviews.push(...transformedReviews);

      console.log(
        `Successfully retrieved page ${page} with ${reviews.length} reviews`
      );

      // Add a small delay to be respectful to the API
      if (page < maxPages) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return allReviews;
  } catch (error) {
    console.error("Error fetching reviews from Oxylabs API:", error);
    throw error;
  }
}

/**
 * Main function to get reviews - either from API or fallback to scraping
 */
async function getReviews() {
  try {
    // First, try to get ASIN and fetch from API
    const asin = extractASIN();

    if (asin) {
      console.log(`Found ASIN: ${asin}, fetching from API...`);

      try {
        const apiReviews = await fetchReviewsFromAPI(asin);
        console.log(
          `Successfully fetched ${apiReviews.length} reviews from API`
        );
        return {
          source: "api",
          asin: asin,
          reviews: apiReviews,
          totalCount: apiReviews.length,
        };
      } catch (apiError) {
        console.warn("API fetch failed, falling back to scraping:", apiError);
        // Fall through to scraping fallback
      }
    } else {
      console.warn("Could not extract ASIN from URL, falling back to scraping");
    }

    // Fallback to original scraping method
    const scrapedReviews = scrapeReviewsFromDOM();
    return {
      source: "scraping",
      asin: asin || "unknown",
      reviews: scrapedReviews,
      totalCount: scrapedReviews.length,
    };
  } catch (error) {
    console.error("Error in getReviews:", error);
    return {
      source: "error",
      asin: "unknown",
      reviews: [],
      totalCount: 0,
      error: error.message,
    };
  }
}

/**
 * Original DOM scraping function (renamed and kept as fallback)
 */
function scrapeReviewsFromDOM() {
  const reviewElements = document.querySelectorAll('[data-hook="review"]');
  const reviews = [];

  reviewElements.forEach((reviewEl) => {
    const reviewData = {};

    // Extract star rating
    const starEl = reviewEl.querySelector('[data-hook="review-star-rating"]');
    if (starEl) {
      reviewData.stars = starEl.textContent.trim();
    }

    // Extract review text
    const bodyEl = reviewEl.querySelector('[data-hook="review-body"]');
    if (bodyEl) {
      reviewData.text = bodyEl.textContent.trim();
    }

    // Extract review date
    const dateEl = reviewEl.querySelector('[data-hook="review-date"]');
    if (dateEl) {
      reviewData.date = dateEl.textContent.trim();
    }

    // Extract review title
    const titleEl = reviewEl.querySelector('[data-hook="review-title"]');
    if (titleEl) {
      reviewData.title = titleEl.textContent.trim();
    }

    // Add the extracted data to our list if it contains text
    if (reviewData.text) {
      reviews.push(reviewData);
    }
  });

  return reviews;
}

// Execute the main function and send results back to popup
getReviews()
  .then((result) => {
    chrome.runtime.sendMessage({
      type: "SCRAPED_DATA",
      data: result.reviews,
      source: result.source,
      asin: result.asin,
      totalCount: result.totalCount,
      error: result.error || null,
    });
  })
  .catch((error) => {
    console.error("Failed to get reviews:", error);
    chrome.runtime.sendMessage({
      type: "SCRAPED_DATA",
      data: [],
      source: "error",
      asin: "unknown",
      totalCount: 0,
      error: error.message,
    });
  });
