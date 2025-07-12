import { SocialPostGenerator } from "@/components/social-media-chat";
import { FadeIn } from "@/components/animations/fade-in";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SocialMediaPage() {
  return (
    <FadeIn className="h-full flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create with Pravis</CardTitle>
          <CardDescription>Generate a social media post with AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <SocialPostGenerator />
        </CardContent>
      </Card>
    </FadeIn>
  )
}
