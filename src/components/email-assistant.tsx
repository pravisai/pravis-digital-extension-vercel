
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
  Users,
  Tag,
  Clock,
  MoreVertical,
  Reply,
  ReplyAll,
  Forward,
  ArrowLeft,
  Menu,
  Loader2,
  RefreshCw,
  AlertCircle,
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
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from './ui/skeleton'
import { Label } from './ui/label'
import { fetchEmails } from '@/lib/gmail'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import type { Email } from '@/types/email'
import { signInWithGoogle, getStoredAccessToken } from '@/lib/firebase/auth'


const navLinks = [
  { name: 'Inbox', icon: Inbox, count: 3 },
  { name: 'Starred', icon: Star },
  { name: 'Sent', icon: Send },
  { name: 'Drafts', icon: FileText },
  { name: 'Trash', icon: Trash2 },
  { name: 'Archived', icon: Archive },
]

const categories = [
  { name: 'Social', icon: Users, color: 'text-rose-400' },
  { name: 'Promotions', icon: Tag, color: 'text-rose-400' },
]

const replyFormSchema = z.object({
  tone: z.string().min(1, { message: "Please select a tone." }),
  parameters: z.string(),
});


export function EmailAssistant() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isFetchingEmails, setIsFetchingEmails] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const { toast } = useToast()
  
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftedReply, setDraftedReply] = useState("");

  const form = useForm<z.infer<typeof replyFormSchema>>({
    resolver: zodResolver(replyFormSchema),
    defaultValues: {
      tone: "Friendly",
      parameters: "Reply to the main points of the email.",
    },
  });

  useEffect(() => {
    if (selectedEmail) {
      form.reset();
      setDraftedReply('');
    }
  }, [selectedEmail, form]);

  const handleFetchEmails = async () => {
    setIsFetchingEmails(true);
    setFetchError(null);
    setEmails([]);
    setSelectedEmail(null);

    try {
      let accessToken = getStoredAccessToken();

      // If no token, trigger sign-in first
      if (!accessToken) {
        const { accessToken: newAccessToken } = await signInWithGoogle();
        if (!newAccessToken) {
          throw new Error('Failed to obtain Gmail access token during login.');
        }
        accessToken = newAccessToken;
      }

      const result = await fetchEmails(accessToken);

      // If there's an error, it might be an expired token. Try to re-authenticate.
      if (result.error) {
        console.warn('Gmail token error, attempting to re-authenticate:', result.error);
        const { accessToken: refreshedToken } = await signInWithGoogle();
        if (!refreshedToken) {
          throw new Error('Unable to re-authenticate with Google.');
        }
        
        // Retry fetching with the new token
        const retryResult = await fetchEmails(refreshedToken);
        if (retryResult.error) {
          // If it still fails, throw the error
          throw new Error(retryResult.error);
        }
        setEmails(retryResult.emails);
      } else {
        setEmails(result.emails);
      }
    } catch (err: any) {
      console.error('Error in email fetching process:', err);
      let message = err.message || 'An unknown error occurred.';
      if (err.code === 'auth/popup-closed-by-user') {
          message = 'The sign-in popup was closed. Please try again.';
      }
      setFetchError(message);
    } finally {
      setIsFetchingEmails(false);
    }
  };

  async function onDraftReply(values: z.infer<typeof replyFormSchema>) {
    if (!selectedEmail) return;

    setIsDrafting(true);
    setDraftedReply("");

    try {
      const result = await draftEmailReplies({
        emailContent: selectedEmail.body,
        tone: values.tone,
        parameters: values.parameters,
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
      <div className="h-full w-full flex flex-col text-foreground bg-background">
        <div
          className={cn(
            "flex-1 flex md:grid overflow-hidden",
            "md:grid-cols-[var(--nav-width)_1fr]"
          )}
          style={{'--nav-width': isNavCollapsed ? '80px' : '240px'} as React.CSSProperties}
        >
          <div className={cn(
            "bg-background border-r border-border/50 p-3 hidden md:flex flex-col gap-4 transition-all duration-300",
            isNavCollapsed && "items-center px-2"
          )}>
            <div className={cn(
              "flex items-center w-full pb-2",
              isNavCollapsed ? "justify-center" : "justify-between"
            )}>
              <span className={cn("font-bold text-lg", isNavCollapsed && "hidden")}>Inbox</span>
              <Button variant="ghost" size="icon" onClick={() => setIsNavCollapsed(!isNavCollapsed)} className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Navigation</span>
              </Button>
            </div>

            <div className="w-full">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" className="w-full h-11">
                    <PenSquare className={cn(isNavCollapsed ? "h-5 w-5" : "mr-2")} />
                    <span className={cn(isNavCollapsed && "hidden")}>Compose</span>
                  </Button>
                </TooltipTrigger>
                {isNavCollapsed && (
                  <TooltipContent side="right">
                    <p>Compose</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </div>

            <nav className="flex flex-col gap-1 w-full">
              {navLinks.map((link) => (
                <Tooltip key={link.name}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={link.name === 'Inbox' ? "secondary" : "ghost"}
                      className={cn(
                        'w-full justify-start gap-3 px-3 h-11 text-base',
                        isNavCollapsed && 'justify-center h-11 w-11 p-0'
                      )}
                    >
                      <link.icon className="w-5 w-5" />
                      <span className={cn(isNavCollapsed && "hidden")}>{link.name}</span>
                      {link.count && !isNavCollapsed && <span className="ml-auto bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{link.count}</span>}
                    </Button>
                  </TooltipTrigger>
                  {isNavCollapsed && (
                    <TooltipContent side="right">
                      <p>{link.name}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </nav>
            <Separator className={cn("bg-border/50", isNavCollapsed && "w-3/4")}/>
            <div className={cn("px-3 text-sm font-semibold uppercase text-muted-foreground", isNavCollapsed && "hidden")}>Categories</div>
            <nav className="flex flex-col gap-1 w-full">
              {categories.map((cat) => (
                <Tooltip key={cat.name}>
                  <TooltipTrigger asChild>
                    <Button
                      key={cat.name}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 px-3 h-10 text-base",
                        isNavCollapsed && 'justify-center h-11 w-11 p-0'
                      )}
                    >
                      <cat.icon className={cn('w-5 h-5', cat.color)} />
                      <span className={cn(isNavCollapsed && "hidden")}>{cat.name}</span>
                    </Button>
                  </TooltipTrigger>
                  {isNavCollapsed && (
                    <TooltipContent side="right">
                      <p>{cat.name}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </nav>
          </div>

          <div className={cn(
            "flex flex-col border-r border-border/50 w-full",
            selectedEmail && "hidden md:flex"
          )}>
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Inbox
              </h2>
              <Button onClick={handleFetchEmails} disabled={isFetchingEmails} variant="outline" size="sm">
                {isFetchingEmails ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4"/>}
                Fetch Inbox
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="flex flex-col">
                {isFetchingEmails && Array.from({ length: 10 }).map((_, i) => (
                   <div key={i} className="flex flex-col gap-2 p-4 border-b border-border/20">
                     <Skeleton className="h-5 w-1/3" />
                     <Skeleton className="h-4 w-2/3" />
                     <Skeleton className="h-4 w-full" />
                   </div>
                ))}
                {!isFetchingEmails && fetchError && (
                  <Alert variant="destructive" className="m-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Fetching Emails</AlertTitle>
                    <AlertDescription>{fetchError}</AlertDescription>
                  </Alert>
                )}
                {!isFetchingEmails && !fetchError && emails.length === 0 && (
                  <div className="text-center p-10 text-muted-foreground">
                    <Inbox className="mx-auto h-12 w-12" />
                    <p className="mt-4">Your inbox is empty or you haven't fetched it yet.</p>
                  </div>
                )}
                {!isFetchingEmails && emails.map((email) => (
                  <button
                    key={email.id}
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
                    <h4 className={cn("text-sm font-medium", !email.read && "text-primary-foreground/80")}>{email.subject}</h4>
                    <p className='text-sm text-muted-foreground truncate'>
                      {email.body}
                    </p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {selectedEmail && (
            <div className="flex flex-col bg-background flex-1">
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
                <ScrollArea className="flex-1 p-6">
                  <h1 className="text-2xl font-bold mb-6">{selectedEmail.subject}</h1>
                  <p className="text-base whitespace-pre-wrap leading-7">
                    {selectedEmail.body}
                  </p>
                </ScrollArea>
                 <div className="p-6 border-t border-border/50 bg-background space-y-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline"><Reply className="mr-2 h-4 w-4" /> Reply</Button>
                    <Button variant="outline"><ReplyAll className="mr-2 h-4 w-4" /> Reply All</Button>
                    <Button variant="outline"><Forward className="mr-2 h-4 w-4" /> Forward</Button>
                  </div>
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
                </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
