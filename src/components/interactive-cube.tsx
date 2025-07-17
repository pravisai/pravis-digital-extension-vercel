
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
  onClick?: (id: string) => void;
}

interface InteractiveCubeProps {
  faces: CubeFace[];
}

export function InteractiveCube({ faces }: InteractiveCubeProps) {
    const router = useRouter();
    const cubeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rotation, setRotation] = useState({ x: -20, y: 30 });
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const autoRotateRef = useRef<number | null>(null);

    const handleFaceClick = (face: CubeFace) => {
        if (isDragging) return;
        setIsLoading(true);
        if (face.href && face.href !== '#') {
            router.push(face.href);
        } else if (face.onClick) {
            face.onClick(face.id);
        } else {
          // If no action, don't keep loading state
          setIsLoading(false);
        }
    };

    const startAutoRotation = () => {
        if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
        const rotate = () => {
            setRotation(prev => ({ x: prev.x + 0.1, y: prev.y + 0.15 }));
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

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        stopAutoRotation();
        setIsDragging(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
        if (containerRef.current) {
            containerRef.current.style.cursor = 'grabbing';
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const deltaX = e.clientX - lastMousePos.x;
        const deltaY = e.clientY - lastMousePos.y;
        
        setRotation(prev => ({
            x: prev.x - deltaY * 0.5,
            y: prev.y + deltaX * 0.5
        }));
        setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        e.preventDefault();
        if (containerRef.current) {
            containerRef.current.style.cursor = 'grab';
        }
        setTimeout(() => {
            setIsDragging(false);
        }, 50);
        
        if (!autoRotateRef.current) {
            startAutoRotation();
        }
    };
    
    const handleMouseLeave = (e: React.MouseEvent) => {
        if (isDragging) {
           handleMouseUp(e);
        }
    };

    return (
        <section>
            <div 
                className="cube-wrapper relative" 
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
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
                                onClick={() => handleFaceClick(item)}
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
