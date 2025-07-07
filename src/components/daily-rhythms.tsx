"use client"

import { BrainCircuit, Calendar, Mail, Share2 } from "lucide-react";
import Link from "next/link";
import React, { useState, useRef, useEffect, useCallback } from "react";

const cubeFaces = [
    {
        href: "/dashboard/email-assistant",
        icon: Mail,
        title: "Email Draft",
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
    const [rotation, setRotation] = useState({ x: 20, y: 30 });
    const [isInteracting, setIsInteracting] = useState(false);
    
    const pointerStart = useRef({ x: 0 });
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
        } else {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        }
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isInteracting, animate]);

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        pointerStart.current = { x: e.clientX };
        didMove.current = false;
        setIsInteracting(true);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isInteracting || e.buttons !== 1) return;
        
        const dx = e.clientX - pointerStart.current.x;

        if (!didMove.current && Math.abs(dx) > 10) {
            didMove.current = true;
        }

        if(didMove.current) {
            const newY = lastRotation.current.y + dx;
            setRotation({ x: 20, y: newY }); // Only update Y rotation
        }
    };
    
    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (didMove.current) {
            lastRotation.current = { ...rotation };
        }
        e.currentTarget.releasePointerCapture(e.pointerId);
        setIsInteracting(false);
    };

    const onSceneLeave = () => {
        if (isInteracting) {
             setIsInteracting(false);
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
                        style={{ touchAction: 'pan-y', cursor: 'grab' }}
                    >
                        <div 
                            className="cube" 
                            style={{ 
                                transform: `translateZ(-125px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                            }}
                        >
                            {cubeFaces.map((face, i) => (
                                <Link
                                    href={face.href}
                                    key={face.title}
                                    className={`cube__face ${face.className}`}
                                    style={{ '--i': i } as React.CSSProperties}
                                    onClick={(e) => {
                                        if (didMove.current) {
                                            e.preventDefault();
                                        }
                                    }}
                                    draggable={false}
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
