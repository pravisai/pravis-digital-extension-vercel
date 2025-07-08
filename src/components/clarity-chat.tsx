
"use client"

import { provideClarityThroughChat } from "@/ai/flows/provide-clarity-through-chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BrainCircuit, Send, User, Paperclip, Mic } from "lucide-react"
import React, { useRef, useState, useEffect } from "react"
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { auth } from "@/lib/firebase/config"

interface Message {
  role: "user" | "pravis"
  content: string
}

export function ClarityChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "pravis",
          content: "Hello! I'm Pravis, your personal AI assistant. How can I help you find clarity today?",
        }
      ])
    }
  }, [messages.length])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const result = await provideClarityThroughChat({ userMessage: input })
      const pravisMessage: Message = { role: "pravis", content: result.pravisResponse }
      setMessages((prev) => [...prev, pravisMessage])
    } catch (error: any) {
      console.error("Error fetching response from Pravis:", error)
      let messageContent = "I'm having trouble connecting right now. Please try again later."
      if (error?.message && /503|overloaded/i.test(error.message)) {
        messageContent = "The AI is currently experiencing high demand. Please try your request again in a moment."
      }
      const errorMessage: Message = { role: "pravis", content: messageContent }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
       setTimeout(() => {
        if (scrollAreaRef.current) {
          const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
          if(viewport) viewport.scrollTop = viewport.scrollHeight;
        }
      }, 100);
    }
  }

  return (
    <div className="flex flex-col h-full bg-card shadow-sm">
        <header className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarFallback><BrainCircuit /></AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="font-semibold text-lg">Pravis AI</h1>
                    <p className="text-xs text-chart-4 flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-chart-4 inline-block"></span>
                        Online
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
                        <AvatarFallback><BrainCircuit /></AvatarFallback>
                    </Avatar>
                )}
                <div
                    className={`rounded-lg p-3 max-w-md ${
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
                <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarFallback><BrainCircuit className="animate-pulse" /></AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 bg-secondary animate-pulse">
                    <div className="h-4 w-24 rounded-md bg-muted"></div>
                </div>
                </div>
            )}
            </div>
      </ScrollArea>
      <footer className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="relative">
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Pravis anything..."
                className="pr-28 pl-10 h-12"
                disabled={isLoading}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Button variant="ghost" size="icon" disabled={isLoading} type="button"><Paperclip className="h-5 w-5 text-muted-foreground" /></Button>
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button variant="ghost" size="icon" disabled={isLoading} type="button"><Mic className="h-5 w-5 text-muted-foreground"/></Button>
                <Button type="submit" disabled={isLoading || !input.trim()}><Send className="h-5 w-5" /></Button>
            </div>
        </form>
      </footer>
    </div>
  )
}
