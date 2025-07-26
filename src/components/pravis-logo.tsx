
"use client";

import { cn } from "@/lib/utils";

interface PravisLogoProps {
    className?: string;
    size?: number;
}

export function PravisLogo({ className, size = 60 }: PravisLogoProps) {
    const wrapperStyle = {
        '--logo-size': `${size}px`,
    } as React.CSSProperties;

    return (
        <div className={cn("logo-scene", className)} style={wrapperStyle}>
            <div className="logo-cube">
                <div className="logo-face logo-front"></div>
                <div className="logo-face logo-back"></div>
                <div className="logo-face logo-right"></div>
                <div className="logo-face logo-left"></div>
                <div className="logo-face logo-top"></div>
                <div className="logo-face logo-bottom"></div>
            </div>
        </div>
    );
}
