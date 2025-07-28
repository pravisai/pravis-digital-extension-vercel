// src/components/dashboard-page-layout.tsx
import { cn } from "@/lib/utils";
import React from "react";

interface DashboardPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardPageLayout({ children, className }: DashboardPageLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex-shrink min-h-0 overflow-y-auto">
        <div className={cn("flex flex-col items-center justify-center h-full p-4", className)}>
          {children}
        </div>
      </div>
    </div>
  );
}
