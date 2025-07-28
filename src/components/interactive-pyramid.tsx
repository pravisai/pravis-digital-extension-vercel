
"use client"

import React, { useRef } from "react";
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
  size?: 'default' | 'small';
}

export function InteractivePyramid({ faces, size = 'default' }: InteractivePyramidProps) {
    const router = useRouter();
    const pyramidRef = useRef<HTMLDivElement>(null);

    const handleFaceClick = (face: PyramidFace) => {
        if (face.position === 'base') return;
        if (face.href && face.href !== '#') {
            router.push(face.href);
        } else if (face.onClick) {
            face.onClick(face.id);
        }
    };
    
    return (
        <div className={cn("cube-wrapper", {
            "size-default": size === 'default',
            "size-small": size === 'small',
        })}>
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
