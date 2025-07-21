
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

const AUTO_ROTATE_SPEED = 0.15;

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
                let newRotationX = rotation.x + velocityRef.current.y;
                let newRotationY = rotation.y + velocityRef.current.x;

                // Apply auto-rotation
                newRotationX += AUTO_ROTATE_SPEED;
                newRotationY += AUTO_ROTATE_SPEED;

                setRotation({
                    x: newRotationX,
                    y: newRotationY,
                });

                // Dampen velocity
                velocityRef.current.x *= 0.95;
                velocityRef.current.y *= 0.95;
            }
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animationFrameRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isInteracting, rotation.x, rotation.y]);

     useEffect(() => {
        const cube = cubeRef.current;
        if (cube) {
            const bobbleY = isInteracting ? 0 : Math.sin(Date.now() * 0.0005) * 10;
            cube.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateY(${bobbleY}px)`;
            
            // Counter-rotate children
            const children = cube.childNodes;
            children.forEach(childNode => {
                const child = childNode as HTMLDivElement;
                const content = child.querySelector('.cube-face-content') as HTMLDivElement;
                if (content) {
                    content.style.transform = `rotateY(${-rotation.y}deg) rotateX(${-rotation.x}deg)`;
                }
            });
        }
    }, [rotation, isInteracting]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let clickTimeout: NodeJS.Timeout;

        const handlePointerDown = (e: PointerEvent) => {
            if ((e.target as HTMLElement).closest('.cube-face')) {
                e.preventDefault();
                setIsInteracting(true);
                isDraggingRef.current = false;
                lastPositionRef.current = { x: e.clientX, y: e.clientY };
                velocityRef.current = { x: 0, y: 0 };
                container.style.cursor = 'grabbing';

                clickTimeout = setTimeout(() => {
                    isDraggingRef.current = true;
                }, 150);
            }
        };

        const handlePointerMove = (e: PointerEvent) => {
            if (isInteracting) {
                e.preventDefault();
                const dx = e.clientX - lastPositionRef.current.x;
                const dy = e.clientY - lastPositionRef.current.y;
                
                if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
                  clearTimeout(clickTimeout);
                  isDraggingRef.current = true;
                }

                setRotation(r => ({
                    x: r.x - dy * 0.5,
                    y: r.y + dx * 0.5
                }));
                
                velocityRef.current = { x: dx * 0.25, y: -dy * 0.25 };
                lastPositionRef.current = { x: e.clientX, y: e.clientY };
            }
        };

        const handlePointerUp = (e: PointerEvent) => {
            if (isInteracting) {
                e.preventDefault();
                setIsInteracting(false);
                container.style.cursor = 'grab';

                clearTimeout(clickTimeout);
                if (!isDraggingRef.current) {
                    const targetFaceEl = (e.target as HTMLElement).closest('.cube-face');
                    if (targetFaceEl) {
                        const faceId = targetFaceEl.getAttribute('data-face-id');
                        const face = faces.find(f => f.id === faceId);
                        if (face) {
                            handleFaceClick(face);
                        }
                    }
                }
                isDraggingRef.current = false;
            }
        };
        
        const handlePointerLeave = (e: PointerEvent) => {
            if(isInteracting) {
                handlePointerUp(e);
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
                    >
                        {faces.map((item) => (
                            <div
                                key={item.id}
                                data-face-id={item.id}
                                className={cn("cube-face", item.face)}
                            >
                                <div className="cube-face-content">
                                    <div className={cn("module-icon", item.colorClass)}>
                                        <item.icon className={cn("w-7 h-7")} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{item.label}</h3>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
