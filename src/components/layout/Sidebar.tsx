import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, Home, Menu, Settings, Users, X, PlusCircle, Smartphone, Cpu } from 'lucide-react'
import { useAppStore } from '../../store/useStore'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useAppStore()
  const location = useLocation()

  const menuItems = [
    { icon: Home, label: 'Overview', href: '/dashboard' },
    { icon: PlusCircle, label: 'Production', href: '/create' },
    { icon: Smartphone, label: 'Projects', href: '/projects' },
    { icon: BarChart3, label: 'Analytics', href: '#' },
    { icon: Users, label: 'Team', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' },
  ]

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-50 p-3 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl lg:hidden hover:bg-zinc-800 transition-all"
      >
        <Menu size={20} className="text-white" />
      </button>

      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-72 bg-black border-r border-zinc-900 z-50 flex flex-col"
            >
              <div className="p-10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <Cpu size={20} className="text-black" />
                  </div>
                  <span className="font-black tracking-tighter text-2xl uppercase italic">JECK.</span>
                </div>
                <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-zinc-900 rounded-xl">
                  <X size={20} className="text-zinc-500" />
                </button>
              </div>

              <nav className="flex-1 px-6 space-y-2">
                <p className="px-4 text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em] mb-6">Mainframe</p>
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${
                        isActive 
                          ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                          : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-black' : 'text-zinc-500 group-hover:text-white'} />
                      <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="p-8">
                <div className="bg-zinc-900/30 rounded-[2rem] p-6 border border-zinc-800/50">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Status</p>
                      <p className="text-xs font-black uppercase italic">Operational</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      className="h-full bg-white" 
                    />
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}