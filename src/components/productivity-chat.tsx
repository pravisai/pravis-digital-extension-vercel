
"use client"

import React, { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, PenSquare, ClipboardCopy, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { analyzeText } from "@/ai/flows/analyze-text"
import { Skeleton } from "./ui/skeleton"
import { Label } from "./ui/label"
import { FadeIn } from "./animations/fade-in"
import { copyToClipboard } from "@/lib/clipboard"

const productivitySchema = z.object({
  task: z.string().min(1, { message: "Please select a task." }),
  instructions: z.string().min(10, { message: "Please provide at least 10 characters of instructions." }),
});

type ProductivityValues = z.infer<typeof productivitySchema>;

export function ProductivityChat() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const { toast } = useToast();

  const form = useForm<ProductivityValues>({
    resolver: zodResolver(productivitySchema),
    defaultValues: {
      task: "Analyze Text",
      instructions: "",
    },
  });

  async function onGenerate(values: ProductivityValues) {
    setIsGenerating(true);
    setGeneratedContent("");

    try {
      const result = await analyzeText({ text: values.instructions });
      setGeneratedContent(result.analysis);
    } catch (error) {
      console.error("Failed to generate content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate content. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const handleCopy = async () => {
    const success = await copyToClipboard(generatedContent);
    if (success) {
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Could not copy content to clipboard.",
      })
    }
    return success;
  };

  const handleDiscard = () => {
    setGeneratedContent('');
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onGenerate)} className="space-y-6">
          <FormField
            control={form.control}
            name="task"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Task</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a task" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Analyze Text">Analyze Text</SelectItem>
                    <SelectItem value="Summarize">Summarize</SelectItem>
                    <SelectItem value="Draft Document">Draft Document</SelectItem>
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
                <FormLabel>Instructions / Text to Process</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Provide a sentiment analysis of the following customer feedback..."
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
            Generate
          </Button>
        </form>
      </Form>
      
      {(isGenerating || generatedContent) && (
        <FadeIn className="mt-6 space-y-2">
          <Label>Generated Content</Label>
          {isGenerating && !generatedContent ? (
            <div className="space-y-2 rounded-md border border-input p-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <Textarea
              value={generatedContent}
              readOnly
              rows={6}
              className="bg-secondary"
            />
          )}
          {generatedContent && !isGenerating && (
            <div className="flex justify-between items-center pt-2">
              <Button variant="ghost" onClick={handleDiscard}>Discard</Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCopy}>
                  <ClipboardCopy className="mr-2 h-4 w-4" /> Copy
                </Button>
              </div>
            </div>
          )}
        </FadeIn>
      )}
    </div>
  )
}
