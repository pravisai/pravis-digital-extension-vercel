
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

const DRAG_SENSITIVITY = 0.4;

export function InteractiveCube({ faces }: InteractiveCubeProps) {
    const router = useRouter();
    const cubeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [rotation, setRotation] = useState({ x: -20, y: 30 });
    const [translateY, setTranslateY] = useState(0);
    const [isAutoRotating, setIsAutoRotating] = useState(true);

    const isPointerDownRef = useRef(false);
    const hasDraggedRef = useRef(false);
    const lastPointerPos = useRef({ x: 0, y: 0 });
    const autoRotateRef = useRef<number | null>(null);

    const handleFaceClick = useCallback((face: CubeFace) => {
        if (face.href && face.href !== '#') {
            setIsLoading(true);
            router.push(face.href);
        }
    }, [router]);

    const startAutoRotation = useCallback(() => {
        if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
        let frameCount = 0;
        const rotate = () => {
            if (!isPointerDownRef.current) {
                frameCount++;
                const bobbleY = Math.sin(frameCount * 0.01) * 10;
                setRotation(prev => ({ x: prev.x, y: prev.y + 0.10 }));
                setTranslateY(bobbleY);
            }
            autoRotateRef.current = requestAnimationFrame(rotate);
        };
        if (isAutoRotating) {
            autoRotateRef.current = requestAnimationFrame(rotate);
        }
    }, [isAutoRotating]);

    const stopAutoRotation = useCallback(() => {
        if (autoRotateRef.current) {
            cancelAnimationFrame(autoRotateRef.current);
            autoRotateRef.current = null;
        }
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        
        const handlePointerDown = (e: PointerEvent) => {
            if ((e.target as HTMLElement).closest('[data-sidebar="trigger"]')) return;
            e.preventDefault();
            stopAutoRotation();
            isPointerDownRef.current = true;
            hasDraggedRef.current = false;
            lastPointerPos.current = { x: e.clientX, y: e.clientY };
            container.style.cursor = 'grabbing';
        };

        const handlePointerMove = (e: PointerEvent) => {
            if (!isPointerDownRef.current) return;
            e.preventDefault();
            hasDraggedRef.current = true;
            
            const deltaX = e.clientX - lastPointerPos.current.x;
            const deltaY = e.clientY - lastPointerPos.current.y;
            
            setRotation(prev => ({
                x: prev.x - deltaY * DRAG_SENSITIVITY,
                y: prev.y + deltaX * DRAG_SENSITIVITY
            }));
            
            lastPointerPos.current = { x: e.clientX, y: e.clientY };
        };

        const handlePointerUp = (e: PointerEvent) => {
            if (!isPointerDownRef.current) return;
            e.preventDefault();

            const targetFace = (e.target as HTMLElement).closest<HTMLElement>('.cube-face');
            if (targetFace && !hasDraggedRef.current) {
                const faceId = targetFace.dataset.faceId;
                const face = faces.find(f => f.id === faceId);
                if (face) {
                    handleFaceClick(face);
                }
            }
            
            isPointerDownRef.current = false;
            container.style.cursor = 'grab';
            
            if (isAutoRotating) {
                startAutoRotation();
            }
        };

        container.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointerleave', handlePointerUp);

        return () => {
            container.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointerleave', handlePointerUp);
        };
    }, [faces, handleFaceClick, startAutoRotation, stopAutoRotation, isAutoRotating]);
    
    useEffect(() => {
        if (isAutoRotating) {
            startAutoRotation();
        } else {
            stopAutoRotation();
        }
        return () => stopAutoRotation();
    }, [isAutoRotating, startAutoRotation, stopAutoRotation]);

    return (
        <section className="relative">
            <div 
                className="cube-wrapper"
                ref={containerRef}
                style={{ cursor: 'grab', touchAction: 'none' }}
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
                                data-face-id={item.id}
                                className={cn("cube-face", item.face)}
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
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsAutoRotating(!isAutoRotating);
                    }}
                    aria-label={isAutoRotating ? "Pause animation" : "Play animation"}
                >
                    {isAutoRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
            </div>
        </section>
    );
}
