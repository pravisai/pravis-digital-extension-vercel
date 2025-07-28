
"use client"

import { useChat } from "@/contexts/chat-context"
import { ClarityChat } from "./clarity-chat"
import { AnimatePresence, motion } from "framer-motion"

export function ChatPanel() {
    const { isPanelOpen } = useChat()
    
    return (
        <AnimatePresence>
            {isPanelOpen && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="fixed bottom-0 left-0 right-0 z-50 h-1/3 w-full border-t border-border bg-background md:h-full md:w-96 md:border-l md:border-t-0 md:left-auto md:bottom-0 md:right-0"
                >
                    <ClarityChat />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
