
"use client"

import React from "react";
import { BrainCircuit, Calendar, Share2, Mail, Cpu, Link } from "lucide-react";
import { InteractiveCube, type CubeFace } from "./interactive-cube";

const modules: CubeFace[] = [
    {
      id: "productivity-suite",
      href: "/dashboard/productivity-suite",
      icon: BrainCircuit,
      label: "Productivity Suite",
      description: "Access your AI-powered productivity tools.",
      face: "front",
      colorClass: "theme-primary"
    },
    {
      id: "tasks",
      href: "/dashboard/productivity-suite",
      icon: Calendar,
      label: "My Flow",
      description: "your day perfectly orchestrated",
      face: "right",
      colorClass: "theme-accent"
    },
    {
      id: "social-media",
      href: "/dashboard/social-media",
      icon: Share2,
      label: "Socials",
      description: "Connect and manage your social media presence.",
      face: "back",
      colorClass: "theme-secondary"
    },
    {
      id: "email-assistant",
      href: "/dashboard/email-assistant",
      icon: Mail,
      label: "Comms",
      description: "your AI amplified emails",
      face: "left",
      colorClass: "theme-primary"
    },
    {
      id: "pravis-core",
      href: "/dashboard",
      icon: Cpu,
      label: "Pravis Core",
      description: "design your digital mind, your legacy",
      face: "top",
      colorClass: "theme-accent"
    },
    {
      id: "settings",
      href: "/dashboard",
      icon: Link,
      label: "Connect",
      description: "Configure your experience",
      face: "bottom",
      colorClass: "theme-secondary"
    },
];

interface ModulesProps {
    size?: 'default' | 'small';
}

export function Modules({ size = 'default' }: ModulesProps) {
    return (
        <section>
            <InteractiveCube faces={modules} size={size} />
        </section>
    );
}
