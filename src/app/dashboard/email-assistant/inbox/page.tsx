
"use client"

import React, { useState, useEffect } from 'react'
import {
  Archive,
  FileText,
  Inbox,
  PenSquare,
  Send,
  Star,
  Trash2,
  MoreVertical,
  Reply,
  ReplyAll,
  Forward,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Mail,
  Clock,
} from 'lucide-react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from 'date-fns'

import { draftEmailReplies } from '@/ai/flows/draft-email-replies'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { Email } from '@/types/email'
import { Typewriter } from '@/components/animations/typewriter'
import { FadeIn, StaggeredListItem } from '@/components/animations/fade-in'
import { EmailProvider, useEmail, type MailboxView } from '@/contexts/email-context'

const replyFormSchema = z.object({
  tone: z.string().min(1, { message: "Please select a tone." }),
  parameters: z.string(),
});

function EmailView() {
  const { 
    filteredEmails, 
    isFetchingEmails, 
    fetchError, 
    activeMailbox, 
    setActiveMailbox, 
    selectedEmail, 
    setSelectedEmail,
    emails,
    handleFetchEmails
  } = useEmail();

  const [isDrafting, setIsDrafting] = useState(false);
  const [draftedReply, setDraftedReply] = useState("");

  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof replyFormSchema>>({
    resolver: zodResolver(replyFormSchema),
    defaultValues: {
      tone: "Friendly",
      parameters: "Reply to the main points of the email.",
    },
  });

  useEffect(() => {
    // Set the active mailbox to Inbox when this page loads, if not already set.
    if (activeMailbox !== "Inbox") {
      setActiveMailbox("Inbox");
    }
    // Fetch emails if they haven't been fetched yet
    if (emails.length === 0 && !isFetchingEmails) {
        handleFetchEmails();
    }
  }, [activeMailbox, emails.length, handleFetchEmails, setActiveMailbox, isFetchingEmails]);

  useEffect(() => {
    if (selectedEmail) {
      form.reset();
      setDraftedReply('');
    }
  }, [selectedEmail, form]);

  async function onDraftReply(values: z.infer<typeof replyFormSchema>) {
    if (!selectedEmail) return;

    setIsDrafting(true);
    setDraftedReply("");

    try {
      const result = await draftEmailReplies({
        instructions: `Original email: """${selectedEmail.body}"""\n\nInstructions for reply: """${values.parameters}"""`,
        tone: values.tone,
      });
      setDraftedReply(result.reply);
    } catch (error) {
      console.error("Failed to draft reply:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to draft reply. Please try again.",
      });
    } finally {
      setIsDrafting(false);
    }
  }

  return (
    <TooltipProvider delayDuration={0}>
        <FadeIn className="flex-1 flex flex-col min-h-0 bg-card border border-border rounded-lg shadow-lg">
          <div className="flex flex-col md:grid md:grid-cols-12 flex-1 overflow-hidden">
            <div className={cn(
              "flex flex-col border-r border-border/50 md:col-span-4",
              selectedEmail && "hidden md:flex"
            )}>
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <Typewriter text={activeMailbox || "Inbox"} className="text-xl font-bold tracking-tight" />
              </div>
              <ScrollArea className="flex-1 relative">
                {isFetchingEmails ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                      <div className="relative h-24 w-24 mb-4">
                          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                          <div className="absolute inset-2 border-4 border-primary/40 rounded-full animate-spin-reverse-slow"></div>
                          <div className="absolute inset-4 border-4 border-primary/60 rounded-full animate-spin-slow"></div>
                          <Mail className="h-10 w-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <Typewriter text="Accessing Email Datastream..." className="text-lg font-headline text-primary" speed={0.08} />
                      <p className="text-muted-foreground mt-1 text-sm">Please stand by.</p>
                  </div>
                ) : fetchError ? (
                    <Alert variant="destructive" className="m-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error Fetching Emails</AlertTitle>
                      <AlertDescription>{fetchError}</AlertDescription>
                    </Alert>
                ) : filteredEmails.length === 0 ? (
                    <div className="text-center p-10 text-muted-foreground">
                      <Inbox className="mx-auto h-12 w-12" />
                      <p className="mt-4">
                        {emails.length === 0 ? "Your inbox is empty or you haven't fetched it yet." : `No emails in ${activeMailbox}.`}
                      </p>
                    </div>
                ) : (
                  <FadeIn stagger className="flex flex-col">
                    {filteredEmails.map((email) => (
                      <StaggeredListItem key={email.id}>
                        <button
                          onClick={() => setSelectedEmail(email)}
                          className={cn(
                            'flex flex-col gap-1.5 p-4 border-b border-border/20 text-left hover:bg-accent focus:bg-accent outline-none transition-colors',
                            selectedEmail?.id === email.id && 'bg-accent',
                            !email.read && 'bg-primary/5',
                          )}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className={cn("text-base font-semibold", !email.read && "text-primary-foreground/90")}>{email.sender}</h3>
                            {email.date && <p className="text-xs text-muted-foreground">{format(new Date(email.date), 'MMM d')}</p>}
                          </div>
                          <Typewriter text={email.subject} className={cn("text-sm font-medium flex", !email.read && "text-primary-foreground/80")} speed={0.01} />
                          <p className='text-sm text-muted-foreground truncate'>
                            {email.body}
                          </p>
                        </button>
                      </StaggeredListItem>
                    ))}
                  </FadeIn>
                )}
              </ScrollArea>
            </div>

            <div className={cn(
                "flex-col bg-background flex-1 md:col-span-8",
                selectedEmail ? "flex" : "hidden md:flex md:items-center md:justify-center"
            )}>
              {selectedEmail ? (
                <>
                  <div className="p-4 flex justify-between items-center border-b border-border/50">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedEmail(null)} className="md:hidden">
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <Avatar className="h-11 w-11">
                        <AvatarFallback className="text-lg">{selectedEmail.sender.slice(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold text-lg">{selectedEmail.sender}</h2>
                        <p className="text-sm text-muted-foreground">{selectedEmail.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {selectedEmail.date && <p className="text-sm mr-2">{format(new Date(selectedEmail.date), 'PPpp')}</p>}
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="ghost" size="icon"><Trash2 className="h-5 w-5" /></Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                       <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="ghost" size="icon"><Clock className="h-5 w-5" /></Button>
                        </TooltipTrigger>
                        <TooltipContent>Snooze</TooltipContent>
                      </Tooltip>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                          <DropdownMenuItem>Star this message</DropdownMenuItem>
                          <DropdownMenuItem>Add to tasks</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-6">
                      <Typewriter text={selectedEmail.subject} className="text-2xl font-bold mb-6 tracking-tight flex" />
                      <FadeIn delay={0.5}>
                        <p className="text-base whitespace-pre-wrap leading-7">
                          {selectedEmail.body}
                        </p>
                      </FadeIn>
                    </div>
                  </ScrollArea>
                   <div className="p-6 border-t border-border/50 bg-background space-y-4">
                    <FadeIn stagger className="flex items-center gap-2">
                      <StaggeredListItem>
                        <Button variant="outline"><Reply className="mr-2 h-4 w-4" /> Reply</Button>
                      </StaggeredListItem>
                      <StaggeredListItem>
                        <Button variant="outline"><ReplyAll className="mr-2 h-4 w-4" /> Reply All</Button>
                      </StaggeredListItem>
                      <StaggeredListItem>
                        <Button variant="outline"><Forward className="mr-2 h-4 w-4" /> Forward</Button>
                      </StaggeredListItem>
                    </FadeIn>
                    <FadeIn delay={0.4}>
                      <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                          <CardTitle className="text-base font-semibold">Draft a reply with Pravis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onDraftReply)} className="space-y-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="tone"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Tone of Reply</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select a tone" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="Friendly">Friendly</SelectItem>
                                          <SelectItem value="Formal">Formal</SelectItem>
                                          <SelectItem value="Casual">Casual</SelectItem>
                                          <SelectItem value="Professional">Professional</SelectItem>
                                          <SelectItem value="Direct">Direct</SelectItem>
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
                                      <FormLabel>Specific Instructions</FormLabel>
                                      <FormControl>
                                        <Textarea placeholder="e.g., Acknowledge receipt and say you'll reply in full tomorrow." {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <Button type="submit" disabled={isDrafting} className="w-full">
                                {isDrafting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenSquare className="mr-2 h-4 w-4" />}
                                Draft Reply
                              </Button>
                            </form>
                          </Form>
                          {(isDrafting || draftedReply) && (
                            <div className="space-y-2 pt-4">
                              <Label>Generated Reply</Label>
                              {isDrafting && !draftedReply ? (
                                <div className="space-y-2 rounded-md border border-input p-4">
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-3/4" />
                                </div>
                              ) : (
                                <Textarea
                                  value={draftedReply}
                                  readOnly
                                  rows={5}
                                  className="bg-background"
                                />
                              )}
                              {draftedReply && !isDrafting && (
                                <div className="flex justify-end gap-2 pt-2">
                                  <Button variant="ghost" onClick={() => setDraftedReply('')}>Discard</Button>
                                  <Button><Send className="mr-2 h-4 w-4" /> Send</Button>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </FadeIn>
                  </div>
                </>
              ) : (
                 <div className="text-center p-10 text-muted-foreground flex flex-col items-center">
                    <Mail className="mx-auto h-16 w-16 mb-4" />
                    <h2 className="text-xl font-semibold text-foreground mb-1">Select an email</h2>
                    <p>Choose an email from the list to read it.</p>
                  </div>
              )}
            </div>
          </div>
        </FadeIn>
    </TooltipProvider>
  )
}

export default function InboxPage() {
    return (
        <EmailProvider>
            <EmailView />
        </EmailProvider>
    )
}
