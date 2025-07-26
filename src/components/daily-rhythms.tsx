
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
      colorClass: "neon-purple"
    },
    {
      id: "tasks",
      href: "/dashboard/productivity-suite",
      icon: Calendar,
      label: "My Flow",
      description: "your day perfectly orchestrated",
      face: "right",
      colorClass: "electric-blue"
    },
    {
      id: "social-media",
      href: "/dashboard/social-media",
      icon: Share2,
      label: "Socials",
      description: "Connect and manage your social media presence.",
      face: "back",
      colorClass: "bright-pink"
    },
    {
      id: "email-assistant",
      href: "/dashboard/email-assistant",
      icon: Mail,
      label: "Comms",
      description: "your AI amplified emails",
      face: "left",
      colorClass: "acid-green"
    },
    {
      id: "pravis-core",
      href: "/dashboard",
      icon: Cpu,
      label: "Pravis Core",
      description: "design your digital mind, your legacy",
      face: "top",
      colorClass: "neon-purple"
    },
    {
      id: "settings",
      href: "/dashboard",
      icon: Link,
      label: "Connect",
      description: "Configure your experience",
      face: "bottom",
      colorClass: "electric-blue"
    },
];

export function Modules() {
    return (
        <section>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">Modules</h2>
            <InteractiveCube faces={modules} />
        </section>
    );
}
