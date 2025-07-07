
"use client"

import { BrainCircuit, Calendar, Mail, Share2 } from "lucide-react";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const cubeFaces = [
    {
        href: "/dashboard/email-assistant",
        icon: Mail,
        title: "Email Assistant",
        color: "text-primary",
        className: "cube__face--front",
    },
    {
        href: "/dashboard/calendar",
        icon: Calendar,
        title: "Calendar",
        color: "text-primary",
        className: "cube__face--right",
    },
    {
        href: "/dashboard/social-media",
        icon: Share2,
        title: "Social Media",
        color: "text-primary",
        className: "cube__face--back",
    },
    {
        href: "/dashboard/clarity-chat",
        icon: BrainCircuit,
        title: "Loud Think",
        color: "text-primary",
        className: "cube__face--left",
    },
];

export function DailyRhythms() {
    const router = useRouter();
    const [rotation, setRotation] = useState({ x: 20, y: 30 });
    const [isInteracting, setIsInteracting] = useState(false);
    
    const pointerStart = useRef({ x: 0, y: 0 });
    const didMove = useRef(false);
    const lastRotation = useRef({x: 20, y: 30});
    const animationFrameId = useRef<number>();

    const animate = useCallback(() => {
        setRotation(prev => {
            const newRotation = {
                x: 20, // Lock vertical rotation
                y: (prev.y + 0.1) % 360,
            }
            lastRotation.current = newRotation;
            return newRotation;
        });
        animationFrameId.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        if (!isInteracting) {
            animationFrameId.current = requestAnimationFrame(animate);
        }
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isInteracting, animate]);

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsInteracting(true);
        
        didMove.current = false;
        pointerStart.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isInteracting) return;

        const dx = e.clientX - pointerStart.current.x;
        const dy = e.clientY - pointerStart.current.y;

        if (!didMove.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
            didMove.current = true;
        }

        if (didMove.current) {
            const newY = lastRotation.current.y + dx;
            setRotation({ x: 20, y: newY });
        }
    };
    
    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setIsInteracting(false);

        if (didMove.current) {
            lastRotation.current = { ...rotation };
        } else {
            const targetElement = e.target as HTMLElement;
            const faceElement = targetElement.closest('[data-href]');
            
            if (faceElement instanceof HTMLElement && faceElement.dataset.href) {
                router.push(faceElement.dataset.href);
            }
        }
        
        didMove.current = false;
    };
    
    const onSceneLeave = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isInteracting) {
            onPointerUp(e);
        }
    }
    
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
                        onPointerLeave={onSceneLeave}
                        style={{ cursor: 'grab' }}
                        onMouseDown={(e) => (e.currentTarget.style.cursor = 'grabbing')}
                        onMouseUp={(e) => (e.currentTarget.style.cursor = 'grab')}
                    >
                        <div 
                            className="cube" 
                            style={{ 
                                transform: `translateZ(-125px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                            }}
                        >
                            {cubeFaces.map((face, i) => (
                                <div
                                    key={face.title}
                                    className={`cube__face ${face.className}`}
                                    style={{ '--i': i } as React.CSSProperties}
                                    data-href={face.href}
                                >
                                    <face.icon className={`w-24 h-24 ${face.color}`} strokeWidth={1} />
                                    <p className="font-semibold text-xl">{face.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
