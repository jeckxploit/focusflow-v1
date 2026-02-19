import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, Home, Menu, Settings, X, PlusCircle, Smartphone, ClipboardList, LogOut } from 'lucide-react'
import Logo from '../ui/Logo'
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
              className="fixed left-0 top-0 h-full w-72 xs:w-80 glass-panel z-50 flex flex-col shadow-2xl shadow-emerald-500/5"
            >
              <div className="p-8 xs:p-12 flex justify-between items-center">
                <div className="flex items-center gap-3 xs:gap-4">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 bg-white rounded-xl xs:rounded-[1.25rem] flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Logo className="w-6 h-6 xs:w-7 xs:h-7 text-black relative z-10" />
                  </div>
                  <div>
                    <span className="block font-black tracking-tighter text-xl xs:text-2xl uppercase italic leading-none">FocusFlow</span>
                    <span className="text-[9px] xs:text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Smart Pomodoro</span>
                  </div>
                </div>
                <button onClick={toggleSidebar} className="lg:hidden p-2.5 hover:bg-zinc-900/50 rounded-xl transition-colors">
                  <X size={18} className="text-zinc-600 hover:text-white" />
                </button>
              </div>

              <nav className="flex-1 px-6 xs:px-8 space-y-1 xs:space-y-2 overflow-y-auto pt-2">
                <p className="px-5 text-[9px] xs:text-[10px] font-black text-zinc-700 dark:text-zinc-500 uppercase tracking-[0.5em] mb-6 xs:mb-8">System Modules</p>
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                      className={`relative flex items-center gap-4 xs:gap-5 px-5 xs:px-6 py-4 xs:py-5 rounded-2xl xs:rounded-[1.5rem] transition-all group ${isActive ? 'text-zinc-900 dark:text-black font-black' : 'text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(255,255,255,0.1)] dark:bg-white"
                          style={{ borderRadius: '1.25rem' }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Icon size={18} className={`relative z-10 ${isActive ? 'text-zinc-900 dark:text-black' : 'text-zinc-600 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors'}`} />
                      <span className="relative z-10 text-[10px] xs:text-[11px] uppercase tracking-[0.1em]">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="p-8 xs:p-10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-5 xs:px-6 py-4 rounded-xl xs:rounded-2xl text-zinc-600 dark:text-zinc-500 hover:text-red-500 hover:bg-red-500/5 transition-all group"
                >
                  <LogOut size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                  <span className="text-[9px] xs:text-[10px] font-black uppercase tracking-widest">Termination</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}