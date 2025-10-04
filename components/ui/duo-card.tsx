'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface DuoCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function DuoCard({ children, className = '', hover = true }: DuoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, boxShadow: '0 8px 0 0 rgba(0, 0, 0, 0.1)' } : {}}
      className={`
        bg-white rounded-2xl p-6 shadow-duo
        border-2 border-duo-lightGray
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
