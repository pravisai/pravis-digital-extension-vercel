import { ClarityChat } from "@/components/clarity-chat";
import { FadeIn } from "@/components/animations/fade-in";

export default function ClarityChatPage() {
    return (
        <FadeIn className="h-full flex flex-col">
            <ClarityChat />
        </FadeIn>
    )
}
