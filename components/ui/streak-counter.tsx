'use client'

import { motion } from 'framer-motion'

interface StreakCounterProps {
  streak: number
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 bg-duo-error px-4 py-2 rounded-full shadow-duo"
    >
      <span className="text-2xl">🔥</span>
      <span className="font-bold text-white text-lg">{streak} day streak!</span>
    </motion.div>
  )
}
