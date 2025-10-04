'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface DuoButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'error'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

export function DuoButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
}: DuoButtonProps) {
  const variants = {
    primary: 'bg-duo-green hover:bg-[#4CAF00] text-white',
    secondary: 'bg-duo-yellow hover:bg-[#FFB700] text-duo-darkGray',
    success: 'bg-duo-success hover:bg-[#78D108] text-white',
    error: 'bg-duo-error hover:bg-[#E63939] text-white',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-bold rounded-2xl shadow-duo
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        active:shadow-none active:translate-y-1
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}
