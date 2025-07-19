import google.generativeai as genai
import json

# --- CONFIGURATION ---
# Replace "YOUR_API_KEY_HERE" with your private API key.
api_key = "AIzaSyBIDytxIJRJbGYPB_ZA31MZ_Oe_mMB6R_g"
genai.configure(api_key=api_key)

# Create an instance of a current Gemini model
model = genai.GenerativeModel("gemini-1.5-flash-latest")


# --- FUNCTION TO CHECK TEXT ---
def check_for_ai_text(text_to_check):
    """
    Sends text to the Gemini API for a simple classification and reason.
    """
    print(f"\nAnalyzing text: '{text_to_check[:50]}...'")

    # 1. Updated Prompt: Asks for classification and reason only.
    prompt = f"""
      Analyze the following review. Respond ONLY with a JSON object containing two keys:
      1. "classification": a string, either "AI-Generated" or "Likely Human-Written".
      2. "reason": a brief, one-sentence explanation for your classification.

      Review: "{text_to_check}"
    """

    try:
        # 2. Send the prompt to the model
        response = model.generate_content(prompt)

        # 3. Process the response
        cleaned_text = response.text.replace("```json", "").replace("```", "").strip()
        result_json = json.loads(cleaned_text)

        classification = result_json.get("classification", "Error")
        reason = result_json.get("reason", "Could not determine reason.")

        # 4. Updated Output: Displays the simplified result.
        print(f"Classification: {classification}")
        print(f"Reason: {reason}")
        return classification, reason

    except Exception as e:
        print(f"❌ An error occurred: {e}")
        return None, None


# --- EXAMPLE USAGE ---
if __name__ == "__main__":
    human_sounding_review = "This camera is okay. The battery life isn't great and the pictures are a bit grainy in low light. Disappointed for the price."
    check_for_ai_text(human_sounding_review)

    ai_sounding_review = "This photographic apparatus demonstrates superior performance metrics. Its ergonomic construction and advanced imaging sensor facilitate unparalleled content creation."
    check_for_ai_text(ai_sounding_review)
