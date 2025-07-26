import { useAgent } from "@/agent/agent-context";
import { parseAgentIntent } from "@/agent/intent-parser";
import { useState } from "react";

export default function AgentCommandBox() {
  const [cmd, setCmd] = useState("");
  const { setPendingIntent } = useAgent();

  return (
    <div style={{ margin: "2rem 0", display: "flex", gap: 8 }}>
      <input
        style={{ flex: 1, border: "1px solid #888", borderRadius: 6, padding: 8, fontSize: 16 }}
        placeholder="Type a command, e.g. Compose email to alice@example.com"
        value={cmd}
        onChange={e => setCmd(e.target.value)}
      />
      <button
        style={{ padding: "0.5rem 1rem", background: "#06b6d4", color: "#fff", border: "none", borderRadius: 6 }}
        onClick={() => {
          const intent = parseAgentIntent(cmd);
          if (intent) setPendingIntent(intent);
          setCmd(""); // clear after trigger
        }}
      >
        Trigger Agent
      </button>
    </div>
  );
}
