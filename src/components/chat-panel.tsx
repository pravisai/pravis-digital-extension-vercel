
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
                    className="fixed bottom-0 left-0 right-0 z-50 h-auto w-full bg-transparent md:w-1/3 md:left-auto md:bottom-4 md:right-4 md:h-[calc(100vh-2rem)] md:max-h-[700px] md:rounded-lg"
                >
                    <ClarityChat />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
