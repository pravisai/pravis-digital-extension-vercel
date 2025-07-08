import { CreativePartner } from "@/components/creative-partner";
import { FadeIn } from "@/components/animations/fade-in";

export default function CreativePartnerPage() {
    return (
        <FadeIn className="w-full h-full">
            <CreativePartner />
        </FadeIn>
    )
}
