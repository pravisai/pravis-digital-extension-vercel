"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React, { useState } from "react"
import { draftEmailReplies } from "@/ai/flows/draft-email-replies"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Loader2, Mail, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "./ui/skeleton"

const formSchema = z.object({
  emailContent: z.string().min(10, { message: "Email content must be at least 10 characters." }),
  tone: z.string({ required_error: "Please select a tone." }),
  parameters: z.string().min(3, { message: "Parameters must be at least 3 characters." }),
})

export function EmailAssistant() {
  const [reply, setReply] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailContent: "",
      parameters: "Reply to the main points of the email.",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setReply("")
    try {
      const response = await draftEmailReplies(values)
      setReply(response.reply)
    } catch (error) {
      console.error("Email drafting failed:", error)
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to draft email reply. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(reply);
    toast({
      title: "Copied!",
      description: "The email reply has been copied to your clipboard.",
    })
  }

  return (
     <div className="w-full space-y-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-headline">Email Assistant</h1>
        <p className="text-muted-foreground">Draft effective email replies with a little help from Pravis.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Left Pane: Incoming Email */}
          <Card className="h-full border-primary/20 shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle>Incoming Email</CardTitle>
              <CardDescription>Paste the email you want to reply to below.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="emailContent"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the full email content here..."
                        {...field}
                        rows={20}
                        className="font-code text-xs leading-relaxed bg-secondary/30"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Right Pane: Reply Composition */}
          <div className="space-y-6">
            <Card className="border-primary/20 shadow-lg shadow-primary/10">
              <CardHeader>
                <CardTitle>Reply Controls</CardTitle>
                <CardDescription>Set the tone and instructions for your reply.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="informal">Informal</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="assertive">Assertive</SelectItem>
                          <SelectItem value="concise">Concise</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parameters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Decline the invitation politely, ask for more details." {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
               <CardFooter>
                 <Button type="submit" disabled={isLoading} className="w-full">
                   {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                  Generate Draft
                </Button>
               </CardFooter>
            </Card>

            {/* Generated Reply Card */}
            {(isLoading || reply) && (
              <Card className="bg-card/80 border-primary/20 shadow-lg shadow-primary/10">
                 <CardHeader>
                    <CardTitle>New Message</CardTitle>
                    <CardDescription>Review and edit the generated draft below.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="relative">
                    {isLoading ? (
                        <div className="space-y-2">
                           <Skeleton className="h-40 w-full" />
                        </div>
                    ) : (
                        <div className="relative">
                            <Textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={10} className="bg-background font-code pr-10" />
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-foreground" onClick={handleCopy}>
                                <Copy className="h-4 w-4"/>
                            </Button>
                        </div>
                    )}
                    </div>
                </CardContent>
                <CardFooter className="border-t pt-4 mt-4 flex justify-between items-center bg-card/50">
                    <Button disabled={isLoading || !reply} className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        Send
                    </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
