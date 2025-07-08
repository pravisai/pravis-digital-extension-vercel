
"use client"

import React, { useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, Calendar, Share2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const modules = [
    {
      href: "/dashboard/creative-partner",
      icon: BrainCircuit,
      label: "Loud Think",
      description: "AI-powered brainstorming and productivity suite.",
      bgClass: "bg-purple-600/10",
      iconClass: "text-purple-400",
      face: "front"
    },
    {
      href: "/dashboard/calendar",
      icon: Calendar,
      label: "Calendar",
      description: "Manage your schedule and events seamlessly.",
      bgClass: "bg-sky-600/10",
      iconClass: "text-sky-400",
      face: "right"
    },
    {
      href: "/dashboard/social-media",
      icon: Share2,
      label: "Socials",
      description: "Connect and manage your social media presence.",
      bgClass: "bg-rose-600/10",
      iconClass: "text-rose-400",
      face: "back"
    },
    {
      href: "/dashboard/email-assistant",
      icon: Mail,
      label: "Email Assistant",
      description: "Draft replies and manage your inbox with AI.",
      bgClass: "bg-emerald-600/10",
      iconClass: "text-emerald-400",
      face: "left"
    },
];

export function Modules() {
    const router = useRouter();
    const cubeRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const currentRotationRef = useRef(0);
    const didDragRef = useRef(false);

    const handleDragStart = useCallback((clientX: number) => {
        isDraggingRef.current = true;
        startXRef.current = clientX;
        didDragRef.current = false;
        if (cubeRef.current) {
            cubeRef.current.style.transition = 'none';
            cubeRef.current.style.cursor = 'grabbing';
        }
    }, []);

    const handleDragMove = useCallback((clientX: number) => {
        if (!isDraggingRef.current || !cubeRef.current) return;

        const deltaX = clientX - startXRef.current;
        if (Math.abs(deltaX) > 5) { // Threshold to differentiate click from drag
            didDragRef.current = true;
        }

        const rotationSpeed = 0.5;
        const rotation = currentRotationRef.current + (deltaX * rotationSpeed);
        cubeRef.current.style.transform = `rotateY(${rotation}deg)`;
    }, []);

    const handleDragEnd = useCallback(() => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;

        if (cubeRef.current) {
            cubeRef.current.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            cubeRef.current.style.cursor = 'grab';

            const currentTransform = cubeRef.current.style.transform;
            const match = currentTransform.match(/rotateY\(([^deg]+)deg\)/);
            const currentRotation = match ? parseFloat(match[1]) : currentRotationRef.current;

            const snapRotation = Math.round(currentRotation / 90) * 90;
            currentRotationRef.current = snapRotation;
            cubeRef.current.style.transform = `rotateY(${snapRotation}deg)`;
        }
    }, []);

    const handleFaceClick = (href: string) => {
        if (didDragRef.current) return;
        router.push(href);
    };

    useEffect(() => {
        const cubeEl = cubeRef.current;
        if (!cubeEl) return;

        const onMouseDown = (e: MouseEvent) => handleDragStart(e.clientX);
        const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX);
        const onMouseUp = () => handleDragEnd();

        const onTouchStart = (e: TouchEvent) => handleDragStart(e.touches[0].clientX);
        const onTouchMove = (e: TouchEvent) => handleDragMove(e.touches[0].clientX);
        const onTouchEnd = () => handleDragEnd();

        cubeEl.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        cubeEl.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('touchend', onTouchEnd);
        
        cubeEl.addEventListener('contextmenu', (e) => e.preventDefault());

        return () => {
            cubeEl.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);

            cubeEl.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [handleDragStart, handleDragMove, handleDragEnd]);

    return (
        <section>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">Modules</h2>
            <div className="cube-wrapper">
                <div className="cube-container">
                    <div ref={cubeRef} className="cube">
                        {modules.map((item) => (
                            <div
                                key={item.label}
                                className={cn("cube-face", item.face)}
                                onClick={() => handleFaceClick(item.href)}
                            >
                                <div className={cn("module-icon", item.bgClass)}>
                                    <item.icon className={cn("w-7 h-7", item.iconClass)} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{item.label}</h3>
                                    <p className="text-muted-foreground text-sm">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
