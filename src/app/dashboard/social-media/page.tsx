import { SocialMediaChat } from "@/components/social-media-chat";
import { FadeIn } from "@/components/animations/fade-in";

export default function SocialMediaPage() {
  return (
    <FadeIn className="h-full flex flex-col">
        <SocialMediaChat />
    </FadeIn>
  )
}
