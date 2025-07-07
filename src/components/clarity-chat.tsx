"use client"

import { provideClarityThroughChat } from "@/ai/flows/provide-clarity-through-chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { BrainCircuit, Send, User, MoreHorizontal, Paperclip, Mic } from "lucide-react"
import React, { useRef, useState, useEffect } from "react"
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import { Badge } from "./ui/badge"

interface Message {
  role: "user" | "pravis"
  content: string
  timestamp?: string
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
        content: "Hello! I'm Pravis, your AI digital assistant. I'm here to help you with productivity, creativity, email management, and more. What would you like to work on today?",
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      }
    ])
  }, [])

  const formatTimestamp = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input, timestamp: formatTimestamp() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const result = await provideClarityThroughChat({ userMessage: input })
      const pravisMessage: Message = { role: "pravis", content: result.pravisResponse, timestamp: formatTimestamp() }
      setMessages((prev) => [...prev, pravisMessage])
    } catch (error) {
      console.error("Error fetching response from Pravis:", error)
      const errorMessage: Message = { role: "pravis", content: "I'm having trouble connecting right now. Please try again later.", timestamp: formatTimestamp() }
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
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full bg-background border rounded-lg shadow-lg">
      <header className="flex items-center p-4 border-b">
        <Avatar className="w-10 h-10 border-2 border-primary">
            <AvatarFallback className="bg-primary/20">
                <BrainCircuit className="w-5 h-5 text-primary" />
            </AvatarFallback>
        </Avatar>
        <div className="ml-4">
            <h1 className="font-semibold text-lg">Pravis AI</h1>
            <Badge variant="secondary" className="text-xs">Clarity Chat</Badge>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto">
            <MoreHorizontal />
        </Button>
      </header>

      <ScrollArea className="flex-1 w-full" ref={scrollAreaRef}>
        <div className="space-y-8 p-6">
            {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-4 ${message.role === "user" ? "justify-end" : ""}`}>
                {message.role === "pravis" && (
                <Avatar className="w-8 h-8 border-2 border-primary">
                    <AvatarFallback className="bg-primary/20">
                    <BrainCircuit className="w-4 h-4 text-primary" />
                    </AvatarFallback>
                </Avatar>
                )}
                <div className="max-w-md">
                    <div className={`rounded-2xl p-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.timestamp && <p className={`text-xs text-muted-foreground mt-1.5 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>{message.timestamp}</p>}
                </div>
                {message.role === "user" && (
                    <Avatar className="w-8 h-8 border-2 border-muted-foreground">
                        {user?.photoURL ? (
                           <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
                        ) : (
                           <AvatarFallback className="bg-muted">
                            <User className="w-4 h-4 text-muted-foreground" />
                           </AvatarFallback>
                        )}
                    </Avatar>
                )}
            </div>
            ))}
            {isLoading && (
            <div className="flex items-start gap-4">
                <Avatar className="w-8 h-8 border-2 border-primary">
                    <AvatarFallback className="bg-primary/20">
                    <BrainCircuit className="w-4 h-4 text-primary animate-pulse" />
                    </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl p-3 bg-secondary animate-pulse">
                <div className="h-4 w-32 rounded-md bg-muted"></div>
                </div>
            </div>
            )}
        </div>
      </ScrollArea>
      
      <footer className="p-4 border-t bg-background">
        <form onSubmit={handleSendMessage} className="relative">
            <div className="relative flex items-center">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Clarity Chat..."
                    className="pr-24 pl-10 resize-none"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                    disabled={isLoading}
                />
                <div className="absolute left-3 flex items-center">
                    <Button type="button" variant="ghost" size="icon" className="text-muted-foreground">
                        <Paperclip className="h-5 w-5"/>
                    </Button>
                </div>
                <div className="absolute right-3 flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon" className="text-muted-foreground">
                        <Mic className="h-5 w-5"/>
                    </Button>
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-foreground text-background hover:bg-foreground/90 rounded-lg w-8 h-8">
                        <Send className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
        </form>
      </footer>
    </div>
  )
}
