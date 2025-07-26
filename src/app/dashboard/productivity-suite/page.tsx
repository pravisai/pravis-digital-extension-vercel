
import { ProductivityChat } from "@/components/productivity-chat";
import { FadeIn } from "@/components/animations/fade-in";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ProductivitySuitePage() {
  return (
    <FadeIn className="h-full flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Productivity Suite</CardTitle>
          <CardDescription>Generate insights and content with AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductivityChat />
        </CardContent>
      </Card>
    </FadeIn>
  )
}
