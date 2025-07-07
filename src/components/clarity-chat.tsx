
"use client"

import { provideClarityThroughChat } from "@/ai/flows/provide-clarity-through-chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BrainCircuit, Send, User } from "lucide-react"
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
    setMessages([
      {
        role: "pravis",
        content: "Hello! I'm Pravis. How can I help you find clarity today?",
      }
    ])
  }, [])

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
    } catch (error) {
      console.error("Error fetching response from Pravis:", error)
      const errorMessage: Message = { role: "pravis", content: "I'm having trouble connecting right now. Please try again later." }
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
    <div className="flex flex-col h-full bg-card border rounded-lg shadow-sm">
      <header className="p-4 border-b">
        <h1 className="font-semibold text-lg">Clarity Chat</h1>
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
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Pravis for clarity..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </footer>
    </div>
  )
}
