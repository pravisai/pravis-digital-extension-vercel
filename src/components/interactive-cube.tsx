
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
const HOVER_SENSITIVITY = 0.25;

export function InteractiveCube({ faces }: InteractiveCubeProps) {
    const router = useRouter();
    const cubeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    
    const [rotation, setRotation] = useState({ x: -20, y: 30 });
    const [targetRotation, setTargetRotation] = useState({ x: -20, y: 30 });

    const animationFrameRef = useRef<number>();
    const lastClickTimeRef = useRef(0);

    const handleFaceClick = useCallback((face: CubeFace) => {
        // Prevent click if a drag-like interaction just happened
        const now = Date.now();
        if (now - lastClickTimeRef.current < 300) return;

        if (face.href && face.href !== '#') {
            setIsLoading(true);
            router.push(face.href);
        }
    }, [router]);

    // Animation loop for smooth rotation
    useEffect(() => {
      const animate = () => {
        if (!isInteracting) {
            // Auto-rotation and floating
            const time = Date.now() * 0.0005;
            const bobbleY = Math.sin(time) * 10;
            if (cubeRef.current) {
                cubeRef.current.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateY(${bobbleY}px)`;
            }

            setRotation(prev => ({
                x: prev.x + AUTO_ROTATE_SPEED,
                y: prev.y + AUTO_ROTATE_SPEED,
            }));
        } else {
             // Smooth transition to target rotation on hover
            setRotation(currentRotation => {
                const newX = currentRotation.x + (targetRotation.x - currentRotation.x) * 0.1;
                const newY = currentRotation.y + (targetRotation.y - currentRotation.y) * 0.1;
                if (cubeRef.current) {
                   cubeRef.current.style.transform = `rotateX(${newX}deg) rotateY(${newY}deg)`;
                }
                return { x: newX, y: newY };
            });
        }
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animationFrameRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isInteracting, rotation, targetRotation]);

    // Event listeners for hover interaction
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handlePointerMove = (e: PointerEvent) => {
            if (!containerRef.current) return;
            setIsInteracting(true);
            
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xFromCenter = x - rect.width / 2;
            const yFromCenter = y - rect.height / 2;
            
            setTargetRotation({
                x: -yFromCenter * HOVER_SENSITIVITY,
                y: xFromCenter * HOVER_SENSITIVITY
            });
        };

        const handlePointerLeave = () => {
            setIsInteracting(false);
            // Reset target rotation to the last auto-rotated position to avoid snapping
            setTargetRotation(rotation);
        };
        
        const handleClickCapture = (e: MouseEvent) => {
            const targetFace = (e.target as HTMLElement).closest<HTMLElement>('.cube-face');
            if (targetFace) {
                const faceId = targetFace.dataset.faceId;
                const face = faces.find(f => f.id === faceId);
                if (face) {
                    handleFaceClick(face);
                }
            }
        };

        container.addEventListener('pointermove', handlePointerMove);
        container.addEventListener('pointerleave', handlePointerLeave);
        container.addEventListener('click', handleClickCapture, true);

        return () => {
            container.removeEventListener('pointermove', handlePointerMove);
            container.removeEventListener('pointerleave', handlePointerLeave);
            container.removeEventListener('click', handleClickCapture, true);
        };
    }, [faces, handleFaceClick, rotation]);

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
