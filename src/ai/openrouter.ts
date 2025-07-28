// src/ai/openrouter.ts

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY missing. Set it in .env");
}


// ----- Qwen3 via OpenRouter -----
console.log("Loaded OpenRouter key: ", OPENROUTER_API_KEY && OPENROUTER_API_KEY.slice(0,12));

export async function generateText(userPrompt: string) {
  try {
    // Agentic clarifying prompt if needed (optional, or you can pass raw userPrompt)
    const clarifier = `
You are a helpful AI assistant.
If this prompt is unclear, vague, or incomplete, try to guess what the user is trying to accomplish (email? note? brainstorm?).
Rewrite it as a clear, specific command if possible.
If you cannot clarify, suggest two likely actions or politely ask for clarification.
Never say "I can't help."
User prompt: "${userPrompt}"
    `;

    // Call Qwen3 Coder via OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen/qwen3-coder:free", // or qwen/qwen3-235b-a22b-2507:free
        messages: [
          { role: "user", content: clarifier }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error("OpenRouter API error: " + (await response.text()));
    }
    const data = await response.json();
    // Return the content from Qwen3's first completion
    return data.choices?.[0]?.message?.content || '';
  } catch (err) {
    console.error("OpenRouter API error:", err);
    throw err;
  }
}
