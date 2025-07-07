
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
    
    const isPointerDown = useRef(false);
    const isDragging = useRef(false);
    const pointerStart = useRef({ x: 0, y: 0 });
    const rotationOnDragStart = useRef({ x: 20, y: 30 });
    const autoRotateFrameId = useRef<number>();

    const stopAutoRotation = useCallback(() => {
        if (autoRotateFrameId.current) {
            cancelAnimationFrame(autoRotateFrameId.current);
            autoRotateFrameId.current = undefined;
        }
    }, []);

    const startAutoRotation = useCallback(() => {
        stopAutoRotation();
        if (isPointerDown.current) return;
        
        const animate = () => {
            setRotation(prev => ({
                x: 20,
                y: (prev.y + 0.1) % 360,
            }));
            autoRotateFrameId.current = requestAnimationFrame(animate);
        };
        autoRotateFrameId.current = requestAnimationFrame(animate);
    }, [stopAutoRotation]);
    
    useEffect(() => {
        startAutoRotation();
        return stopAutoRotation;
    }, [startAutoRotation, stopAutoRotation]);

    const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        stopAutoRotation();
        isPointerDown.current = true;
        isDragging.current = false; // Reset drag state on new press
        pointerStart.current = { x: e.clientX, y: e.clientY };
        rotationOnDragStart.current = rotation;
        e.currentTarget.setPointerCapture(e.pointerId);
    }, [rotation, stopAutoRotation]);

    const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!isPointerDown.current) return;

        const dx = e.clientX - pointerStart.current.x;
        const dy = e.clientY - pointerStart.current.y;

        if (!isDragging.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
            isDragging.current = true;
        }

        if (isDragging.current) {
            const newY = rotationOnDragStart.current.y + dx * 0.5;
            setRotation({ x: 20, y: newY });
        }
    }, []);

    const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if(e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        isPointerDown.current = false;
        
        // Single-click navigation is removed. Navigation is now handled by onDoubleClick.
        
        setTimeout(startAutoRotation, 3000);
    }, [startAutoRotation]);
    
    const onPointerLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (isPointerDown.current) {
            onPointerUp(e);
        }
    }, [onPointerUp]);

    const handleDoubleClick = (href: string) => {
        // We only navigate if the user wasn't dragging.
        // The browser's double-click event is typically suppressed during a drag,
        // but this is an extra safeguard.
        if (!isDragging.current) {
            router.push(href);
        }
    };
    
    return (
        <div className="space-y-8">
            <section>
                <h2 className="text-2xl font-bold font-headline mb-12 text-center">For You</h2>
                <div 
                    className="scene"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerLeave={onPointerLeave}
                    style={{ cursor: 'grab', touchAction: 'none' }}
                >
                    <div 
                        className="cube" 
                        style={{ 
                            transform: `translateZ(-125px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                            transition: isDragging.current ? 'none' : 'transform 0.5s ease-out'
                        }}
                    >
                        {cubeFaces.map((face, i) => (
                            <div
                                key={face.title}
                                className={`cube__face ${face.className}`}
                                style={{ '--i': i } as React.CSSProperties}
                                data-href={face.href}
                                onDoubleClick={() => handleDoubleClick(face.href)}
                            >
                                <face.icon className={`w-24 h-24 ${face.color}`} strokeWidth={1} />
                                <p className="font-semibold text-xl">{face.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
