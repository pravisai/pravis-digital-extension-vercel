
"use client"

import React, { useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export interface PyramidFace {
  id: string;
  icon: React.ElementType;
  title: string;
  href?: string;
  onClick?: (id: string) => void;
  position: 'front' | 'right' | 'back' | 'left' | 'base';
}

interface InteractivePyramidProps {
  faces: PyramidFace[];
}

export function InteractivePyramid({ faces }: InteractivePyramidProps) {
    const router = useRouter();
    const pyramidRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const startCoordsRef = useRef({ x: 0, y: 0 });
    const currentRotationRef = useRef({ x: -15, y: 30 });
    const rotationAtDragStart = useRef({ x: 0, y: 0 });
    const didDragRef = useRef(false);
    const autoRotateIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const stopAutoRotation = useCallback(() => {
        if (autoRotateIntervalRef.current) {
            clearInterval(autoRotateIntervalRef.current);
            autoRotateIntervalRef.current = null;
        }
    }, []);

    const startAutoRotation = useCallback(() => {
        stopAutoRotation();
        autoRotateIntervalRef.current = setInterval(() => {
            if (!isDraggingRef.current) {
                currentRotationRef.current.y += 0.25;
                if (pyramidRef.current) {
                    pyramidRef.current.style.transition = 'none';
                    pyramidRef.current.style.transform = `rotateX(${currentRotationRef.current.x}deg) rotateY(${currentRotationRef.current.y}deg)`;
                }
            }
        }, 30);
    }, [stopAutoRotation]);

    useEffect(() => {
        if (pyramidRef.current) {
            const { x, y } = currentRotationRef.current;
            pyramidRef.current.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
        }
        startAutoRotation();
        return () => stopAutoRotation();
    }, [startAutoRotation, stopAutoRotation]);

    const handleDragStart = useCallback((clientX: number, clientY: number) => {
        stopAutoRotation();
        isDraggingRef.current = true;
        didDragRef.current = false;
        
        rotationAtDragStart.current = { ...currentRotationRef.current };
        startCoordsRef.current = { x: clientX, y: clientY };

        if (pyramidRef.current) {
            pyramidRef.current.style.transition = 'none';
            pyramidRef.current.style.cursor = 'grabbing';
        }
    }, [stopAutoRotation]);

    const handleDragMove = useCallback((clientX: number, clientY: number) => {
        if (!isDraggingRef.current || !pyramidRef.current) return;

        const deltaX = clientX - startCoordsRef.current.x;
        const deltaY = clientY - startCoordsRef.current.y;

        if (!didDragRef.current && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
            didDragRef.current = true;
        }

        const rotationSpeed = 0.5;
        const rotationX = rotationAtDragStart.current.x - (deltaY * rotationSpeed);
        const rotationY = rotationAtDragStart.current.y + (deltaX * rotationSpeed);
        
        currentRotationRef.current = { x: rotationX, y: rotationY };
        pyramidRef.current.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    }, []);

    const handleDragEnd = useCallback(() => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;

        if (pyramidRef.current) {
            pyramidRef.current.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            pyramidRef.current.style.cursor = 'grab';
        }
        
        setTimeout(startAutoRotation, 3000);
    }, [startAutoRotation]);


    const handleFaceClick = (face: PyramidFace) => {
        if (didDragRef.current || face.position === 'base') return;
        if (face.href && face.href !== '#') {
            router.push(face.href);
        } else if (face.onClick) {
            face.onClick(face.id);
        }
    };
    
    useEffect(() => {
        const pyramidEl = pyramidRef.current;
        if (!pyramidEl) return;

        const onMouseDown = (e: MouseEvent) => handleDragStart(e.clientX, e.clientY);
        const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY);
        const onMouseUp = () => handleDragEnd();
        
        const onTouchStart = (e: TouchEvent) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
        const onTouchMove = (e: TouchEvent) => {
            if (isDraggingRef.current) {
                e.preventDefault();
                handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        };
        const onTouchEnd = () => handleDragEnd();

        pyramidEl.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        
        pyramidEl.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd);
        
        pyramidEl.addEventListener('contextmenu', (e) => e.preventDefault());

        return () => {
            pyramidEl.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            
            pyramidEl.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [handleDragStart, handleDragMove, handleDragEnd]);

    return (
        <div className="cube-wrapper" ref={wrapperRef}>
            <div className="pyramid-scene">
                <div ref={pyramidRef} className="pyramid">
                    {faces.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                "pyramid-face", 
                                {
                                  'pyramid-side': item.position !== 'base',
                                  'pyramid-front': item.position === 'front',
                                  'pyramid-right': item.position === 'right',
                                  'pyramid-back': item.position === 'back',
                                }
                            )}
                            onClick={() => handleFaceClick(item)}
                        >
                            <div className="pyramid-content">
                                <item.icon className="pyramid-icon" />
                                <h3 className="pyramid-title">{item.title}</h3>
                            </div>
                        </div>
                    ))}
                    <div className="pyramid-ground"></div>
                </div>
            </div>
        </div>
    );
}
