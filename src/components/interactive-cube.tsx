
"use client"

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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

    const handleFaceClick = (face: CubeFace) => {
        if (face.href && face.href !== '#') {
            router.push(face.href);
        } else if (face.onClick) {
            face.onClick(face.id);
        }
    };

    return (
        <section>
            <div className="cube-wrapper">
                <div className="cube-container">
                    <div ref={cubeRef} className="cube" style={{ transform: 'rotateX(-20deg) rotateY(30deg)' }}>
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
