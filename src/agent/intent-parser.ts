// src/agent/intent-parser.ts
export type ComposeEmailIntent = {
    type: "email_compose";
    to?: string;
    subject?: string;
    body?: string;
  };
  
  export function parseAgentIntent(text: string): ComposeEmailIntent | null {
    // Simple detection (improve with Gemini eventually!)
    const lower = text.toLowerCase();
    if (lower.includes("email") && lower.includes("compose")) {
      // Try to pull out email, subject, body
      const toMatch = /to (\S+@\S+\.\w+)/.exec(text);
      const subjectMatch = /subject (?:is )?(.+)/i.exec(text);
      return {
        type: "email_compose",
        to: toMatch?.[1],
        subject: subjectMatch?.[1],
      };
    }
    return null;
  }
  