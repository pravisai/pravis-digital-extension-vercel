
"use client"

import React from "react";
import { BrainCircuit, Calendar, Share2, Mail, Cpu, Settings } from "lucide-react";
import { InteractiveCube, type CubeFace } from "./interactive-cube";

const modules: CubeFace[] = [
    {
      id: "creative-partner",
      href: "/dashboard/creative-partner",
      icon: BrainCircuit,
      label: "Decision Assist",
      description: "AI-powered brainstorming and productivity suite.",
      face: "front",
      colorClass: "neon-purple"
    },
    {
      id: "tasks",
      href: "/dashboard/tasks",
      icon: Calendar,
      label: "My Flow",
      description: "Manage your schedule and tasks seamlessly.",
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
      label: "Email Assist",
      description: "Draft replies and manage your inbox with AI.",
      face: "left",
      colorClass: "acid-green"
    },
    {
      id: "pravis-core",
      href: "/dashboard",
      icon: Cpu,
      label: "Pravis Core",
      description: "System Hub",
      face: "top",
      colorClass: "neon-purple"
    },
    {
      id: "settings",
      href: "/dashboard",
      icon: Settings,
      label: "Settings",
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
