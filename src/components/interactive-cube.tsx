
"use client"

import React, { useRef, useEffect, useState, useCallback } from "react";
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

const DRAG_SENSITIVITY = 0.4;
const AUTO_ROTATE_SPEED = 0.1; // Increased speed

export function InteractiveCube({ faces }: InteractiveCubeProps) {
    const router = useRouter();
    const cubeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [isLoading, setIsLoading] = useState(false);
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
        if (!isInteracting && cubeRef.current) {
          setRotation(prev => ({
            x: prev.x + AUTO_ROTATE_SPEED,
            y: prev.y + AUTO_ROTATE_SPEED,
          }));
        }
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animationFrameRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isInteracting]);

    // Event listeners for manual dragging
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handlePointerDown = (e: PointerEvent) => {
            isPointerDownRef.current = true;
            hasDraggedRef.current = false;
            setIsInteracting(true);
            lastPointerPos.current = { x: e.clientX, y: e.clientY };
            container.style.cursor = 'grabbing';
        };

        const handlePointerMove = (e: PointerEvent) => {
            if (!isPointerDownRef.current) return;
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

        const handlePointerLeave = () => {
            if(isPointerDownRef.current) {
                isPointerDownRef.current = false;
                setIsInteracting(false);
                container.style.cursor = 'grab';
            }
        };

        container.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        container.addEventListener('pointerleave', handlePointerLeave);

        return () => {
            container.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            container.removeEventListener('pointerleave', handlePointerLeave);
        };
    }, [faces, handleFaceClick]);

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
