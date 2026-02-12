import { motion } from 'framer-motion'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md',
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-black uppercase italic tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
  
  const variants = {
    primary: "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
    secondary: "bg-zinc-900 text-white border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700",
    outline: "bg-transparent text-white border border-zinc-800 hover:border-zinc-500"
  }

  const sizes = {
    sm: "px-4 py-2 text-[10px] rounded-xl",
    md: "px-8 py-4 text-xs rounded-2xl",
    lg: "px-10 py-5 text-sm rounded-[2rem]"
  }

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}