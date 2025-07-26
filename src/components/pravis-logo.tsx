
"use client";

import { cn } from "@/lib/utils";

interface PravisLogoProps {
    className?: string;
    size?: number;
}

export function PravisLogo({ className, size = 50 }: PravisLogoProps) {
    const faceStyle = {
        width: `${size}px`,
        height: `${size}px`,
    };

    const cubeStyle = {
        width: `${size}px`,
        height: `${size}px`,
    };

    const frontTransform = { transform: `rotateY(0deg) translateZ(${size / 2}px)` };
    const rightTransform = { transform: `rotateY(90deg) translateZ(${size / 2}px)` };
    const backTransform = { transform: `rotateY(180deg) translateZ(${size / 2}px)` };
    const leftTransform = { transform: `rotateY(-90deg) translateZ(${size / 2}px)` };
    const topTransform = { transform: `rotateX(90deg) translateZ(${size / 2}px)` };
    const bottomTransform = { transform: `rotateX(-90deg) translateZ(${size / 2}px)` };

    return (
        <div className={cn("logo-scene", className)} style={{ width: `${size}px`, height: `${size}px` }}>
            <div className="logo-cube" style={cubeStyle}>
                <div className="logo-cube__face logo-cube__face--front" style={{ ...faceStyle, ...frontTransform }}></div>
                <div className="logo-cube__face logo-cube__face--right" style={{ ...faceStyle, ...rightTransform }}></div>
                <div className="logo-cube__face logo-cube__face--back" style={{ ...faceStyle, ...backTransform }}></div>
                <div className="logo-cube__face logo-cube__face--left" style={{ ...faceStyle, ...leftTransform }}></div>
                <div className="logo-cube__face logo-cube__face--top" style={{ ...faceStyle, ...topTransform }}></div>
                <div className="logo-cube__face logo-cube__face--bottom" style={{ ...faceStyle, ...bottomTransform }}></div>
            </div>
        </div>
    );
}
