# import os
# import re
# import json
# import requests
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import google.generativeai as genai

# # --- CONFIGURATION ---
# OXYLABS_USERNAME = "Snehahah24"
# OXYLABS_PASSWORD = "6b=ArjA35FNG7Lj"
# GEMINI_API_KEY = "AIzaSyBIDytxIJRJbGYPB_ZA31MZ_Oe_mMB6R_g"

# # Configure Flask App
# app = Flask(__name__)
# CORS(app, resources={r"/analyze": {"origins": "chrome-extension://*"}})

# # Configure Gemini API
# genai.configure(api_key=GEMINI_API_KEY)
# gemini_model = genai.GenerativeModel("gemini-1.5-flash-latest")


# # --- HELPER FUNCTIONS ---
# def extract_asin(url):
#     """Extracts the ASIN (product ID) from an Amazon URL."""
#     match = re.search(r"/(?:dp|gp/product)/([A-Z0-9]{10})", url)
#     if match:
#         return match.group(1)
#     return None


# def check_for_ai_text(text_to_check):
#     """Sends text to the Gemini API for classification and reason."""
#     prompt = f"""
#       Analyze the following review. Respond ONLY with a JSON object containing two keys:
#       1. "classification": a string, either "AI-Generated" or "Likely Human-Written".
#       2. "reason": a brief, one-sentence explanation for your classification.

#       Review: "{text_to_check}"
#     """
#     try:
#         response = gemini_model.generate_content(prompt)
#         cleaned_text = response.text.replace("```json", "").replace("```", "").strip()
#         return json.loads(cleaned_text)
#     except Exception as e:
#         print(f"Gemini API Error: {e}")
#         return {"classification": "Error", "reason": "Could not analyze text."}


# # --- MAIN API ROUTE ---
# @app.route("/analyze", methods=["POST"])
# def analyze_reviews():
#     data = request.get_json()
#     product_url = data.get("productUrl")

#     if not product_url:
#         return jsonify({"error": "productUrl not provided"}), 400

#     asin = extract_asin(product_url)
#     if not asin:
#         return (
#             jsonify(
#                 {"error": "Could not find a valid Amazon Product ID (ASIN) in the URL."}
#             ),
#             400,
#         )

#     # --- UPDATED OXYLABS PAYLOAD ---
#     # Changed geo_location to a specific Indian postal code for more precision.
#     payload = {
#         "source": "amazon_product",
#         "domain": "in",  # Specify the amazon.in domain
#         "query": asin,
#         "geo_location": "400001",  # Using Mumbai postal code as an example
#         "parse": True,
#     }

#     try:
#         print(f"Sending request to Oxylabs with payload: {payload}")  # Debug print
#         response = requests.post(
#             "https://realtime.oxylabs.io/v1/queries",
#             auth=(OXYLABS_USERNAME, OXYLABS_PASSWORD),
#             json=payload,
#             timeout=60,
#         )
#         response.raise_for_status()
#         oxylabs_data = response.json()
#         print("Successfully received data from Oxylabs.")  # Debug print
#     except requests.exceptions.RequestException as e:
#         print(f"Oxylabs API Error: {e}")
#         return jsonify({"error": "Failed to fetch data from Oxylabs."}), 500

#     reviews_from_api = (
#         oxylabs_data.get("results", [{}])[0].get("content", {}).get("reviews", [])
#     )
#     if not reviews_from_api:
#         return jsonify({"error": "No reviews found for this product via Oxylabs."}), 404

#     final_analysis = []
#     # Limiting to 5 reviews to speed up testing and stay within API limits
#     for review in reviews_from_api[:5]:
#         review_text = review.get("content", "")
#         review_rating = review.get("rating", 0)

#         if not review_text:
#             continue

#         ai_check_result = check_for_ai_text(review_text)
#         final_analysis.append(
#             {
#                 "review_text": review_text,
#                 "rating": review_rating,
#                 "ai_classification": ai_check_result.get("classification"),
#                 "ai_reason": ai_check_result.get("reason"),
#             }
#         )

#     return jsonify(
#         {
#             "productUrl": product_url,
#             "productTitle": oxylabs_data.get("results", [{}])[0]
#             .get("content", {})
#             .get("title", "Product"),
#             "classification": (
#                 "Suspicious"
#                 if any(r["ai_classification"] == "AI-Generated" for r in final_analysis)
#                 else "Likely Genuine"
#             ),
#             "flags": {
#                 "AI-Generated Text": {
#                     "description": f"{sum(1 for r in final_analysis if r['ai_classification'] == 'AI-Generated')} reviews flagged as AI-written.",
#                     "pass": not any(
#                         r["ai_classification"] == "AI-Generated" for r in final_analysis
#                     ),
#                 },
#             },
#             "suspiciousSnippet": next(
#                 (
#                     r["review_text"]
#                     for r in final_analysis
#                     if r["ai_classification"] == "AI-Generated"
#                 ),
#                 None,
#             ),
#             "reviewCount": len(reviews_from_api),
#         }
#     )


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5001, debug=True)
import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

# --- CONFIGURATION ---
# It's best practice to use environment variables for credentials.
# Replace "YOUR_GEMINI_API_KEY" with your actual key for testing.
GEMINI_API_KEY = "AIzaSyBIDytxIJRJbGYPB_ZA31MZ_Oe_mMB6R_g"

# Configure Flask App
app = Flask(__name__)
# Allow requests from your Chrome extension to the specific endpoint
CORS(app, resources={r"/check_single_review": {"origins": "chrome-extension://*"}})

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-1.5-flash-latest")


# --- HELPER FUNCTION ---
def check_for_ai_text(text_to_check):
    """Sends text to the Gemini API for classification and reason."""
    prompt = f"""
      Analyze the following review. Respond ONLY with a JSON object containing two keys:
      1. "classification": a string, either "AI-Generated" or "Likely Human-Written".
      2. "reason": a brief, one-sentence explanation for your classification.

      Review: "{text_to_check}"
    """
    try:
        response = gemini_model.generate_content(prompt)
        cleaned_text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned_text)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {"classification": "Error", "reason": "Could not analyze text."}


# --- API ROUTE FOR MANUAL CHECKING ---
@app.route("/check_single_review", methods=["POST"])
def check_single_review():
    data = request.get_json()
    review_text = data.get("reviewText")

    if not review_text:
        return jsonify({"error": "reviewText not provided"}), 400

    # Get AI analysis for the provided review text
    ai_check_result = check_for_ai_text(review_text)

    # Send the result back to the extension
    return jsonify(ai_check_result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
