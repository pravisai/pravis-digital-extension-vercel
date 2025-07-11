
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { provideClarityThroughChat } from "@/ai/flows/provide-clarity-through-chat"

interface Message {
  role: "user" | "pravis";
  content: string;
}

interface ChatContextType {
    messages: Message[];
    isLoading: boolean;
    input: string;
    isPanelOpen: boolean;
    setInput: (input: string) => void;
    handleSendMessage: (e: React.FormEvent) => Promise<void>;
    setPanelOpen: (isOpen: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPanelOpen, setPanelOpen] = useState(false);

    useEffect(() => {
        if (messages.length === 0) {
          setMessages([
            {
              role: "pravis",
              content: "Hello! I'm Pravis, your personal AI assistant. How can I help you find clarity today?",
            }
          ])
        }
    }, [messages.length]);

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setPanelOpen(true);
        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const result = await provideClarityThroughChat({ userMessage: input });
            const pravisMessage: Message = { role: "pravis", content: result.pravisResponse };
            setMessages((prev) => [...prev, pravisMessage]);
        } catch (error: any) {
            console.error("Error fetching response from Pravis:", error);
            let messageContent = "I'm having trouble connecting right now. Please try again later.";
            if (error?.message && /503|overloaded/i.test(error.message)) {
                messageContent = "The AI is currently experiencing high demand. Please try your request again in a moment.";
            }
            const errorMessage: Message = { role: "pravis", content: messageContent };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [input]);

    const value = {
        messages,
        isLoading,
        input,
        isPanelOpen,
        setInput,
        handleSendMessage,
        setPanelOpen,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
