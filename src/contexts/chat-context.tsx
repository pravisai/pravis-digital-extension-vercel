
"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect
} from "react";
import { clarityChat } from "@/ai/flows/clarity-chat";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { useToast } from "@/hooks/use-toast";
import { useIntent } from "./intent-context";

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
  handleSendMessage: (
    originalInput: string,
    isVoiceInput?: boolean
  ) => Promise<void>;
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
          content: "Shall we begin, sir?"
        }
      ]);
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

  const handleSendMessage = useCallback
  (
    async (originalInput: string, isVoiceInput: boolean = false) => {
      if (!originalInput.trim() && !attachment) return;

      setPanelOpen(true);
      const currentAttachment = attachment;

      let userMessageContent: React.ReactNode = originalInput;
      if (currentAttachment && attachmentPreview) {
        userMessageContent = (
          <div>
            <img src={attachmentPreview} alt={currentAttachment.name} className="max-w-xs rounded-md mb-2" />
            {originalInput}
          </div>
        );
      }

      const userMessage: Message = { role: "user", content: userMessageContent };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setAttachment(null);
      setIsLoading(true);

      let imageDataUri: string | undefined;
      if (currentAttachment?.type.startsWith("image/")) {
        const reader = new FileReader();
        imageDataUri = await new Promise(resolve => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(currentAttachment);
        });
      }

      try {
        const result = await clarityChat({
          prompt: originalInput,
          imageDataUri
        });

        if (result.toolRequest) {
          handleIntent(result.toolRequest);
          const confirmationMessage: Message = {
            role: "pravis",
            content: `Understood. I will handle that request for you.`
          };
          setMessages((prev) => [...prev, confirmationMessage]);
          setPanelOpen(false); // Close panel on successful intent
        } else if (result.reply) {
          const pravisResponse = result.reply;
          const pravisMessage: Message = { role: "pravis", content: pravisResponse };
          setMessages((prev) => [...prev, pravisMessage]);
          if (isVoiceInput) {
            const audioResult = await textToSpeech(pravisResponse);
            setAudioDataUri(audioResult.media);
          }
        } else {
            // Handle case where AI returns neither reply nor toolRequest
             const errorMessage: Message = { role: "pravis", content: "I'm sorry, I wasn't able to process that. Could you please try rephrasing?" };
             setMessages((prev) => [...prev, errorMessage]);
        }
      } catch (error: any) {
        console.error("Pravis chatbot error:", error);
        const errorMessage: Message = { role: "pravis", content: "I'm sorry, an error occurred. Please try again." };
        setMessages((prev) => [...prev, errorMessage]);
        toast({
          variant: "destructive",
          title: "Chat Error",
          description: "Could not get a response. Please check your connection and try again."
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast, attachment, attachmentPreview, handleIntent, setAttachment, setInput, setMessages, setPanelOpen, setIsLoading, setAudioDataUri]
  );

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
    setAttachment
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
