
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
const AUTO_ROTATE_SPEED = 0.05;

export function InteractiveCube({ faces }: InteractiveCubeProps) {
    const router = useRouter();
    const cubeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    
    const [rotation, setRotation] = useState({ x: -20, y: 30 });
    
    const isPointerDownRef = useRef(false);
    const hasDraggedRef = useRef(false);
    const lastPointerPos = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>();

    const handleFaceClick = useCallback((face: CubeFace) => {
        if (face.href && face.href !== '#') {
            setIsLoading(true);
            router.push(face.href);
        }
    }, [router]);

    // Animation loop
    useEffect(() => {
      const animate = (time: number) => {
        if (!isPaused && !isInteracting && cubeRef.current) {
          setRotation(prev => ({
            x: prev.x + AUTO_ROTATE_SPEED,
            y: prev.y + AUTO_ROTATE_SPEED,
          }));

          // Vertical float effect
          const translateY = Math.sin(time / 1000) * 10; // 10px up/down
          cubeRef.current.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateY(${translateY}px)`;
        }
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animationFrameRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isPaused, isInteracting, rotation.x, rotation.y]);


    // Event listeners for manual dragging
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handlePointerDown = (e: PointerEvent) => {
            if ((e.target as HTMLElement).closest('[data-role="pause-play-button"]')) return;
            e.preventDefault();
            isPointerDownRef.current = true;
            hasDraggedRef.current = false;
            setIsInteracting(true);
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

            if (!hasDraggedRef.current) {
                const targetFace = (e.target as HTMLElement).closest<HTMLElement>('.cube-face');
                if (targetFace) {
                    const faceId = targetFace.dataset.faceId;
                    const face = faces.find(f => f.id === faceId);
                    if (face) {
                        handleFaceClick(face);
                    }
                }
            }
            
            isPointerDownRef.current = false;
            setIsInteracting(false);
            container.style.cursor = 'grab';
        };

        container.addEventListener('pointerdown', handlePointerDown, { passive: false });
        window.addEventListener('pointermove', handlePointerMove, { passive: false });
        window.addEventListener('pointerup', handlePointerUp, { passive: false });
        window.addEventListener('pointerleave', handlePointerUp, { passive: false });

        return () => {
            container.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointerleave', handlePointerUp);
        };
    }, [faces, handleFaceClick]);

    return (
        <section className="relative">
             <div className="absolute top-0 right-0 z-20">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsPaused(!isPaused)} 
                    data-role="pause-play-button"
                    aria-label={isPaused ? "Play animation" : "Pause animation"}
                >
                    {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                </Button>
            </div>
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
                        style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
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
        </section>
    );
}
