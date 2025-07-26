
"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, PenSquare, ClipboardCopy, RotateCcw, Share2, Save, Paperclip, Camera, FileText, Mic, MapPin, BarChart3, Image as ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { socialMediaChat } from "@/ai/flows/social-media-chat"
import { Skeleton } from "./ui/skeleton"
import { Label } from "./ui/label"
import { FadeIn } from "./animations/fade-in"
import { copyToClipboard } from "@/lib/clipboard"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "./ui/tooltip"

const postGeneratorSchema = z.object({
  platform: z.string().min(1, { message: "Please select a platform." }),
  instructions: z.string().min(10, { message: "Please provide at least 10 characters of instructions." }),
  imageDataUri: z.string().optional(),
});

type PostGeneratorValues = z.infer<typeof postGeneratorSchema>;

const attachmentOptions = [
    { icon: FileText, label: 'Document', color: 'bg-indigo-500' },
    { icon: Camera, label: 'Camera', color: 'bg-red-500' },
    { icon: ImageIcon, label: 'Gallery', color: 'bg-purple-500', action: 'gallery' },
    { icon: Mic, label: 'Audio', color: 'bg-orange-500' },
    { icon: MapPin, label: 'Location', color: 'bg-green-500' },
    { icon: BarChart3, label: 'Poll', color: 'bg-cyan-500' },
]

export function SocialPostGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [originalGeneratedPost, setOriginalGeneratedPost] = useState("");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PostGeneratorValues>({
    resolver: zodResolver(postGeneratorSchema),
    defaultValues: {
      platform: "Twitter",
      instructions: "",
      imageDataUri: undefined,
    },
  });

  const imageDataUri = form.watch("imageDataUri");
  const platform = form.watch("platform");
  const isPostEdited = generatedPost !== originalGeneratedPost && originalGeneratedPost !== "";

  async function onCreatePost(values: PostGeneratorValues) {
    setIsGenerating(true);
    setGeneratedPost("");
    setOriginalGeneratedPost("");

    try {
      const result = await socialMediaChat({
        platform: values.platform,
        instructions: values.instructions,
        imageDataUri: values.imageDataUri,
      });
      setGeneratedPost(result.post);
      setOriginalGeneratedPost(result.post);
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

  const handleAttachmentClick = (action?: string) => {
    if (action === 'gallery') {
      fileInputRef.current?.click();
    } else {
        toast({ title: "Coming Soon", description: "This feature is not yet implemented." })
    }
  };
  
  const handleCopy = async () => {
    const success = await copyToClipboard(generatedPost);
    if (success) {
      toast({
        title: "Copied!",
        description: "Post content copied to clipboard.",
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

  const handleUndo = () => {
    setGeneratedPost(originalGeneratedPost);
  }

  const handleDiscard = () => {
    setGeneratedPost('');
    setOriginalGeneratedPost('');
  }

  const handlePost = async () => {
    const text = encodeURIComponent(generatedPost);
    let url = "";

    switch (platform) {
      case "Twitter":
        url = `https://twitter.com/intent/tweet?text=${text}`;
        break;
      case "LinkedIn":
        await copyToClipboard(generatedPost);
        toast({ title: "Copied to clipboard!", description: "Paste the content into your new LinkedIn post." });
        url = 'https://www.linkedin.com/feed/';
        break;
      case "Facebook":
        await copyToClipboard(generatedPost);
        toast({ title: "Copied to clipboard!", description: "Paste the content into your new Facebook post." });
        url = `https://www.facebook.com/`;
        break;
      case "Threads":
        await copyToClipboard(generatedPost);
        toast({ title: "Copied to clipboard!", description: "Paste the content into your new Threads post." });
        url = 'https://www.threads.net/';
        break;
    }
    
    if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
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

          <div className="space-y-2">
            <FormLabel>Attachments</FormLabel>
            <TooltipProvider>
                <div className="flex justify-around items-center p-2 rounded-lg">
                    {attachmentOptions.map((opt) => (
                        <Tooltip key={opt.label}>
                            <TooltipTrigger asChild>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleAttachmentClick(opt.action)}
                                    className={`h-14 w-14 rounded-full text-white ${opt.color} hover:opacity-90 hover:text-white transition-opacity`}
                                >
                                    <opt.icon className="h-6 w-6" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{opt.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </TooltipProvider>
          </div>
          
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
            Generate
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </form>
      </Form>
      
      {(isGenerating || generatedPost || originalGeneratedPost) && (
        <FadeIn className="mt-6 space-y-2">
           <div className="relative">
             <Label>Generated Post</Label>
              {isPostEdited && (
                <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-7 w-7" onClick={handleUndo}>
                    <RotateCcw className="h-4 w-4"/>
                    <span className="sr-only">Undo Changes</span>
                </Button>
              )}
            </div>
          {isGenerating && !generatedPost ? (
            <div className="space-y-2 rounded-md border border-input p-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <Textarea
              value={generatedPost}
              onChange={(e) => setGeneratedPost(e.target.value)}
              rows={6}
              className="bg-secondary"
            />
          )}
          {generatedPost && !isGenerating && (
            <div className="flex justify-between items-center pt-2">
              <Button variant="ghost" onClick={handleDiscard}>Discard</Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCopy}>
                  <ClipboardCopy className="mr-2 h-4 w-4" /> Copy
                </Button>
                 <Button variant="outline" onClick={() => toast({ title: "Coming soon!"})}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
                <Button onClick={handlePost}><Share2 className="mr-2 h-4 w-4" /> Post</Button>
              </div>
            </div>
          )}
        </FadeIn>
      )}
    </div>
  )
}

    