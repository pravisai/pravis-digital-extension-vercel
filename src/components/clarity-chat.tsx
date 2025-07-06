"use client"

import { provideClarityThroughChat } from "@/ai/flows/provide-clarity-through-chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { BrainCircuit, Send, User } from "lucide-react"
import React, { useRef, useState } from "react"

interface Message {
  role: "user" | "pravis"
  content: string
}

export function ClarityChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
    <Card className="w-full shadow-lg border-primary/20 shadow-primary/5">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Clarity Chat</CardTitle>
        <CardDescription>Engage with Pravis to untangle complex thoughts and gain valuable insights.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-4 ${message.role === "user" ? "justify-end" : ""}`}>
                {message.role === "pravis" && (
                  <Avatar className="w-8 h-8 border-2 border-primary">
                    <AvatarFallback className="bg-primary/20">
                      <BrainCircuit className="w-4 h-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-lg p-3 max-w-md ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "user" && (
                   <Avatar className="w-8 h-8 border-2 border-muted-foreground">
                    <AvatarFallback className="bg-muted">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </AvatarFallback>
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
                <div className="rounded-lg p-3 bg-secondary animate-pulse">
                  <div className="h-4 w-32 rounded-md bg-muted"></div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Pravis anything..."
            className="flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="shadow-lg shadow-primary/20">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
