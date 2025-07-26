
"use client";

import { cn } from "@/lib/utils";

interface PravisLogoProps {
    className?: string;
    size?: number;
}

export function PravisLogo({ className, size = 60 }: PravisLogoProps) {
    const wrapperStyle = {
        width: `${size}px`,
        height: `${size}px`,
    };

    return (
        <div className={cn("transforming-logo-scene", className)} style={wrapperStyle}>
            <div className="transforming-logo-pivot">
                <div className="transforming-logo-m">
                    <div className="transforming-logo-part part-1"></div>
                    <div className="transforming-logo-part part-2"></div>
                    <div className="transforming-logo-part part-3"></div>
                    <div className="transforming-logo-part part-4"></div>
                </div>
            </div>
        </div>
    );
}
