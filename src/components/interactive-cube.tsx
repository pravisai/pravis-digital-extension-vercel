
"use client"

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface CubeFace {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  face: "front" | "right" | "back" | "left" | "top" | "bottom";
  colorClass: "neon-purple" | "electric-blue" | "bright-pink" | "acid-green";
  href?: string;
}

interface InteractiveCubeProps {
  faces: CubeFace[];
}

const DRAG_THRESHOLD = 10; // pixels

export function InteractiveCube({ faces }: InteractiveCubeProps) {
    const router = useRouter();
    const cubeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [rotation, setRotation] = useState({ x: -20, y: 30 });
    const autoRotateRef = useRef<number | null>(null);

    // Refs for drag/click detection
    const isDraggingRef = useRef(false);
    const isPointerDownRef = useRef(false);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const currentMousePos = useRef({ x: 0, y: 0 });

    const handleFaceClick = (face: CubeFace) => {
        if (face.href && face.href !== '#') {
            setIsLoading(true);
            router.push(face.href);
        }
    };

    const startAutoRotation = () => {
        if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
        const rotate = () => {
            if (!isPointerDownRef.current) {
                setRotation(prev => ({ x: prev.x, y: prev.y + 0.15 }));
            }
            autoRotateRef.current = requestAnimationFrame(rotate);
        };
        autoRotateRef.current = requestAnimationFrame(rotate);
    };

    const stopAutoRotation = () => {
        if (autoRotateRef.current) {
            cancelAnimationFrame(autoRotateRef.current);
            autoRotateRef.current = null;
        }
    };
    
    useEffect(() => {
        startAutoRotation();
        return () => stopAutoRotation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePointerDown = (clientX: number, clientY: number) => {
        stopAutoRotation();
        isPointerDownRef.current = true;
        isDraggingRef.current = false;
        dragStartPos.current = { x: clientX, y: clientY };
        currentMousePos.current = { x: clientX, y: clientY };
        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
        if (!isPointerDownRef.current) return;

        const deltaX = clientX - dragStartPos.current.x;
        const deltaY = clientY - dragStartPos.current.y;
        
        if (!isDraggingRef.current && (Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD)) {
            isDraggingRef.current = true;
        }
        
        const moveDeltaX = clientX - currentMousePos.current.x;
        const moveDeltaY = clientY - currentMousePos.current.y;

        setRotation(prev => ({
            x: prev.x - moveDeltaY * 0.5,
            y: prev.y + moveDeltaX * 0.5
        }));
        currentMousePos.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = (face: CubeFace | null) => {
        isPointerDownRef.current = false;
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
        
        if (!isDraggingRef.current && face) {
            handleFaceClick(face);
        }
        
        if (!autoRotateRef.current) {
            startAutoRotation();
        }
    };

    return (
        <section>
            <div 
                className="cube-wrapper relative"
                ref={containerRef}
                onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
                onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
                onMouseUp={() => handlePointerUp(null)} // This event won't know which face it's on.
                onMouseLeave={() => {if (isPointerDownRef.current) handlePointerUp(null)}}
                onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchEnd={() => handlePointerUp(null)} // Same as mouseup
                style={{ cursor: 'grab' }}
            >
                {isLoading && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-20 rounded-lg">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  </div>
                )}
                <div className="cube-container">
                    <div 
                        ref={cubeRef} 
                        className="cube" 
                        style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
                    >
                        {faces.map((item) => (
                            <div
                                key={item.id}
                                className={cn("cube-face", item.face)}
                                onMouseUp={(e) => {
                                    e.stopPropagation(); // prevent parent onMouseUp from firing
                                    handlePointerUp(item);
                                }}
                                onTouchEnd={(e) => {
                                    e.stopPropagation();
                                    handlePointerUp(item);
                                }}
                            >
                                <div className={cn("module-icon", item.colorClass)}>
                                    <item.icon className={cn("w-7 h-7")} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{item.label}</h3>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
