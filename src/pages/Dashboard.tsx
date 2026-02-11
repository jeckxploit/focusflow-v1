import { motion } from 'framer-motion'
import { Shield, Smartphone, Zap, User, Upload } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../services/supabase'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profileImage, setProfileImage] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (user) getProfile()
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
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <>
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

      <motion.div 
        className="p-1 w-full bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-800 rounded-[2.5rem]"
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
        className="mt-16"
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
    </>
  )
}