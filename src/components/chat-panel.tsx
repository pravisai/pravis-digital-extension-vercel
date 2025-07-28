
"use client"

import { useChat } from "@/contexts/chat-context"
import { ClarityChat } from "./clarity-chat"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function ChatPanel() {
    const { isPanelOpen } = useChat()
    
    // For Desktop: A slide-in panel from the right
    // For Mobile: A slide-up panel from the bottom
    return (
        <>
            {/* Desktop Panel */}
            <motion.div
                initial={false}
                animate={{ width: isPanelOpen ? '33.333333%' : '0%' }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden md:block h-full bg-transparent overflow-hidden"
            >
                <div className="h-full p-4">
                     <ClarityChat />
                </div>
            </motion.div>

            {/* Mobile Panel */}
            <AnimatePresence>
                {isPanelOpen && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed bottom-0 left-0 right-0 z-50 h-[85svh] w-full bg-background md:hidden rounded-t-lg border-t"
                    >
                        <ClarityChat />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
