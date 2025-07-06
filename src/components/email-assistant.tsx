"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React, { useState } from "react"
import { draftEmailReplies } from "@/ai/flows/draft-email-replies"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Loader2, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
    <Card className="w-full shadow-lg border-primary/20 shadow-primary/5">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Email Assistant</CardTitle>
        <CardDescription>Draft thoughtful and effective email replies with ease.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="emailContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-headline">Email to Reply To</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Paste the content of the email here..." {...field} rows={6}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-headline">Tone of Reply</FormLabel>
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
                    <FormLabel className="font-headline">Specific Instructions</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Decline the invitation politely." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
           
            <Button type="submit" disabled={isLoading} className="w-full shadow-lg shadow-primary/20">
               {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
              Draft Reply
            </Button>
          </form>
        </Form>
        
        {(isLoading || reply) && (
            <div className="mt-8 space-y-4">
                <h3 className="text-xl font-headline text-primary">Drafted Reply</h3>
                {isLoading ? (
                    <div className="space-y-2">
                        <Textarea readOnly value={"Generating reply..."} rows={8} className="animate-pulse bg-muted"/>
                    </div>
                ) : (
                    <div className="relative">
                        <Textarea readOnly value={reply} rows={8} className="bg-secondary font-code"/>
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handleCopy}>
                            <Copy className="h-4 w-4"/>
                        </Button>
                    </div>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  )
}
