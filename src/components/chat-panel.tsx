
"use client"

import { useChat } from "@/contexts/chat-context"
import { ClarityChat } from "./clarity-chat"
import { AnimatePresence, motion } from "framer-motion"

export function ChatPanel() {
    const { isPanelOpen } = useChat()
    
    return (
<<<<<<< HEAD
        <AnimatePresence>
            {isPanelOpen && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="fixed bottom-0 left-0 right-0 z-50 h-1/3 w-full bg-transparent md:h-full md:w-96 md:border-l-0 md:border-t-0 md:left-auto md:bottom-0 md:right-0"
                >
                    <ClarityChat />
                </motion.div>
            )}
        </AnimatePresence>
=======
        <>
            {/* Desktop Panel: part of the flex layout, appears at the bottom */}
            <motion.aside
                initial={false}
                animate={{ height: isPanelOpen ? '33.333333%' : '0%' }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden md:block bg-background overflow-hidden w-full"
            >
                <div className="h-full p-2 border-t">
                     <ClarityChat />
                </div>
            </motion.aside>

            {/* Mobile Panel: a fixed overlay that slides up */}
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
>>>>>>> 3dabb8b897697fd81238fef3f5fc7b737edf502e
    )
}
