import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, Home, Menu, Settings, X, PlusCircle, Smartphone, Cpu, ClipboardList, LogOut } from 'lucide-react'
import { useAppStore } from '../../store/useStore'
import { useAuth } from '../../hooks/useAuth'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useAppStore()
  const { signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    toast.success('Logged out')
    navigate('/login')
  }

  const menuItems = [
    { icon: Home, label: 'Overview', href: '/dashboard' },
    { icon: ClipboardList, label: 'Habit forge', href: '/habit' },
    { icon: PlusCircle, label: 'Production', href: '/create' },
    { icon: Smartphone, label: 'Projects', href: '/projects' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ]

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-50 p-4 bg-zinc-950/50 backdrop-blur-2xl border border-zinc-800/50 rounded-2xl lg:hidden hover:bg-zinc-800/50 transition-all active:scale-95 group"
      >
        <Menu size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
      </button>

      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
            />

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="fixed left-0 top-0 h-full w-80 glass-panel z-50 flex flex-col shadow-2xl shadow-emerald-500/5"
            >
              <div className="p-12 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-[1.25rem] flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Cpu size={24} className="text-black relative z-10" />
                  </div>
                  <div>
                    <span className="block font-black tracking-tighter text-2xl uppercase italic leading-none">FocusFlow</span>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Smart Pomodoro</span>
                  </div>
                </div>
                <button onClick={toggleSidebar} className="lg:hidden p-3 hover:bg-zinc-900/50 rounded-2xl transition-colors">
                  <X size={20} className="text-zinc-600 hover:text-white" />
                </button>
              </div>

              <nav className="flex-1 px-8 space-y-2 overflow-y-auto pt-4">
                <p className="px-5 text-[10px] font-bold text-zinc-700 uppercase tracking-[0.5em] mb-8">System Modules</p>
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                      className={`relative flex items-center gap-5 px-6 py-5 rounded-[1.5rem] transition-all group ${isActive ? 'text-black' : 'text-zinc-500 hover:text-zinc-100'
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-white shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                          style={{ borderRadius: '1.5rem' }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Icon size={20} className={`relative z-10 ${isActive ? 'text-black' : 'text-zinc-500 group-hover:text-zinc-100 transition-colors'}`} />
                      <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.1em]">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="p-10 space-y-6">
                <div className="bg-zinc-900/50 rounded-[2rem] p-6 border border-zinc-800/30">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Network</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(idx => (
                        <div key={idx} className={`w-1 h-3 rounded-full ${idx < 4 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] font-black uppercase italic text-zinc-500">Node: ID-SBY-04</div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-zinc-600 hover:text-red-500 hover:bg-red-500/5 transition-all group"
                >
                  <LogOut size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Termination</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}