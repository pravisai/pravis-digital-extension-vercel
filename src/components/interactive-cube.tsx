
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

const AUTO_ROTATE_SPEED = 0.1;

export function InteractiveCube({ faces }: InteractiveCubeProps) {
    const router = useRouter();
    const cubeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    const [rotation, setRotation] = useState({ x: -20, y: 30 });
    
    const isDraggingRef = useRef(false);
    const lastPositionRef = useRef({ x: 0, y: 0 });
    const velocityRef = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>();

    const handleFaceClick = useCallback((face: CubeFace) => {
        if (face.href && face.href !== '#') {
            setIsLoading(true);
            router.push(face.href);
        }
    }, [router]);

    useEffect(() => {
        const animate = () => {
            if (!isInteracting) {
                // Apply velocity for inertia
                setRotation(r => ({
                    x: r.x + velocityRef.current.y,
                    y: r.y + velocityRef.current.x,
                }));
                // Apply auto-rotation
                setRotation(r => ({
                    x: r.x + AUTO_ROTATE_SPEED,
                    y: r.y + AUTO_ROTATE_SPEED,
                }));

                // Dampen velocity
                velocityRef.current.x *= 0.95;
                velocityRef.current.y *= 0.95;

                // Add vertical bobbing
                if (cubeRef.current) {
                    const time = Date.now() * 0.0005;
                    const bobbleY = Math.sin(time) * 10;
                    cubeRef.current.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateY(${bobbleY}px)`;
                }
            } else {
                 if (cubeRef.current) {
                    cubeRef.current.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
                }
            }
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animationFrameRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isInteracting, rotation]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let clickTimeout: NodeJS.Timeout;

        const handlePointerDown = (e: PointerEvent) => {
            e.preventDefault();
            setIsInteracting(true);
            isDraggingRef.current = false;
            lastPositionRef.current = { x: e.clientX, y: e.clientY };
            velocityRef.current = { x: 0, y: 0 };
            container.style.cursor = 'grabbing';

            // Differentiate click from drag
            clickTimeout = setTimeout(() => {
                isDraggingRef.current = true;
            }, 150);
        };

        const handlePointerMove = (e: PointerEvent) => {
            if (isInteracting) {
                e.preventDefault();
                const dx = e.clientX - lastPositionRef.current.x;
                const dy = e.clientY - lastPositionRef.current.y;
                
                if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
                  isDraggingRef.current = true;
                  clearTimeout(clickTimeout);
                }

                setRotation(r => ({
                    x: r.x - dy * 0.25,
                    y: r.y + dx * 0.25
                }));
                
                velocityRef.current = { x: dx * 0.2, y: -dy * 0.2 };
                lastPositionRef.current = { x: e.clientX, y: e.clientY };
            }
        };

        const handlePointerUp = (e: PointerEvent) => {
            e.preventDefault();
            setIsInteracting(false);
            container.style.cursor = 'grab';

            clearTimeout(clickTimeout);
            if (!isDraggingRef.current) {
                const targetFace = (e.target as HTMLElement).closest<HTMLElement>('.cube-face');
                if (targetFace) {
                    const faceId = targetFace.dataset.faceId;
                    const face = faces.find(f => f.id === faceId);
                    if (face) {
                        handleFaceClick(face);
                    }
                }
            }
            isDraggingRef.current = false;
        };
        
        const handlePointerLeave = () => {
            if(isInteracting) {
                setIsInteracting(false);
                container.style.cursor = 'grab';
                isDraggingRef.current = false;
                clearTimeout(clickTimeout);
            }
        };

        container.addEventListener('pointerdown', handlePointerDown);
        container.addEventListener('pointermove', handlePointerMove);
        container.addEventListener('pointerup', handlePointerUp);
        container.addEventListener('pointerleave', handlePointerLeave);

        return () => {
            container.removeEventListener('pointerdown', handlePointerDown);
            container.removeEventListener('pointermove', handlePointerMove);
            container.removeEventListener('pointerup', handlePointerUp);
            container.removeEventListener('pointerleave', handlePointerLeave);
            clearTimeout(clickTimeout);
        };
    }, [faces, handleFaceClick, isInteracting]);


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
                        style={{transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`}}
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
