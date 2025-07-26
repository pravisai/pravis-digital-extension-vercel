console.log("DEBUG GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is missing. Set it in your .env file and restart your server.");
}

export const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// A helper for basic text generation. You can add more for chat, etc.
export async function generateText(prompt: string) {
  const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" }); // or "gemini-2.0-pro"
  const result = await model.generateContent([{ text: prompt }]);
  // Safely access the model output
  return result.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}
