
"use client"

import React, { useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, Calendar, Share2, Mail, Cpu, Settings } from "lucide-react";
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
    {
      href: "/dashboard",
      icon: Cpu,
      label: "Pravis Core",
      description: "System Hub",
      bgClass: "bg-gray-600/10",
      iconClass: "text-gray-400",
      face: "top"
    },
    {
      href: "/dashboard",
      icon: Settings,
      label: "Settings",
      description: "Configure your experience",
      bgClass: "bg-gray-600/10",
      iconClass: "text-gray-400",
      face: "bottom"
    },
];

export function Modules() {
    const router = useRouter();
    const cubeRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const startCoordsRef = useRef({ x: 0, y: 0 });
    const currentRotationRef = useRef({ x: -20, y: 30 });
    const rotationAtDragStart = useRef({ x: 0, y: 0 });
    const didDragRef = useRef(false);
    const autoRotateIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const stopAutoRotation = useCallback(() => {
        if (autoRotateIntervalRef.current) {
            clearInterval(autoRotateIntervalRef.current);
            autoRotateIntervalRef.current = null;
        }
    }, []);

    const startAutoRotation = useCallback(() => {
        stopAutoRotation();
        autoRotateIntervalRef.current = setInterval(() => {
            if (!isDraggingRef.current) {
                currentRotationRef.current.y += 0.1;
                currentRotationRef.current.x += 0.02;
                if (cubeRef.current) {
                    const { x, y } = currentRotationRef.current;
                    cubeRef.current.style.transition = 'none';
                    cubeRef.current.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
                }
            }
        }, 30);
    }, [stopAutoRotation]);

    useEffect(() => {
        if (cubeRef.current) {
            const { x, y } = currentRotationRef.current;
            cubeRef.current.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
        }
        startAutoRotation();
        return () => stopAutoRotation();
    }, [startAutoRotation, stopAutoRotation]);

    const handleDragStart = useCallback((clientX: number, clientY: number) => {
        stopAutoRotation();
        isDraggingRef.current = true;
        didDragRef.current = false;
        
        rotationAtDragStart.current = { ...currentRotationRef.current };
        startCoordsRef.current = { x: clientX, y: clientY };

        if (cubeRef.current) {
            cubeRef.current.style.transition = 'none';
            cubeRef.current.style.cursor = 'grabbing';
        }
    }, [stopAutoRotation]);

    const handleDragMove = useCallback((clientX: number, clientY: number) => {
        if (!isDraggingRef.current || !cubeRef.current) return;

        const deltaX = clientX - startCoordsRef.current.x;
        const deltaY = clientY - startCoordsRef.current.y;

        if (!didDragRef.current && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
            didDragRef.current = true;
        }

        const rotationSpeed = 0.5;
        const rotationX = rotationAtDragStart.current.x - (deltaY * rotationSpeed);
        const rotationY = rotationAtDragStart.current.y + (deltaX * rotationSpeed);
        
        currentRotationRef.current = { x: rotationX, y: rotationY };
        cubeRef.current.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    }, []);

    const handleDragEnd = useCallback(() => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;

        if (cubeRef.current) {
            cubeRef.current.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            cubeRef.current.style.cursor = 'grab';
        }
        
        setTimeout(startAutoRotation, 3000);
    }, [startAutoRotation]);


    const handleFaceClick = (href: string) => {
        if (didDragRef.current || href === '#') return;
        router.push(href);
    };

    useEffect(() => {
        const cubeEl = cubeRef.current;
        if (!cubeEl) return;

        const onMouseDown = (e: MouseEvent) => handleDragStart(e.clientX, e.clientY);
        const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY);
        const onMouseUp = () => handleDragEnd();

        const onTouchStart = (e: TouchEvent) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
        const onTouchMove = (e: TouchEvent) => {
            if (isDraggingRef.current) {
                e.preventDefault();
                handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        };
        const onTouchEnd = () => handleDragEnd();

        cubeEl.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        cubeEl.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: false });
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
