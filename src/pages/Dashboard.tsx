import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Shield, Smartphone, Zap, User, Trash2, FileText, Loader2, Plus, ArrowUpRight, Activity, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../services/supabase'
import { getPosts, deletePost } from '../services/postService'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState<any[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)

  useEffect(() => {
    if (user) fetchPosts()
  }, [user])

  const fetchPosts = async () => {
    setIsLoadingPosts(true)
    try {
      const data = await getPosts(user!.id)
      setPosts(data || [])
    } catch (error: any) {
      toast.error('Gagal memuat data')
    } finally {
      setIsLoadingPosts(false)
    }
  }

  const handleDeletePost = async (id: string) => {
    const loadingToast = toast.loading('Deleting...')
    try {
      await deletePost(id, user!.id)
      setPosts(posts.filter(p => p.id !== id))
      toast.success('Deleted successfully', { id: loadingToast })
    } catch (error) {
      toast.error('Failed to delete', { id: loadingToast })
    }
  }

  return (
    <div className="p-6 lg:p-12 max-w-7xl mx-auto relative">
      {/* Decorative Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            System Operational
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Control <span className="text-zinc-800">Center</span>
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button onClick={() => navigate('/create')} className="h-16 px-10 rounded-[2rem] flex items-center gap-3 group bg-white text-black hover:bg-zinc-200 border-none shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <Plus size={22} strokeWidth={3} /> 
            <span className="font-black tracking-tight">NEW PRODUCTION</span>
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>
        </motion.div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { label: 'Total Apps', value: posts.length, icon: Smartphone, color: 'text-white', glow: 'group-hover:shadow-white/5' },
          { label: 'System Health', value: '99.9%', icon: Shield, color: 'text-zinc-400', glow: 'group-hover:shadow-zinc-400/5' },
          { label: 'Engine Speed', value: '1.2s', icon: Zap, color: 'text-zinc-400', glow: 'group-hover:shadow-zinc-400/5' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className={`group bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/50 p-8 rounded-[2.5rem] transition-all duration-500 hover:border-zinc-700/50 hover:bg-zinc-900/50 ${stat.glow} shadow-2xl`}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                <stat.icon className={stat.color} size={24} />
              </div>
              <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Live</div>
            </div>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Feed List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 uppercase italic">
              <Activity size={20} className="text-zinc-600" /> Production Feed
            </h2>
            <button 
              onClick={fetchPosts} 
              className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-[0.2em] transition-colors flex items-center gap-2"
            >
              <div className={isLoadingPosts ? 'animate-spin' : ''}>
                <Sparkles size={12} />
              </div>
              Sync Engine
            </button>
          </div>

          {isLoadingPosts ? (
            <div className="h-80 flex flex-col items-center justify-center bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-[3rem]">
              <Loader2 className="animate-spin text-zinc-800 mb-4" size={40} />
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-bold">Accessing Mainframe...</p>
            </div>
          ) : posts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-96 flex flex-col items-center justify-center bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-[3rem] text-center p-12 group"
            >
              <div className="w-20 h-20 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <FileText size={32} className="text-zinc-800" />
              </div>
              <h3 className="text-zinc-400 font-black uppercase tracking-widest mb-3">The Line is Empty</h3>
              <p className="text-zinc-600 text-sm max-w-xs leading-relaxed mb-8">
                Mesin produksi Anda sudah siap. Mulai bangun aplikasi pertama Anda untuk mengisi feed ini.
              </p>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/create')}
                className="rounded-full px-8 py-3 text-[10px] font-bold uppercase tracking-widest border-zinc-800 hover:bg-white hover:text-black transition-all"
              >
                Initialize First App
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ x: 10 }}
                    className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-7 rounded-[2rem] flex items-center justify-between group hover:border-zinc-600/50 hover:bg-zinc-900/60 transition-all duration-300"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-white group-hover:border-zinc-500 transition-all duration-500">
                        <Smartphone size={24} />
                      </div>
                      <div>
                        <h3 className="font-black text-xl tracking-tight mb-1 uppercase italic">{post.title}</h3>
                        <p className="text-zinc-500 text-sm line-clamp-1 max-w-md font-medium">{post.content}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="p-4 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-zinc-800/50 to-zinc-950 p-10 rounded-[3rem] border border-zinc-800/50 relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />
            <Sparkles className="text-white mb-6" size={28} />
            <h3 className="text-2xl font-black tracking-tight mb-4 uppercase italic">Pro Engine</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-medium">
              Gunakan fitur PWA untuk menginstal aplikasi ini langsung di layar utama ponsel Anda untuk akses instan.
            </p>
            <Button variant="secondary" className="w-full rounded-2xl py-4 text-[10px] font-bold uppercase tracking-[0.2em] border-zinc-800 hover:bg-white hover:text-black transition-all">
              Documentation
            </Button>
          </motion.div>

          <div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/50 p-10 rounded-[3rem] shadow-2xl">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 flex items-center gap-3 text-zinc-500">
              <User size={14} /> Identity
            </h3>
            <div className="flex items-center gap-5 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-black font-black text-xl italic">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-black text-lg truncate uppercase italic tracking-tight">{user?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-zinc-600 truncate font-bold tracking-widest">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={async () => {
                await supabase.auth.signOut()
                navigate('/login')
              }}
              className="w-full flex items-center justify-center gap-3 py-4 text-[10px] font-bold text-zinc-500 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all border border-zinc-800/50 hover:border-red-500/20 uppercase tracking-[0.2em]"
            >
              <LogOut size={14} /> Terminate Session
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}