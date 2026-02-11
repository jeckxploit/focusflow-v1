import { User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="sticky top-0 z-30 backdrop-blur-md bg-black/70 border-b border-zinc-800 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/pwa-192.png" className="w-8 h-8 object-contain" alt="Logo" />
          <span className="font-black tracking-tighter text-xl uppercase italic">Jeck</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
          <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
            <User size={14} className="text-zinc-500" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            {user?.email?.split('@')[0]}
          </span>
        </div>
      </div>
    </nav>
  )
}