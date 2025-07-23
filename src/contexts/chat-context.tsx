
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { clarityChat } from '@/ai/flows/clarity-chat';
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { useToast } from '@/hooks/use-toast';

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
    const { toast } = useToast();

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
            const result = await clarityChat({ prompt: currentInput });
            const pravisResponse = result.reply;
            
            const pravisMessage: Message = { role: "pravis", content: pravisResponse };
            setMessages((prev) => [...prev, pravisMessage]);
            
            if (isVoiceInput) {
                const audioResult = await textToSpeech(pravisResponse);
                setAudioDataUri(audioResult.media);
            }

        } catch (error: any) {
            console.error("Pravis chatbot error:", error);
            const errorMessage: Message = { role: "pravis", content: "I'm sorry, an error occurred. Please try again." };
            setMessages((prev) => [...prev, errorMessage]);
            toast({
              variant: 'destructive',
              title: 'Chat Error',
              description: 'Could not get a response. Please check your connection and try again.'
            })
        } finally {
            setIsLoading(false);
        }
    }, [input, toast]);

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
