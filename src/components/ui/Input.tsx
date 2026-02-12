interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all ${className}`}
      {...props}
    />
  )
}