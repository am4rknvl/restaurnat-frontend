'use client'

import { motion } from 'framer-motion'

interface XPBadgeProps {
  xp: number
  level: number
}

export function XPBadge({ xp, level }: XPBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-2 bg-duo-yellow px-4 py-2 rounded-full shadow-duo"
    >
      <div className="flex items-center gap-1">
        <span className="text-2xl">⚡</span>
        <span className="font-bold text-duo-darkGray">{xp} XP</span>
      </div>
      <div className="w-px h-6 bg-duo-darkGray/20" />
      <div className="flex items-center gap-1">
        <span className="text-2xl">🏆</span>
        <span className="font-bold text-duo-darkGray">Lvl {level}</span>
      </div>
    </motion.div>
  )
}
