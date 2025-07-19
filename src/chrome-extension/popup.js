document.addEventListener("DOMContentLoaded", () => {
  const analyzeButton = document.getElementById("analyze-button");
  const reviewInput = document.getElementById("review-input");
  const resultContainer = document.getElementById("result-container");
  const resultClassification = document.getElementById("result-classification");
  const resultReason = document.getElementById("result-reason");

  analyzeButton.addEventListener("click", async () => {
    const reviewText = reviewInput.value;
    if (!reviewText.trim()) {
      alert("Please paste a review into the text box.");
      return;
    }

    // --- Show loading state ---
    analyzeButton.disabled = true;
    analyzeButton.textContent = "Analyzing...";
    resultContainer.style.display = "none";

    // --- Call the new backend endpoint ---
    const API_ENDPOINT = "http://127.0.0.1:5001/check_single_review";

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewText: reviewText }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();

      // --- Display the result ---
      resultClassification.textContent = result.classification;
      resultReason.textContent = result.reason;

      // Style the result box based on the classification
      resultContainer.className = "result-container"; // Reset class
      if (result.classification === "AI-Generated") {
        resultContainer.classList.add("suspicious");
      } else {
        resultContainer.classList.add("genuine");
      }
      resultContainer.style.display = "block";
    } catch (error) {
      console.error("Error during analysis:", error);
      alert(
        "Failed to get analysis from the server. Please ensure the server is running."
      );
    } finally {
      // --- Reset button state ---
      analyzeButton.disabled = false;
      analyzeButton.textContent = "Analyze Text";
    }
  });
});
