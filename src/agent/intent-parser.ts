// src/agent/intent-parser.ts

export type ComposeEmailIntent = {
  type: "email_compose";
  to?: string;
  about?: string; // this will be used as the "topic" for Gemini
};

export function parseAgentIntent(text: string): ComposeEmailIntent | null {
  // Captures: "compose an email to alice@gmail.com about the new plan"
  const match = /compose( an)? email to\s+([^\s]+@[^\s]+)(?: about (.+))?/i.exec(text);
  if (match) {
    return {
      type: "email_compose",
      to: match[2],
      about: match[3]?.trim(),
    };
  }
  // Fallback to your earlier pattern (basic support for "subject" syntax if user types it):
  if (/email/i.test(text) && /compose/i.test(text)) {
    const toMatch = /to (\S+@\S+\.\w+)/.exec(text);
    const subjectMatch = /subject (?:is )?(.+)/i.exec(text);
    return {
      type: "email_compose",
      to: toMatch?.[1],
      about: subjectMatch?.[1], // If chatbot uses "subject" designator
    };
  }
  return null;
}
