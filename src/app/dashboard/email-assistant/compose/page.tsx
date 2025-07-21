

"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Loader2, Send, Trash2, ArrowLeft, PenSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getStoredAccessToken } from '@/lib/firebase/auth';
import { sendEmail } from '@/lib/gmail';
import { FadeIn } from '@/components/animations/fade-in';
import { Typewriter } from '@/components/animations/typewriter';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { draftEmailReplies } from '@/ai/flows/draft-email-replies';
import { Separator } from '@/components/ui/separator';

const composeSchema = z.object({
  recipient: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(1, { message: "Subject cannot be empty." }),
  instructions: z.string().min(1, { message: "Instructions cannot be empty." }),
  tone: z.string().min(1, { message: "Please select a tone." }),
  finalBody: z.string(),
});

type ComposeFormValues = z.infer<typeof composeSchema>;

export default function ComposeEmailPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [generatedBody, setGeneratedBody] = useState("");

  const form = useForm<ComposeFormValues>({
    resolver: zodResolver(composeSchema),
    defaultValues: {
      recipient: '',
      subject: '',
      instructions: '',
      tone: 'Friendly',
      finalBody: '',
    },
  });

  const { setValue, watch } = form;
  const finalBodyValue = watch('finalBody');

  const handleDraftEmail = async () => {
    const { recipient, subject, instructions, tone } = form.getValues();
    if (!recipient || !subject || !instructions) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill in recipient, subject, and instructions before drafting.',
      });
      return;
    }

    setIsDrafting(true);
    setGeneratedBody("");
    try {
      const result = await draftEmailReplies({
        emailContent: `This is a new email. Instructions for the body: ${instructions}`,
        tone: tone,
        parameters: `Subject: ${subject}`,
      });
      setGeneratedBody(result.reply);
      setValue('finalBody', result.reply);
    } catch (error) {
      console.error("Failed to draft email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to draft email. Please try again.",
      });
    } finally {
      setIsDrafting(false);
    }
  };

  const onSubmit = async (data: ComposeFormValues) => {
    if (!data.finalBody) {
        toast({
            variant: 'destructive',
            title: 'Empty Body',
            description: 'Please draft an email or write content in the final body before sending.',
        });
        return;
    }
    
    setIsSending(true);
    const accessToken = getStoredAccessToken();

    if (!accessToken) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to send emails. Please refresh the page.',
      });
      setIsSending(false);
      return;
    }

    try {
      await sendEmail(accessToken, data.recipient, data.subject, data.finalBody);
      toast({
        title: 'Email Sent!',
        description: `Your message to ${data.recipient} has been sent.`,
      });
      router.push('/dashboard/email-assistant/inbox');
    } catch (error: any) {
      console.error('Failed to send email:', error);
      toast({
        variant: 'destructive',
        title: 'Sending Failed',
        description: error.message || 'Could not send the email. Please try again.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <FadeIn className="h-full flex flex-col p-4 md:p-6 bg-background">
        <div className="flex-1 flex flex-col bg-card border rounded-lg shadow-lg overflow-hidden">
            <header className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Typewriter text="Compose New Email" className="text-xl font-bold tracking-tight" />
                </div>
            </header>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                        <FormField
                            control={form.control}
                            name="recipient"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormLabel className="text-muted-foreground w-16 text-right">To</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                            placeholder="recipient@example.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="pl-16" />
                                </FormItem>
                            )}
                        />
                         <Separator />
                         <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormLabel className="text-muted-foreground w-16 text-right">Subject</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                            placeholder="Your email subject"
                                            {...field}
                                        />
                                    </FormControl>
                                     <FormMessage className="pl-16" />
                                </FormItem>
                            )}
                        />
                         <Separator />
                          <FormField
                            control={form.control}
                            name="tone"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                <FormLabel className="text-muted-foreground w-16 text-right">Tone</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0">
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
                            name="instructions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea className="min-h-[120px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none" placeholder="Write instructions for Pravis here... e.g., Announce the new product launch for next Tuesday. Mention the key features: faster speed, new UI, and better collaboration." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" onClick={handleDraftEmail} disabled={isDrafting}>
                            {isDrafting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenSquare className="mr-2 h-4 w-4" />}
                            Draft with Pravis
                        </Button>
                         
                        {(isDrafting || generatedBody) && (
                            <div className="space-y-2 pt-4">
                              <Label htmlFor="finalBody">Generated Email Body (Editable)</Label>
                              {isDrafting ? (
                                <div className="space-y-2 rounded-md border border-input p-4">
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-3/4" />
                                </div>
                              ) : (
                                <FormField
                                    control={form.control}
                                    name="finalBody"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    id="finalBody"
                                                    rows={8}
                                                    className="bg-background"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                              )}
                            </div>
                          )}
                    </div>
                    <footer className="p-4 border-t flex justify-between items-center bg-background/50">
                        <Button type="submit" disabled={isSending || isDrafting || !finalBodyValue}>
                            {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Send
                        </Button>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" type="button" disabled={isSending}>
                                    <Trash2 className="h-5 w-5 text-muted-foreground" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Discard this draft?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to discard this email? This action cannot be undone.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => router.push('/dashboard/email-assistant')}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    Discard
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </footer>
                </form>
            </Form>
        </div>
    </FadeIn>
  );
}
