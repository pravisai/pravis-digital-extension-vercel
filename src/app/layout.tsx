
"use client";

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider';
import { ChatProvider, useChat } from '@/contexts/chat-context';
import { ChatPanel } from '@/components/chat-panel';
import { PersistentChatInput } from '@/components/persistent-chat-input';
import { usePathname } from 'next/navigation';
import React from 'react';

// Metadata can be defined in a Server Component, but since we are making this a client component, 
// we will handle the title in a different way if needed, or move this to a parent layout if one existed.
// For now, we will manage the document title dynamically or set it in next.config.js if static.
// To keep things simple and fix the immediate error, we focus on making the layout a client component.

function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isPanelOpen } = useChat();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Pravis: Your Digital Extension</title>
        <meta name="description" content="Pravis is your personal restorative alignment virtual intelligence system, designed to bring calm and clarity to your day." />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#BF5FFF" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <div className="md:hidden">
            {isPanelOpen ? <ChatPanel /> : (pathname !== '/dashboard' && <PersistentChatInput />)}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ChatProvider>
      <RootLayoutClient>{children}</RootLayoutClient>
    </ChatProvider>
  );
}
