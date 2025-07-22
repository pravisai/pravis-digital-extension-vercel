
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
  onClick?: (id: string) => void;
}

interface InteractiveCubeProps {
  faces: CubeFace[];
}

const AUTO_ROTATE_SPEED = 0.1;
const DRAG_SENSITIVITY = 0.625;

export function InteractiveCube({ faces }: InteractiveCubeProps) {
    const cubeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    
    const [isLoading, setIsLoading] = useState(false);
    const [rotation, setRotation] = useState({ x: -20, y: 30 });
    const isInteractingRef = useRef(false);
    const isDraggingRef = useRef(false);
    const lastPositionRef = useRef({ x: 0, y: 0 });
    const velocityRef = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>();

    const autoRotateRef = useRef(true);

    const handleFaceClick = useCallback((face: CubeFace) => {
        if (face.onClick) {
            face.onClick(face.id);
            return;
        }
        if (face.href && face.href !== '#') {
            setIsLoading(true);
            router.push(face.href);
        }
    }, [router, faces]);
    
    const startInteraction = useCallback((clientX: number, clientY: number) => {
        isInteractingRef.current = true;
        isDraggingRef.current = false;
        lastPositionRef.current = { x: clientX, y: clientY };
        velocityRef.current = { x: 0, y: 0 };
        autoRotateRef.current = false;
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }, []);

    const moveInteraction = useCallback((clientX: number, clientY: number) => {
        if (!isInteractingRef.current) return;

        const dx = clientX - lastPositionRef.current.x;
        const dy = clientY - lastPositionRef.current.y;

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
           isDraggingRef.current = true;
        }

        if (isDraggingRef.current) {
            setRotation(r => ({
                x: r.x - dy * DRAG_SENSITIVITY,
                y: r.y + dx * DRAG_SENSITIVITY
            }));
            
            velocityRef.current = { x: dx, y: -dy };
            lastPositionRef.current = { x: clientX, y: clientY };
        }
    }, []);
    
    const endInteraction = useCallback((target: EventTarget | null) => {
        isInteractingRef.current = false;

        if (!isDraggingRef.current) {
            const targetFaceEl = (target as HTMLElement)?.closest('.cube-face');
            if (targetFaceEl) {
                const faceId = targetFaceEl.getAttribute('data-face-id');
                const face = faces.find(f => f.id === faceId);
                if (face) {
                    handleFaceClick(face);
                }
            }
        }
        
        autoRotateRef.current = true;
        startAnimation();
    }, [faces, handleFaceClick, startAnimation]);

    const startAnimation = useCallback(() => {
        const animate = () => {
            if (autoRotateRef.current) {
                setRotation(r => ({
                    x: r.x + velocityRef.current.y * 0.05 + AUTO_ROTATE_SPEED * 0.5,
                    y: r.y + velocityRef.current.x * 0.05 + AUTO_ROTATE_SPEED,
                }));
                velocityRef.current.x *= 0.95;
                velocityRef.current.y *= 0.95;
            }
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animationFrameRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        startAnimation();
        
        const currentContainer = containerRef.current;
        const handlePointerMove = (e: PointerEvent) => moveInteraction(e.clientX, e.clientY);
        const handlePointerUp = (e: PointerEvent) => endInteraction(e.target);

        currentContainer?.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            currentContainer?.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
        };
    }, [startAnimation, moveInteraction, endInteraction]);

     useEffect(() => {
        const cube = cubeRef.current;
        if (cube) {
            cube.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
        }
    }, [rotation]);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        startInteraction(e.clientX, e.clientY);
    };

    return (
        <section className="relative">
            <div 
                className="cube-wrapper"
                ref={containerRef}
                style={{ cursor: isInteractingRef.current ? 'grabbing' : 'grab', touchAction: 'none' }}
                onPointerDown={handlePointerDown}
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
                        style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
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
