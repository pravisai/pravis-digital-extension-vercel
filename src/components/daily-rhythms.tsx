
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
    
    // Refs for managing interaction state without causing re-renders
    const isPointerDown = useRef(false);
    const isDragging = useRef(false);
    const pointerStart = useRef({ x: 0, y: 0 });
    const rotationOnDragStart = useRef({ x: 20, y: 30 });
    const autoRotateFrameId = useRef<number>();

    // Auto-rotation logic
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
        isDragging.current = false;
        pointerStart.current = { x: e.clientX, y: e.clientY };
        rotationOnDragStart.current = rotation;
        e.currentTarget.setPointerCapture(e.pointerId);
    }, [rotation, stopAutoRotation]);

    const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!isPointerDown.current) return;

        const dx = e.clientX - pointerStart.current.x;
        const dy = e.clientY - pointerStart.current.y;

        // If pointer moves more than a 5px threshold, it's a drag
        if (!isDragging.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
            isDragging.current = true;
        }

        if (isDragging.current) {
            // Horizontal rotation only
            const newY = rotationOnDragStart.current.y + dx * 0.5; // Drag sensitivity
            setRotation({ x: 20, y: newY });
        }
    }, []);

    const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        isPointerDown.current = false;

        // If it wasn't a drag, it was a click
        if (!isDragging.current) {
            const targetElement = e.target as HTMLElement;
            const faceElement = targetElement.closest<HTMLElement>('[data-href]');
            if (faceElement?.dataset.href) {
                router.push(faceElement.dataset.href);
            }
        }
        
        // Resume auto-rotation after a delay
        setTimeout(startAutoRotation, 3000);
    }, [router, startAutoRotation]);
    
    // Handle cases where the pointer leaves the component while dragging
    const onPointerLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (isPointerDown.current) {
            onPointerUp(e);
        }
    }, [onPointerUp]);
    
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
                        onPointerLeave={onPointerLeave}
                        style={{ cursor: 'grab', touchAction: 'none' }}
                    >
                        <div 
                            className="cube" 
                            style={{ 
                                transform: `translateZ(-125px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                                // Disable CSS transition during drag for better performance
                                transition: isDragging.current ? 'none' : 'transform 0.5s ease-out'
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
