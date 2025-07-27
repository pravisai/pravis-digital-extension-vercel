import { GoogleGenerativeAI } from "@google/generative-ai";

// Fallback/default for development -- REMOVE hardcode in production!
const apiKey = process.env.GEMINI_API_KEY || "PASTE_YOUR_KEY_HERE";
if (!apiKey) {
  throw new Error("GEMINI_API_KEY missing. Set it in .env");
}

export const geminiClient = new GoogleGenerativeAI(apiKey);

export async function generateText(userPrompt: string) {
  try {
    // Step 1: Clarify or "repair" the user's input into a good AI prompt
    const clarifier = `
You are a helpful AI assistant.
If this prompt is unclear, vague, or incomplete, try to guess what the user is trying to accomplish (email? note? brainstorm?).
Rewrite it as a clear command if possible.
If you cannot clarify, suggest two likely actions or politely ask for clarification.
Never say "I can't help."  
User prompt: "${userPrompt}"
    `;
    const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });
    const clarifyResult = await model.generateContent([{ text: clarifier }]);
    const clarifiedPrompt = clarifyResult.response?.candidates?.[0]?.content?.parts?.[0]?.text || userPrompt;

    // Step 2: Actually generate with the clarified prompt
    const result = await model.generateContent([{ text: clarifiedPrompt }]);
    return result.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (err) {
    // Print/return the actual error!
    console.error("Gemini API error:", err);
    throw err;
  }
}
