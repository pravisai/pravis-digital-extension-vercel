import { CornerDownRight } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="flex justify-center items-center h-full text-center relative overflow-hidden">
            <div className="w-full px-6">
                <span className="text-xs rounded-full mb-2 inline-block px-2 py-1 border border-chart-3/[.15] bg-chart-3/[.15] text-chart-3">
                    🔥 New version dropped!
                </span>
                <h1 className="text-4xl lg:text-6xl font-bold font-headline">
                    <span className="text-2xl lg:text-4xl text-muted-foreground block font-medium font-body">I'm ready to work,</span>
                    Ask me anything.
                </h1>
            </div>
            <CornerDownRight className="absolute bottom-8 left-0 w-[100px] h-auto text-muted-foreground transform rotate-[30deg]" strokeWidth={1} />
        </div>
    );
}
