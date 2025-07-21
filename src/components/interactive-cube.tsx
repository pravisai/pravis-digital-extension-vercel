
"use client"

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader2, Pause, Play } from "lucide-react";
import { Button } from "./ui/button";

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

const DRAG_SENSITIVITY = 0.5;

export function InteractiveCube({ faces }: InteractiveCubeProps) {
    const router = useRouter();
    const cubeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [rotation, setRotation] = useState({ x: -20, y: 30 });
    const [translateY, setTranslateY] = useState(0);
    const autoRotateRef = useRef<number | null>(null);
    const [isAutoRotating, setIsAutoRotating] = useState(true);

    const isDraggingRef = useRef(false);
    const isPointerDownRef = useRef(false);
    const lastPointerPos = useRef({ x: 0, y: 0 });

    const handleFaceClick = (face: CubeFace) => {
        if (face.href && face.href !== '#') {
            setIsLoading(true);
            router.push(face.href);
        }
    };
    
    const startAutoRotation = useCallback(() => {
        if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
        let frameCount = 0;
        const rotate = () => {
            if (!isPointerDownRef.current && isAutoRotating) {
                frameCount++;
                const bobbleY = Math.sin(frameCount * 0.01) * 10;
                setRotation(prev => ({ x: prev.x, y: prev.y + 0.10 }));
                setTranslateY(bobbleY);
            }
            autoRotateRef.current = requestAnimationFrame(rotate);
        };
        autoRotateRef.current = requestAnimationFrame(rotate);
    }, [isAutoRotating]);

    const stopAutoRotation = useCallback(() => {
        if (autoRotateRef.current) {
            cancelAnimationFrame(autoRotateRef.current);
            autoRotateRef.current = null;
        }
    }, []);
    
    useEffect(() => {
        if (isAutoRotating) {
            startAutoRotation();
        } else {
            stopAutoRotation();
        }
        return () => stopAutoRotation();
    }, [isAutoRotating, startAutoRotation, stopAutoRotation]);

    const handlePointerDown = (clientX: number, clientY: number) => {
        stopAutoRotation();
        isPointerDownRef.current = true;
        isDraggingRef.current = false;
        lastPointerPos.current = { x: clientX, y: clientY };
        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
        if (!isPointerDownRef.current) return;

        isDraggingRef.current = true;
        const deltaX = clientX - lastPointerPos.current.x;
        const deltaY = clientY - lastPointerPos.current.y;
        
        setRotation(prev => ({
            x: prev.x - deltaY * DRAG_SENSITIVITY,
            y: prev.y + deltaX * DRAG_SENSITIVITY
        }));
       
        lastPointerPos.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
        if (!isPointerDownRef.current) return;

        isPointerDownRef.current = false;
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
        
        if (isAutoRotating) {
            startAutoRotation();
        }
        
        // Reset dragging state after a short delay to distinguish from a click
        setTimeout(() => {
            isDraggingRef.current = false;
        }, 50);
    };

    const handleFacePointerUp = (face: CubeFace) => {
        if (!isDraggingRef.current) {
            handleFaceClick(face);
        }
    };

    return (
        <section className="relative">
            <div 
                className="cube-wrapper"
                ref={containerRef}
                onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
                onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchEnd={handlePointerUp}
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
                        style={{ transform: `translateY(${translateY}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
                    >
                        {faces.map((item) => (
                            <div
                                key={item.id}
                                className={cn("cube-face", item.face)}
                                onMouseUp={() => handleFacePointerUp(item)}
                                onTouchEnd={(e) => {
                                    e.preventDefault();
                                    handleFacePointerUp(item);
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
             <div className="absolute bottom-4 right-4 z-30">
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setIsAutoRotating(!isAutoRotating)}
                    aria-label={isAutoRotating ? "Pause animation" : "Play animation"}
                >
                    {isAutoRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
            </div>
        </section>
    );
}
