
"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, PenSquare, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { socialMediaChat } from "@/ai/flows/social-media-chat"
import { Skeleton } from "./ui/skeleton"
import { Label } from "./ui/label"
import { FadeIn } from "./animations/fade-in"

const postGeneratorSchema = z.object({
  platform: z.string().min(1, { message: "Please select a platform." }),
  instructions: z.string().min(10, { message: "Please provide at least 10 characters of instructions." }),
});

export function SocialPostGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof postGeneratorSchema>>({
    resolver: zodResolver(postGeneratorSchema),
    defaultValues: {
      platform: "Twitter",
      instructions: "",
    },
  });

  async function onCreatePost(values: z.infer<typeof postGeneratorSchema>) {
    setIsGenerating(true);
    setGeneratedPost("");

    try {
      const result = await socialMediaChat({
        platform: values.platform,
        instructions: values.instructions,
      });
      setGeneratedPost(result.post);
    } catch (error) {
      console.error("Failed to generate post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate post. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onCreatePost)} className="space-y-6">
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Platform</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Twitter">Twitter</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Threads">Threads</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
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
                <FormLabel>Specific Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Write a tweet about the future of AI in healthcare, in an optimistic tone."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isGenerating} className="w-full">
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenSquare className="mr-2 h-4 w-4" />}
            Create Post
          </Button>
        </form>
      </Form>
      
      {(isGenerating || generatedPost) && (
        <FadeIn className="mt-6 space-y-2">
          <Label>Generated Post</Label>
          {isGenerating && !generatedPost ? (
            <div className="space-y-2 rounded-md border border-input p-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <Textarea
              value={generatedPost}
              readOnly
              rows={6}
              className="bg-secondary"
            />
          )}
          {generatedPost && !isGenerating && (
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setGeneratedPost('')}>Discard</Button>
              <Button><Send className="mr-2 h-4 w-4" /> Post</Button>
            </div>
          )}
        </FadeIn>
      )}
    </div>
  )
}
