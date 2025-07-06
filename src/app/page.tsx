import { BrainCircuit } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-svh bg-background text-foreground overflow-hidden">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="relative flex flex-col items-center justify-center">
          {/* The visual element */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-12">
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse"></div>

            {/* Concentric rotating rings */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-spin-slow"></div>
            <div className="absolute inset-8 rounded-full border border-accent/30 animate-spin-reverse-slow"></div>
            <div className="absolute inset-16 rounded-full border-2 border-primary/30 animate-spin-slow [animation-delay:-10s]"></div>
            
            {/* Centerpiece */}
            <div className="relative z-10 p-4 bg-background/50 rounded-full backdrop-blur-sm">
              <BrainCircuit className="w-24 h-24 md:w-32 md:h-32 text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]"/>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="text-center">
            <h1 className="font-headline text-7xl md:text-9xl font-bold tracking-widest text-primary-foreground drop-shadow-[0_0_15px_hsl(var(--primary)/0.6)]">
              PRAVIS
            </h1>
            <p className="font-headline text-lg md:text-xl mt-2 text-accent tracking-[0.3em] uppercase drop-shadow-[0_0_10px_hsl(var(--accent)/0.6)]">
              Your Digital Extension
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
