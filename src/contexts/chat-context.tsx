
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { clarityChat } from '@/ai/flows/clarity-chat';
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { useToast } from '@/hooks/use-toast';
import { useIntent } from './intent-context';

interface Message {
  role: "user" | "pravis";
  content: string | React.ReactNode;
}

interface ChatContextType {
    messages: Message[];
    isLoading: boolean;
    input: string;
    isPanelOpen: boolean;
    audioDataUri: string | null;
    attachment: File | null;
    attachmentPreview: string | null;
    isSpeaking: boolean;
    setInput: (input: string) => void;
    handleSendMessage: (e: React.FormEvent, isVoiceInput?: boolean) => Promise<void>;
    setPanelOpen: (isOpen: boolean) => void;
    setAudioDataUri: (uri: string | null) => void;
    setAttachment: (file: File | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPanelOpen, setPanelOpen] = useState(false);
    const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
    const [attachment, setAttachment] = useState<File | null>(null);
    const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const { toast } = useToast();
    const { handleIntent } = useIntent();

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

    useEffect(() => {
      if (!attachment) {
        setAttachmentPreview(null);
        return;
      }
      const objectUrl = URL.createObjectURL(attachment);
      setAttachmentPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }, [attachment]);

    const handleSendMessage = useCallback(async (e: React.FormEvent, isVoiceInput = false) => {
        e.preventDefault();
        if (!input.trim() && !attachment) return;

        setPanelOpen(true);
        const currentInput = input;
        const currentAttachment = attachment;

        let userMessageContent: React.ReactNode = currentInput;
        if (currentAttachment && attachmentPreview) {
          userMessageContent = (
            <div>
              <img src={attachmentPreview} alt={currentAttachment.name} className="max-w-xs rounded-md mb-2" />
              {currentInput}
            </div>
          )
        }

        const userMessage: Message = { role: "user", content: userMessageContent };
        
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setAttachment(null);
        setIsLoading(true);

        let imageDataUri: string | undefined;
        if (currentAttachment?.type.startsWith('image/')) {
            const reader = new FileReader();
            imageDataUri = await new Promise(resolve => {
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(currentAttachment);
            });
        }

        try {
            const result = await clarityChat({ 
              prompt: currentInput, 
              imageDataUri 
            });
            
            if (result.toolRequest) {
              const { name, input: toolInput } = result.toolRequest;
              handleIntent({ action: name, params: toolInput });
              // Optionally add a message to the chat confirming the action
              const confirmationMessage: Message = { role: "pravis", content: `Understood. Navigating to the appropriate module to handle your request.` };
              setMessages((prev) => [...prev, confirmationMessage]);
            } else if (result.reply) {
              const pravisResponse = result.reply;
              const pravisMessage: Message = { role: "pravis", content: pravisResponse };
              setMessages((prev) => [...prev, pravisMessage]);
              
              if (isVoiceInput) {
                  const audioResult = await textToSpeech(pravisResponse);
                  setAudioDataUri(audioResult.media);
              }
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
    }, [input, toast, attachment, attachmentPreview, handleIntent]);

    const value = {
        messages,
        isLoading,
        input,
        isPanelOpen,
        audioDataUri,
        attachment,
        attachmentPreview,
        isSpeaking,
        setInput,
        handleSendMessage,
        setPanelOpen,
        setAudioDataUri,
        setAttachment,
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
