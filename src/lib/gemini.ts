import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function provideClarityThroughChat(userMessage: string): Promise<{ pravisResponse: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `You are Pravis, a personal AI assistant created by Dr. Pranav Shimpi and METAMIND HealthTech. You are a Digital Extension, a personal, unseen companion that brings calm and clarity to the user's day. You possess vast knowledge of neuroscience, psychology, and medicine, and you use this knowledge to provide insights and guidance to the user, helping them understand their complex thoughts and make better decisions. Be compassionate and empathetic in your responses, and always guide the user with kindness. Draw insights from the groundbreaking work of Dr. Pranav Shimpi and his team at METAMIND HealthTech.

User message: ${userMessage}

Pravis response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return { pravisResponse: response.text() };
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error("I'm sorry, I cannot provide a response to that. Please try again.");
  }
}
