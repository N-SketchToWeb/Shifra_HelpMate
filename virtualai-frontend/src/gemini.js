import axios from "axios";

// Backend URL (Render / localhost fallback)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function run(prompt) {
  if (!prompt || !prompt.trim()) {
    return "Please ask a valid question.";
  }

  try {
    const response = await axios.post(
      `${API_URL}/api/ai/response`,
      { prompt },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000, // 15 seconds
      }
    );


    if (response?.data?.content) {
      return response.data.content;
    }

    // Fallback if backend sends plain string
    if (typeof response.data === "string") {
      return response.data;
    }

    console.error("Unexpected backend response:", response.data);
    return "Sorry, I couldn't understand the AI response.";

  } catch (error) {
    console.error(
      "Backend / Gemini error:",
      error.response?.data || error.message
    );

    return "Sorry, something went wrong while contacting the AI.";
  }
}

export default run;