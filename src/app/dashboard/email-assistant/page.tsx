import { EmailAssistant } from "@/components/email-assistant";
import { FadeIn } from "@/components/animations/fade-in";

export default function EmailAssistantPage() {
  return (
    <FadeIn className="h-full w-full">
      <EmailAssistant />
    </FadeIn>
  );
}
