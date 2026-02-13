import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import React from 'react'

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
    
    const variants = {
      primary: "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
      secondary: "bg-zinc-900 text-white border border-zinc-800 hover:border-zinc-600",
      outline: "bg-transparent text-white border-2 border-zinc-800 hover:border-white",
      ghost: "bg-transparent text-zinc-500 hover:text-white hover:bg-zinc-900"
    }

    const sizes = {
      sm: "px-4 py-2 text-[10px] rounded-xl",
      md: "px-6 py-3 text-xs rounded-2xl",
      lg: "px-8 py-4 text-sm rounded-[1.5rem]"
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'