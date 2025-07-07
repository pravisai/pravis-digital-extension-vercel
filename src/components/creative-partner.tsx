
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CreativePartner() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Creative Partner</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This is where the creative partner tools will live. You can build features here to help with brainstorming, content generation, and more.
        </p>
      </CardContent>
    </Card>
  )
}
