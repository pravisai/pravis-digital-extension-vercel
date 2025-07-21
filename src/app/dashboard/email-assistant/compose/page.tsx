
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
import { Label } from '@/components/ui/label';
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
} from "@/components/ui/alert-dialog"

const composeSchema = z.object({
  recipient: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(1, { message: "Subject cannot be empty." }),
  body: z.string().min(1, { message: "Body cannot be empty." }),
});

type ComposeFormValues = z.infer<typeof composeSchema>;

export default function ComposeEmailPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const form = useForm<ComposeFormValues>({
    resolver: zodResolver(composeSchema),
    defaultValues: {
      recipient: '',
      subject: '',
      body: '',
    },
  });

  const onSubmit = async (data: ComposeFormValues) => {
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
      await sendEmail(accessToken, data.recipient, data.subject, data.body);
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
                    <div className="p-4 space-y-4 border-b">
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
                         <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2 border-t pt-2">
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
                    </div>
                    <div className="flex-1 min-h-0">
                         <FormField
                            control={form.control}
                            name="body"
                            render={({ field }) => (
                                <FormItem className="h-full">
                                    <FormControl>
                                        <Textarea
                                            className="h-full w-full resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 p-4"
                                            placeholder="Compose your epic..."
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <footer className="p-4 border-t flex justify-between items-center">
                        <Button type="submit" disabled={isSending}>
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
