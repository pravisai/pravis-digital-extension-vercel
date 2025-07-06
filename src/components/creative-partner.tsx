"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React, { useState } from "react"
import { facilitateCreativeBrainstorming, FacilitateCreativeBrainstormingOutput } from "@/ai/flows/facilitate-creative-brainstorming"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Loader2 } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }),
  problemStatement: z.string().min(10, { message: "Problem statement must be at least 10 characters." }),
  desiredOutcome: z.string().min(10, { message: "Desired outcome must be at least 10 characters." }),
  knownConstraints: z.string().optional(),
})

export function CreativePartner() {
  const [result, setResult] = useState<FacilitateCreativeBrainstormingOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      problemStatement: "",
      desiredOutcome: "",
      knownConstraints: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    try {
      const response = await facilitateCreativeBrainstorming(values)
      setResult(response)
    } catch (error) {
      console.error("Brainstorming failed:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate brainstorming session. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const ResultSkeleton = () => (
    <div className="mt-8 space-y-6">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-8 w-1/4" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
      </div>
    </div>
  )


  return (
    <Card className="w-full shadow-lg border-primary/40 shadow-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Creative Partner</CardTitle>
        <CardDescription>Stuck on a problem? Let Pravis help you brainstorm innovative solutions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-headline">Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Improving Team Collaboration" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="problemStatement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-headline">Problem Statement</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the core problem you're trying to solve." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desiredOutcome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-headline">Desired Outcome</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What does a successful solution look like?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="knownConstraints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-headline">Known Constraints (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Budget limitations, specific technologies" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full shadow-lg shadow-primary/20">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
              Start Brainstorming
            </Button>
          </form>
        </Form>
        
        {isLoading && <ResultSkeleton />}

        {result && (
          <div className="mt-8 space-y-6">
            <h3 className="text-2xl font-headline text-primary">Brainstorming Results</h3>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Session Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{result.brainstormingSession}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Potential Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5">
                  {result.potentialSolutions.map((solution, i) => <li key={i}>{solution}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5">
                  {result.keyInsights.map((insight, i) => <li key={i}>{insight}</li>)}
                </ul>
              </CardContent>
            </Card>
            {result.nextSteps && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                   <p className="whitespace-pre-wrap">{result.nextSteps}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
