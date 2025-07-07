
"use client"

import { BrainCircuit, Calendar, Mail, Share2 } from "lucide-react";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const cubeFaces = [
    {
        href: "/dashboard/email-assistant",
        icon: Mail,
        title: "Email Assistant",
        color: "text-cyan-400",
        className: "cube__face--front",
    },
    {
        href: "/dashboard/calendar",
        icon: Calendar,
        title: "Calendar",
        color: "text-cyan-400",
        className: "cube__face--right",
    },
    {
        href: "/dashboard/social-media",
        icon: Share2,
        title: "Social Media",
        color: "text-blue-400",
        className: "cube__face--back",
    },
    {
        href: "/dashboard/clarity-chat",
        icon: BrainCircuit,
        title: "Loud Think",
        color: "text-blue-400",
        className: "cube__face--left",
    },
];

export function DailyRhythms() {
    const router = useRouter();
    const [rotation, setRotation] = useState({ x: 20, y: 30 });
    const [isInteracting, setIsInteracting] = useState(false);
    
    const lastRotation = useRef({x: 20, y: 30});
    const pointerStart = useRef({ x: 0, y: 0 });
    const didMove = useRef(false);
    const animationFrameId = useRef<number>();

    const animate = useCallback(() => {
        if (!isInteracting) {
            setRotation(prev => {
                const newRotation = {
                    x: 20, // Lock vertical rotation
                    y: (prev.y + 0.1) % 360,
                };
                lastRotation.current = newRotation;
                return newRotation;
            });
        }
        animationFrameId.current = requestAnimationFrame(animate);
    }, [isInteracting]);

    useEffect(() => {
        animationFrameId.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [animate]);

    const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        didMove.current = false;
        setIsInteracting(true);
        pointerStart.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.setPointerCapture(e.pointerId);
    }, []);

    const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!isInteracting) return;

        const dx = e.clientX - pointerStart.current.x;
        
        // Use a threshold to distinguish between a click and a drag
        if (!didMove.current && Math.abs(dx) > 10) {
            didMove.current = true;
        }

        if (didMove.current) {
            const newY = lastRotation.current.y + dx;
            setRotation({ x: 20, y: newY });
        }
    }, [isInteracting]);
    
    const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setIsInteracting(false);

        if (didMove.current) {
            // If the user dragged, update the last rotation value
            lastRotation.current = { ...rotation };
        } else {
            // If the user did not drag (i.e., a click/tap), handle navigation
            const targetElement = e.target as HTMLElement;
            const faceElement = targetElement.closest<HTMLElement>('[data-href]');
            
            if (faceElement?.dataset.href) {
                router.push(faceElement.dataset.href);
            }
        }
    }, [router, rotation]);
    
    const onSceneLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (isInteracting) {
            onPointerUp(e);
        }
    }, [isInteracting, onPointerUp]);
    
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
