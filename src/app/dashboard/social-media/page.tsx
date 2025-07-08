import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";

export default function SocialMediaPage() {
  return (
    <div className="flex justify-center items-start pt-10 p-4">
      <FadeIn>
        <Card className="w-full max-w-2xl">
          <CardHeader className="items-center">
              <Share2 className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Social Media Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              This is a placeholder for your social media management tools.
            </p>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
