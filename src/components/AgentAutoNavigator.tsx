import { useAgent } from "@/agent/agent-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AgentAutoNavigator() {
  const { pendingIntent, setPendingIntent } = useAgent();
  const router = useRouter();

  useEffect(() => {
    if (pendingIntent?.type === "email_compose") {
      let url = "/dashboard/email-assistant?agent=1";
      if (pendingIntent.to) url += `&to=${encodeURIComponent(pendingIntent.to)}`;
      if (pendingIntent.subject) url += `&subject=${encodeURIComponent(pendingIntent.subject)}`;
      router.push(url);
      setPendingIntent(null);
    }
  }, [pendingIntent]);

  return null;
}
