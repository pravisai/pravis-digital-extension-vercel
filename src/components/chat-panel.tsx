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
                    className="fixed bottom-0 left-0 right-0 z-50 h-1/4 w-full border-t border-border bg-background shadow-lg md:h-[35%] md:w-96 md:left-auto md:bottom-4 md:right-4 md:rounded-lg md:border"
                >
                    <ClarityChat />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
