import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 ml-1">{label}</label>}
      <input
        className={`w-full bg-black border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 transition-colors ${className}`}
        {...props}
      />
    </div>
  )
}