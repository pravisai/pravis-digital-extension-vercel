// src/agent/agent-context.tsx
import { createContext, useContext, useState } from "react";

const AgentContext = createContext<any>(null);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [pendingIntent, setPendingIntent] = useState(null);
  return (
    <AgentContext.Provider value={{ pendingIntent, setPendingIntent }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  return useContext(AgentContext);
}
