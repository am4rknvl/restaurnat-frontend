'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress: number // 0-100
  color?: 'green' | 'yellow' | 'blue'
  showLabel?: boolean
}

export function ProgressBar({ progress, color = 'green', showLabel = true }: ProgressBarProps) {
  const colors = {
    green: 'bg-duo-green',
    yellow: 'bg-duo-yellow',
    blue: 'bg-duo-blue',
  }

  return (
    <div className="w-full">
      <div className="h-4 bg-duo-lightGray rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${colors[color]} rounded-full`}
        />
      </div>
      {showLabel && (
        <p className="text-xs font-bold text-duo-darkGray mt-1 text-right">
          {progress}%
        </p>
      )}
    </div>
  )
}
