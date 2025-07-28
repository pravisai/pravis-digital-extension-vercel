// src/app/dashboard/creative-partner/call/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, User } from "lucide-react";
import { PravisLogo } from "@/components/pravis-logo";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/animations/fade-in";

const ParticipantTile = ({ name, isMuted, isVideoOff, isAi = false }: { name: string, isMuted: boolean, isVideoOff: boolean, isAi?: boolean }) => (
    <div className="relative aspect-square bg-card rounded-lg flex flex-col items-center justify-center text-card-foreground p-2 overflow-hidden border border-border">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
        {isAi ? (
            <PravisLogo size={60} />
        ) : (
            <User className="h-16 w-16 text-muted-foreground" />
        )}
        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5">
            {isMuted ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
            <span className="text-sm font-medium">{name}</span>
        </div>
    </div>
);

export default function CallPage() {
    const [isSharing, setIsSharing] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    return (
        <FadeIn className="h-full flex flex-col bg-background p-4">
            <div className="flex-1 bg-card rounded-lg flex items-center justify-center relative border border-border">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isSharing ? "You're sharing your screen" : "Ready to start the call?"}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {isSharing ? "Pravis can see your screen now." : "Click below to share your screen with Pravis."}
                    </p>
                    <Button 
                        variant={isSharing ? "destructive" : "default"}
                        onClick={() => setIsSharing(!isSharing)}
                        className="mt-6"
                    >
                        {isSharing ? "Stop Sharing" : "Start Sharing"}
                    </Button>
                </div>
            </div>

            <div className="flex-shrink-0 pt-4">
                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                    <ParticipantTile name="You" isMuted={isMuted} isVideoOff={isVideoOff} />
                    <ParticipantTile name="Pravis" isMuted={true} isVideoOff={true} isAi={true} />
                </div>
                
                <div className="flex justify-center items-center gap-4 mt-6">
                    <Button variant="secondary" size="icon" className="h-14 w-14 rounded-full" onClick={() => setIsMuted(!isMuted)}>
                        {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                    </Button>
                     <Button variant="secondary" size="icon" className="h-14 w-14 rounded-full" onClick={() => setIsVideoOff(!isVideoOff)}>
                        {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                    </Button>
                     <Button variant="secondary" size="icon" className="h-14 w-14 rounded-full" onClick={() => setIsSharing(!isSharing)}>
                        <ScreenShare className={cn("h-6 w-6", isSharing && "text-primary")} />
                    </Button>
                    <Button variant="destructive" size="icon" className="h-14 w-14 rounded-full">
                        <PhoneOff className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </FadeIn>
    );
}
