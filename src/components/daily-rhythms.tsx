"use client"

import { BrainCircuit, Calendar, Mail, Share2 } from "lucide-react";
import Link from "next/link";
import React, { useState, useRef } from "react";

const cubeFaces = [
    {
        href: "/dashboard/email-assistant",
        icon: Mail,
        title: "Email Draft",
        color: "text-primary",
        className: "cube__face--front",
    },
    {
        href: "#",
        icon: Calendar,
        title: "Calendar",
        color: "text-primary",
        className: "cube__face--right",
    },
    {
        href: "#",
        icon: Share2,
        title: "Social Media",
        color: "text-destructive",
        className: "cube__face--back",
    },
    {
        href: "/dashboard/clarity-chat",
        icon: BrainCircuit,
        title: "Loud Think",
        color: "text-destructive",
        className: "cube__face--left",
    },
];

export function DailyRhythms() {
    const [rotationY, setRotationY] = useState(0);
    const pointerStartX = useRef(0);
    const didMove = useRef(false);

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        pointerStartX.current = e.clientX;
        didMove.current = false;
        // Capture the pointer to ensure we get subsequent events
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        // Check if primary button is held down (for mouse)
        if (e.buttons !== 1) return;
        
        // A movement of 10px or more is considered a swipe/drag
        if (!didMove.current && Math.abs(e.clientX - pointerStartX.current) > 10) {
            didMove.current = true;
        }
    };

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        // Release pointer capture
        e.currentTarget.releasePointerCapture(e.pointerId);

        if (didMove.current) { // It was a swipe/drag
            const deltaX = e.clientX - pointerStartX.current;
            // A swipe of 50px or more triggers rotation
            if (deltaX > 50) { // Swipe Right
                setRotationY(r => r + 90);
            } else if (deltaX < -50) { // Swipe Left
                setRotationY(r => r - 90);
            }
        }
        // If not a swipe, the click will be handled by the Link component
    };
    
    return (
        <div className="space-y-8">
            <section>
                <h2 className="text-2xl font-bold font-headline mb-12 text-center">For You</h2>
                <div className="flex justify-center items-center">
                    <div 
                        className="scene"
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        style={{ touchAction: 'none', cursor: 'grab' }}
                    >
                        <div 
                            className="cube" 
                            style={{ transform: `translateZ(-125px) rotateY(${rotationY}deg)` }}
                        >
                            {cubeFaces.map((face) => (
                                <Link
                                    href={face.href}
                                    key={face.title}
                                    className={`cube__face ${face.className}`}
                                    onClick={(e) => {
                                        // Prevent navigation if the user was dragging/swiping
                                        if (didMove.current) {
                                            e.preventDefault();
                                        }
                                    }}
                                    draggable={false} // Prevent default browser drag behavior
                                >
                                    <face.icon className={`w-24 h-24 ${face.color}`} strokeWidth={1} />
                                    <p className="font-semibold text-xl">{face.title}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
