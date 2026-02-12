import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Shield, Smartphone, Zap, User, Trash2, FileText, Loader2, Plus, ArrowUpRight, Activity, Sparkles, Box } from 'lucide-react'
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
      toast.error('Sync Failed')
    } finally {
      setIsLoadingPosts(false)
    }
  }

  const handleDeletePost = async (id: string) => {
    const loadingToast = toast.loading('Terminating...')
    try {
      await deletePost(id, user!.id)
      setPosts(posts.filter(p => p.id !== id))
      toast.success('Terminated', { id: loadingToast })
    } catch (error) {
      toast.error('Action Failed', { id: loadingToast })
    }
  }

  return (
    <div className="p-8 lg:p-16 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.5em] mb-6">
            <Activity size={14} /> System Mainframe v1.0
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            ENGINE <span className="text-zinc-900">OS</span>
          </h1>
        </motion.div>
        
        <Button onClick={() => navigate('/create')} size="lg" className="group">
          <Plus size={20} strokeWidth={3} className="mr-2" /> 
          INITIALIZE NEW APP
          <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {[
          { label: 'Active Nodes', value: posts.length, icon: Box },
          { label: 'Security Level', value: 'Encrypted', icon: Shield },
          { label: 'Engine Load', value: 'Minimal', icon: Zap },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-950 border border-zinc-900 p-10 rounded-[2.5rem] hover:border-zinc-700 transition-all group"
          >
            <stat.icon className="text-zinc-700 group-hover:text-white mb-8 transition-colors" size={28} />
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">{stat.label}</p>
            <p className="text-4xl font-black tracking-tighter uppercase italic">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-black tracking-tight uppercase italic flex items-center gap-4">
              <div className="w-2 h-8 bg-white rounded-full" /> Production Line
            </h2>
            <button onClick={fetchPosts} className="text-[10px] font-bold text-zinc-700 hover:text-white uppercase tracking-[0.3em]">
              Sync Engine
            </button>
          </div>

          {isLoadingPosts ? (
            <div className="h-96 flex flex-col items-center justify-center bg-zinc-950 border border-zinc-900 border-dashed rounded-[3rem]">
              <Loader2 className="animate-spin text-zinc-800 mb-6" size={48} />
              <p className="text-[10px] text-zinc-700 uppercase tracking-[0.5em] font-bold">Accessing Core...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center bg-zinc-950 border border-zinc-900 border-dashed rounded-[3rem] text-center p-16">
              <div className="w-24 h-24 rounded-3xl bg-zinc-900 flex items-center justify-center mb-8">
                <FileText size={40} className="text-zinc-800" />
              </div>
              <h3 className="text-zinc-500 font-black uppercase tracking-widest mb-4">No Active Nodes</h3>
              <p className="text-zinc-700 text-sm max-w-xs leading-relaxed mb-10">
                Sistem siap untuk inisialisasi. Mulai produksi aplikasi pertama Anda.
              </p>
              <Button variant="outline" onClick={() => navigate('/create')}>
                Start Production
              </Button>
            </div>
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
                    className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] flex items-center justify-between group hover:border-zinc-600 transition-all"
                  >
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700 group-hover:text-white group-hover:border-zinc-500 transition-all">
                        <Smartphone size={28} />
                      </div>
                      <div>
                        <h3 className="font-black text-2xl tracking-tight mb-1 uppercase italic">{post.title}</h3>
                        <p className="text-zinc-600 text-sm font-medium uppercase tracking-widest">{post.content}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="p-5 text-zinc-800 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={24} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="space-y-10">
          <div className="bg-white text-black p-12 rounded-[3rem] shadow-[0_0_50px_rgba(255,255,255,0.1)] group">
            <Sparkles className="mb-8" size={32} />
            <h3 className="text-3xl font-black tracking-tight mb-6 leading-none">PRO<br/>FACTORY</h3>
            <p className="text-black/60 text-sm leading-relaxed mb-10 font-bold uppercase tracking-tighter">
              Sistem ini dirancang untuk skalabilitas tinggi. Bangun 30 aplikasi PWA dengan satu fondasi yang kuat.
            </p>
            <Button variant="secondary" className="w-full bg-black text-white hover:bg-zinc-800 border-none">
              DOCS
            </Button>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-12 rounded-[3rem]">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] mb-10 text-zinc-700 flex items-center gap-3">
              <User size={14} /> Operator
            </h3>
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white font-black text-2xl italic">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-black text-xl truncate uppercase italic tracking-tight">{user?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-zinc-700 truncate font-bold tracking-[0.2em]">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={async () => {
                await supabase.auth.signOut()
                navigate('/login')
              }}
              className="w-full flex items-center justify-center gap-4 py-5 text-[10px] font-bold text-zinc-700 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all border border-zinc-900 hover:border-red-500/20 uppercase tracking-[0.3em]"
            >
              <LogOut size={16} /> Terminate Session
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}