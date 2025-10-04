'use client'

import { InputHTMLAttributes } from 'react'

interface DuoInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function DuoInput({ label, error, className = '', ...props }: DuoInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-duo-darkGray mb-2">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`
          w-full px-4 py-3 rounded-2xl
          border-2 border-duo-lightGray
          focus:border-duo-blue focus:outline-none
          transition-colors duration-200
          font-medium text-duo-darkGray
          placeholder:text-gray-400
          ${error ? 'border-duo-error' : ''}
          ${className}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-duo-error font-medium">{error}</p>
      )}
    </div>
  )
}
