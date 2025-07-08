
"use client"

import { motion } from "framer-motion"

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  stagger?: boolean;
}

export function FadeIn({ children, delay = 0, className, stagger = false }: FadeInProps) {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  if (stagger) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        transition={{ staggerChildren: 0.2, delayChildren: delay }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  )
}

export const StaggeredListItem = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const variants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    }
    return <motion.div className={className} variants={variants}>{children}</motion.div>
}
