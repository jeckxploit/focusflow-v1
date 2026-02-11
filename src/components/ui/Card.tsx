import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 ${className}`}>
      {children}
    </div>
  )
}

export default Card