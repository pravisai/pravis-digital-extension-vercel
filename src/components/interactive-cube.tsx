
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
    const dragStartPos = useRef({ x: 0, y: 0 });
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
            setRotation(prev => ({ x: prev.x, y: prev.y + 0.15 }));
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

    const handleDragStart = (clientX: number, clientY: number) => {
        stopAutoRotation();
        setIsDragging(true);
        dragStartPos.current = { x: clientX, y: clientY };
        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    };

    const handleDragMove = (clientX: number, clientY: number) => {
        if (!isDragging) return;
        const deltaX = clientX - dragStartPos.current.x;
        const deltaY = clientY - dragStartPos.current.y;
        
        setRotation(prev => ({
            x: prev.x - deltaY * 0.5,
            y: prev.y + deltaX * 0.5
        }));
        dragStartPos.current = { x: clientX, y: clientY };
    };

    const handleDragEnd = () => {
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
        
        setTimeout(() => {
            setIsDragging(false);
        }, 50); // Small delay to distinguish drag from click
        
        if (!autoRotateRef.current) {
            startAutoRotation();
        }
    };

    // Mouse Events
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        handleDragStart(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        e.preventDefault();
        handleDragMove(e.clientX, e.clientY);
    };
    
    const handleMouseUp = (e: React.MouseEvent) => {
        e.preventDefault();
        handleDragEnd();
    };

    const handleMouseLeave = (e: React.MouseEvent) => {
        if (isDragging) handleMouseUp(e);
    };

    // Touch Events
    const handleTouchStart = (e: React.TouchEvent) => {
        handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
        handleDragEnd();
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
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
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
