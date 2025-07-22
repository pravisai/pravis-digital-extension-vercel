"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { provideClarityThroughChat } from "@/lib/gemini";
// Remove or comment out the text-to-speech import for now
// import { textToSpeech } from "@/ai/flows/text-to-speech";

interface Message {
  role: "user" | "pravis";
  content: string;
}

interface ChatContextType {
    messages: Message[];
    isLoading: boolean;
    input: string;
    isPanelOpen: boolean;
    audioDataUri: string | null;
    isSpeaking: boolean;
    setInput: (input: string) => void;
    handleSendMessage: (e: React.FormEvent, isVoiceInput?: boolean) => Promise<void>;
    setPanelOpen: (isOpen: boolean) => void;
    setAudioDataUri: (uri: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPanelOpen, setPanelOpen] = useState(false);
    const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

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
    
    useEffect(() => {
        if (audioDataUri) {
            setIsSpeaking(true);
        } else {
            setIsSpeaking(false);
        }
    }, [audioDataUri]);

    const handleSendMessage = useCallback(async (e: React.FormEvent, isVoiceInput = false) => {
        e.preventDefault();
        if (!input.trim()) return;

        setPanelOpen(true);
        const userMessage: Message = { role: "user", content: input };
        const currentInput = input;
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Updated to use the simple Gemini function
            const result = await provideClarityThroughChat(currentInput);
            const pravisResponse = result.pravisResponse;
            
            const pravisMessage: Message = { role: "pravis", content: pravisResponse };
            setMessages((prev) => [...prev, pravisMessage]);
            
            // Temporarily disable text-to-speech until we fix that too
            // if (isVoiceInput) {
            //     const audioResult = await textToSpeech(pravisResponse);
            //     setAudioDataUri(audioResult.media);
            // }

        } catch (error: any) {
            console.error("Pravis chatbot Gemini error:", error);
            let messageContent = error.message || "AI is currently unavailable. Please check your network or try again shortly.";
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
        audioDataUri,
        isSpeaking,
        setInput,
        handleSendMessage,
        setPanelOpen,
        setAudioDataUri,
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
