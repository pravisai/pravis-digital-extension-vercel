// Debug print -- REMOVE in production
console.log("DEBUG GEMINI_API_KEY:", process.env.GEMINI_API_KEY);

import { GoogleGenerativeAI } from "@google/generative-ai";

// Fallback to hard-coded key if env var is missing (REMOVE before production!)
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyB2KzAxDfnk_NovtgX5dxr53bS2D6qX-Go";
if (!apiKey) {
  throw new Error("GEMINI_API_KEY missing. Set it in .env or hardcode for dev preview ONLY.");
}

export const geminiClient = new GoogleGenerativeAI(apiKey);

// A helper for basic text generation. You can add more for chat, etc.
export async function generateText(userPrompt: string) {
    // 1. Re-write: First try to clarify or complete any vague prompt, like an agent
    const clarifier = `
  You are a helpful AI assistant. 
  If this prompt is unclear, vague, or incomplete, try to guess what the user is trying to accomplish (email? note? brainstorm?). 
  Rewrite it as a clear command if possible. 
  If still unclear, suggest two likely actions or politely ask for clarification. 
  Never say "I can't help."
  User prompt: "${userPrompt}"
  `;
    const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });
    const clarifyResult = await model.generateContent([{ text: clarifier }]);
    const clarifiedPrompt = clarifyResult.response?.candidates?.[0]?.content?.parts?.[0]?.text || userPrompt;
  
    // 2. Now actually generate as before, but with clarified prompt
    const result = await model.generateContent([{ text: clarifiedPrompt }]);
    return result.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
  
