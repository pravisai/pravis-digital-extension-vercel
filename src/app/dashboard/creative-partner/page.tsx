import { BrainstormChat } from "@/components/brainstorm-chat";
import { FadeIn } from "@/components/animations/fade-in";

export default function CreativePartnerPage() {
    return (
        <FadeIn className="h-full flex flex-col">
            <BrainstormChat />
        </FadeIn>
    )
}
