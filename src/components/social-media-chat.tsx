
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, User, Share2, Loader2, Paperclip, Mic, Smile, Camera } from "lucide-react"
import React, { useRef, useState, useEffect } from "react"
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import { socialMediaChat } from "@/ai/flows/social-media-chat"

interface Message {
  role: "user" | "pravis";
  content: string;
}

export function SocialMediaChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Initialize with a welcome message
    if (messages.length === 0) {
      setMessages([
        { 
          role: "pravis", 
          content: "Hello! I'm your Social Media Strategist. How can I help you level up your social game today? Ask me for post ideas, hashtag suggestions, or content strategies!" 
        }
      ]);
    }
  }, [messages.length]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if(viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    setInput("");
    setIsLoading(true);
    
    try {
      const result = await socialMediaChat({ userMessage: currentInput });
      const pravisMessage: Message = { role: "pravis", content: result.response };
      setMessages(prev => [...prev, pravisMessage]);
    } catch (error) {
      console.error("Error fetching social media chat response:", error);
      const errorMessage: Message = { role: "pravis", content: "Sorry, I'm having trouble connecting right now. Please try again in a moment." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card shadow-sm">
        <header className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarFallback><Share2 /></AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="font-semibold text-lg">Social Media Chat</h1>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        Your AI Social Strategist
                    </p>
                </div>
            </div>
        </header>
        <ScrollArea className="flex-1 w-full" ref={scrollAreaRef}>
            <div className="space-y-6 p-6">
            {messages.map((message, index) => (
                <div
                key={index}
                className={`flex items-start gap-4 ${
                    message.role === "user" ? "justify-end" : ""
                }`}
                >
                {message.role === "pravis" && (
                    <Avatar>
                        <AvatarFallback><Share2 /></AvatarFallback>
                    </Avatar>
                )}
                <div
                    className={`rounded-lg p-3 max-w-2xl ${
                    message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "user" && (
                    <Avatar>
                    {user?.photoURL ? (
                        <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
                    ) : (
                        <AvatarFallback><User /></AvatarFallback>
                    )}
                    </Avatar>
                )}
                </div>
            ))}
            {isLoading && (
                <div className="flex items-start gap-4">
                    <Avatar>
                        <AvatarFallback><Share2 className="animate-pulse" /></AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-secondary">
                        <Loader2 className="animate-spin" />
                    </div>
                </div>
            )}
            </div>
      </ScrollArea>
      <footer className="p-2 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-secondary rounded-full px-2">
                 <Button variant="ghost" size="icon" type="button" className="shrink-0 rounded-full">
                    <Smile className="h-6 w-6 text-muted-foreground" />
                </Button>
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask for post ideas, captions, etc."
                    className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                    disabled={isLoading}
                />
                 <Button variant="ghost" size="icon" type="button" className="shrink-0 rounded-full">
                    <Paperclip className="h-6 w-6 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" type="button" className="shrink-0 rounded-full">
                    <Camera className="h-6 w-6 text-muted-foreground" />
                </Button>
            </div>
            <Button 
                type="submit" 
                size="icon" 
                className="rounded-full w-12 h-12 bg-primary text-primary-foreground shrink-0 transition-all duration-300" 
                disabled={isLoading || !input.trim()}
            >
                {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : (input.trim() ? <Send className="h-6 w-6" /> : <Mic className="h-6 w-6" />)}
            </Button>
        </form>
      </footer>
    </div>
  )
}
