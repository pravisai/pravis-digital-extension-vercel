
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

const DRAG_THRESHOLD = 10; // pixels

export function InteractiveCube({ faces }: InteractiveCubeProps) {
    const router = useRouter();
    const cubeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [rotation, setRotation] = useState({ x: -20, y: 30 });
    const autoRotateRef = useRef<number | null>(null);
    const [isAutoRotating, setIsAutoRotating] = useState(true);

    // Refs for drag/click detection
    const isDraggingRef = useRef(false);
    const isPointerDownRef = useRef(false);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const currentMousePos = useRef({ x: 0, y: 0 });
    const releasedFaceRef = useRef<CubeFace | null>(null);


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
                const bobbleX = Math.sin(frameCount * 0.005) * 5; // Slower, wider bobble
                setRotation(prev => ({ x: -15 + bobbleX, y: prev.y + 0.10 }));
            }
            autoRotateRef.current = requestAnimationFrame(rotate);
        };
        autoRotateRef.current = requestAnimationFrame(rotate);
    }, [isAutoRotating]);

    const stopAutoRotation = () => {
        if (autoRotateRef.current) {
            cancelAnimationFrame(autoRotateRef.current);
            autoRotateRef.current = null;
        }
    };
    
    useEffect(() => {
        if (isAutoRotating) {
            startAutoRotation();
        } else {
            stopAutoRotation();
        }
        return () => stopAutoRotation();
    }, [isAutoRotating, startAutoRotation]);

    const handlePointerDown = (clientX: number, clientY: number) => {
        stopAutoRotation();
        isPointerDownRef.current = true;
        isDraggingRef.current = false;
        dragStartPos.current = { x: clientX, y: clientY };
        currentMousePos.current = { x: clientX, y: clientY };
        releasedFaceRef.current = null;
        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
        if (!isPointerDownRef.current) return;

        const deltaX = clientX - currentMousePos.current.x;
        const deltaY = clientY - currentMousePos.current.y;
        
        const dragDistance = Math.sqrt(
            Math.pow(clientX - dragStartPos.current.x, 2) + 
            Math.pow(clientY - dragStartPos.current.y, 2)
        );
        
        if (!isDraggingRef.current && dragDistance > DRAG_THRESHOLD) {
            isDraggingRef.current = true;
        }
        
        if (isDraggingRef.current) {
             setRotation(prev => ({
                x: prev.x - deltaY * 0.5,
                y: prev.y + deltaX * 0.5
            }));
        }
       
        currentMousePos.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
        isPointerDownRef.current = false;
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
        
        if (!isDraggingRef.current && releasedFaceRef.current) {
            handleFaceClick(releasedFaceRef.current);
        }
        
        if (!autoRotateRef.current && isAutoRotating) {
            startAutoRotation();
        }
        releasedFaceRef.current = null;
    };

    const handleFacePointerUp = (face: CubeFace) => {
        if (isPointerDownRef.current) {
            releasedFaceRef.current = face;
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
                        style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
                    >
                        {faces.map((item) => (
                            <div
                                key={item.id}
                                className={cn("cube-face", item.face)}
                                onMouseUp={() => handleFacePointerUp(item)}
                                onTouchEnd={() => handleFacePointerUp(item)}
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
