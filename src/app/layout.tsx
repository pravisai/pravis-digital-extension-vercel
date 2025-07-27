"use client";

import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider';
import { ChatProvider, useChat } from '@/contexts/chat-context';
import { ChatPanel } from '@/components/chat-panel';
import { PersistentChatInput } from '@/components/persistent-chat-input';
import { usePathname } from 'next/navigation';
import React from 'react';
import { IntentProvider } from '@/contexts/intent-context';

// === AGENTIC IMPORTS ===
import { AgentProvider } from "@/agent/agent-context";
import { AgentAutoNavigator } from "@/components/AgentAutoNavigator";
// ========================

import RouteLoaderProvider from "@/components/RouteLoaderProvider"; // IMPORTANT: import your loader provider

function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isPanelOpen } = useChat();

  const isChatPage = pathname === '/dashboard/clarity-chat';
  const showPersistentChat = !isPanelOpen && !isChatPage;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {/* --- AGENTIC LOGIC: AUTO-NAV LISTENER ONLY --- */}
      <AgentAutoNavigator />
      {/* -------------------------------------------- */}
      <RouteLoaderProvider>
        {children}
        <Toaster />
        <div className="md:hidden">
          <ChatPanel />
          {showPersistentChat && <PersistentChatInput />}
        </div>
      </RouteLoaderProvider>
    </ThemeProvider>
  );
}

// ---- The real exported entrypoint ----
// Now includes <html> and <body>, must NOT be a client component!
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Pravis: Your Digital Extension</title>
        <meta name="description" content="Pravis is your personal restorative alignment virtual intelligence system, designed to bring calm and clarity to your day." />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#BF5FFF" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AgentProvider>
          <IntentProvider>
            <ChatProvider>
              <RootLayoutClient>{children}</RootLayoutClient>
            </ChatProvider>
          </IntentProvider>
        </AgentProvider>
      </body>
    </html>
  );
}
