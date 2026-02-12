import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Shield, Smartphone, Zap, User, Upload, Trash2, FileText, Loader2 } from 'lucide-react'
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
  const [profileImage, setProfileImage] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)

  useEffect(() => {
    if (user) {
      getProfile()
      fetchPosts()
    }
  }, [user])

  const getProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      if (data?.avatar_url) setProfileImage(data.avatar_url)
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const fetchPosts = async () => {
    setIsLoadingPosts(true)
    try {
      const data = await getPosts()
      setPosts(data || [])
    } catch (error: any) {
      toast.error('Gagal memuat data produksi')
    } finally {
      setIsLoadingPosts(false)
    }
  }

  const handleDeletePost = async (id: string) => {
    const loadingToast = toast.loading('Menghapus data...')
    try {
      await deletePost(id)
      setPosts(posts.filter(post => post.id !== id))
      toast.success('Data berhasil dihapus', { id: loadingToast })
    } catch (error: any) {
      toast.error('Gagal menghapus data', { id: loadingToast })
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Berhasil keluar!')
    navigate('/login')
  }

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName)

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({ id: user.id, avatar_url: publicUrl, updated_at: new Date() })

      if (upsertError) throw upsertError

      setProfileImage(publicUrl)
      toast.success('Foto profil diperbarui!')
    } catch (error: any) {
      toast.error(error.message || 'Gagal upload foto profil')
    } finally {
      setIsUploading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-zinc-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 ml-12 md:ml-0">
            <img src="/pwa-192.png" className="w-8 h-8 object-contain" alt="Logo" />
            <span className="font-black tracking-tighter text-xl uppercase italic">Jeck</span>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="text-xs px-4 py-2 uppercase tracking-widest">
            <LogOut size={14} className="mr-2" /> Logout
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 lg:p-12">
        <motion.header 
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4">
            System Operational
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-none">
            HALO, <span className="text-zinc-500">{user?.email?.split('@')[0]}!</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-zinc-500 max-w-xl text-lg leading-relaxed">
            Template kamu sudah terhubung ke mesin produksi. Gunakan panel di bawah untuk mulai membangun 30 aplikasi PWA.
          </motion.p>
        </motion.header>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: 'PWA ENGINE', desc: 'Installable on mobile', icon: Smartphone },
            { label: 'SUPABASE DB', desc: 'Secure & Real-time', icon: Shield },
            { label: 'FAST VITE', desc: 'Lightning production', icon: Zap },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="group p-8 rounded-[2rem] bg-zinc-900 border border-zinc-800 hover:border-zinc-400 transition-all duration-500 cursor-default"
            >
              <item.icon className="text-white mb-6 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-sm font-bold tracking-widest uppercase mb-1">{item.label}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Production Feed Section (List + Delete) */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-white" />
                <h2 className="text-2xl font-bold">Production Feed</h2>
              </div>
              <Button variant="secondary" onClick={fetchPosts} className="text-[10px] uppercase tracking-widest">
                Refresh Feed
              </Button>
            </div>

            {isLoadingPosts ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="text-sm uppercase tracking-widest">Syncing with database...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-[2rem]">
                <p className="text-zinc-500 uppercase tracking-widest text-xs">Belum ada data produksi</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {posts.map((post) => (
                    <motion.div 
                      key={post.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-black border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-zinc-600 transition-all"
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{post.title}</h3>
                        <p className="text-zinc-500 text-sm line-clamp-1">{post.content}</p>
                        <span className="text-[10px] text-zinc-600 uppercase tracking-tighter mt-2 block">
                          Created: {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <Button 
                        variant="secondary" 
                        onClick={() => handleDeletePost(post.id)}
                        className="ml-4 p-3 rounded-xl text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.section>

        <motion.div 
          className="p-1 w-full bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-800 rounded-[2.5rem] mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
           <div className="bg-black rounded-[2.4rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Siap untuk Hari Ke-2?</h2>
                <p className="text-zinc-500">Besok kita akan meng-clone mesin ini menjadi aplikasi Idul Fitri Gallery.</p>
              </div>
              <Button onClick={() => navigate('/projects')} className="w-full md:w-auto px-10 rounded-full py-4 text-sm uppercase tracking-widest">
                Mulai Produksi
              </Button>
           </div>
        </motion.div>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-8">
              <User size={24} className="text-white" />
              <h2 className="text-2xl font-bold">Profile Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-sm font-medium text-zinc-400 block mb-4">Foto Profil</label>
                <div className="relative group w-32 h-32">
                  <div className="w-full h-full rounded-2xl bg-zinc-800 border-2 border-dashed border-zinc-700 flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={48} className="text-zinc-600" />
                    )}
                  </div>
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <div className="text-center">
                      <Upload size={20} className="text-white mx-auto mb-1" />
                      <p className="text-[10px] text-white uppercase tracking-tighter">
                        {isUploading ? 'Uploading...' : 'Change'}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-2">Email Address</label>
                  <div className="bg-black rounded-xl p-4 border border-zinc-800">
                    <p className="text-white font-medium">{user?.email}</p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-2">User ID</label>
                  <div className="bg-black rounded-xl p-4 border border-zinc-800">
                    <p className="text-zinc-500 text-[10px] font-mono break-all">{user?.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}