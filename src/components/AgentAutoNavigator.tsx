import { useAgent } from "@/agent/agent-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AgentAutoNavigator() {
  const { pendingIntent, setPendingIntent } = useAgent();
  const router = useRouter();

  useEffect(() => {
    if (pendingIntent?.type === "email_compose") {
      let url = "/dashboard/email-assistant/compose";
      const params: Record<string, string> = {};
      if (pendingIntent.to) params.to = pendingIntent.to;
      if (pendingIntent.subject) params.subject = pendingIntent.subject;
      if (pendingIntent.body) params.body = pendingIntent.body;

      const searchParams = new URLSearchParams(params).toString();
      if (searchParams) url += `?${searchParams}`;
      router.push(url);
      setPendingIntent(null);
    }
    // Add further intent types here as needed!
  }, [pendingIntent, router, setPendingIntent]);

  return null;
}
