
"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, PenSquare, Send, Paperclip } from "lucide-react"

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
  imageDataUri: z.string().optional(),
});

export function SocialPostGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof postGeneratorSchema>>({
    resolver: zodResolver(postGeneratorSchema),
    defaultValues: {
      platform: "Twitter",
      instructions: "",
      imageDataUri: undefined,
    },
  });

  const imageDataUri = form.watch("imageDataUri");

  async function onCreatePost(values: z.infer<typeof postGeneratorSchema>) {
    setIsGenerating(true);
    setGeneratedPost("");

    try {
      const result = await socialMediaChat({
        platform: values.platform,
        instructions: values.instructions,
        imageDataUri: values.imageDataUri,
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("imageDataUri", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

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

          {imageDataUri && (
            <div className="space-y-2">
              <Label>Image Preview</Label>
              <div className="relative w-32 h-32 rounded-md overflow-hidden">
                <Image src={imageDataUri} alt="Preview" layout="fill" objectFit="cover" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => form.setValue("imageDataUri", undefined)}
                >
                  X
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleAttachmentClick}>
                <Paperclip className="mr-2 h-4 w-4" />
                Add Image
            </Button>
            <Button type="submit" disabled={isGenerating} className="flex-grow">
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenSquare className="mr-2 h-4 w-4" />}
              Create Post
            </Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
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
