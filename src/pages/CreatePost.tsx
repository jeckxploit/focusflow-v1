import { useState } from "react"
import { createPost } from "../services/postService"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Type, AlignLeft, Globe, Lock, Cpu, Sparkles } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import toast from "react-hot-toast"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
}

export default function CreatePost() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) {
      toast.error("Judul dan konten harus diisi!")
      return
    }

    setLoading(true)
    const loadingToast = toast.loading("Menyimpan data produksi...")

    try {
      await createPost(title, content, status)
      toast.success("Data berhasil disimpan!", { id: loadingToast })
      navigate("/dashboard")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan'
      toast.error("Gagal menyimpan data: " + message, { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 xs:p-6 sm:p-12 max-w-4xl mx-auto">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 xs:mb-12 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[9px] xs:text-[10px] uppercase tracking-[0.3em] font-black italic">Return to Origin</span>
      </motion.button>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 xs:space-y-8"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 mb-8 xs:mb-12">
          <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-xl xs:rounded-2xl bg-white flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <Cpu size={28} />
          </div>
          <div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl premium-gradient-text tracking-tighter">
              Production Unit
            </h1>
            <p className="text-zinc-500 font-bold tracking-wide uppercase text-[8px] xs:text-[10px] mt-2 flex items-center gap-2">
              <Sparkles size={12} className="text-emerald-500" />
              Manifesting new data structures
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bento-card p-0.5 xs:p-1"
        >
          <form onSubmit={handleSubmit} className="p-4 xs:p-6 sm:p-8 md:p-12 space-y-6 xs:space-y-8">
            {/* Title Input Area */}
            <div className="space-y-3 xs:space-y-4">
              <label className="flex items-center gap-2 text-[8px] xs:text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black italic ml-1">
                <Type size={14} className="text-emerald-500" /> Production Label
              </label>
              <Input
                placeholder="Identify this production..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-black/40 border-zinc-800/50 focus:border-emerald-500/50 h-12 xs:h-14 sm:h-16 text-base xs:text-lg font-bold tracking-tight rounded-xl xs:rounded-2xl"
              />
            </div>

            {/* Content Textarea Area */}
            <div className="space-y-3 xs:space-y-4">
              <label className="flex items-center gap-2 text-[8px] xs:text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black italic ml-1">
                <AlignLeft size={14} className="text-emerald-500" /> Core Logic
              </label>
              <textarea
                placeholder="Describe the technical implementation..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[200px] xs:min-h-[250px] bg-black/40 border border-zinc-800/50 rounded-xl xs:rounded-2xl p-4 xs:p-6 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-all resize-none shadow-inner text-sm xs:text-base"
              />
            </div>

            {/* Status Selection */}
            <div className="space-y-3 xs:space-y-4">
              <label className="flex items-center gap-2 text-[8px] xs:text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black italic ml-1">
                <Globe size={14} className="text-emerald-500" /> Exposure
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`flex items-center justify-between p-4 xs:p-6 rounded-xl xs:rounded-2xl border transition-all group ${status === 'draft' ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-transparent border-zinc-800/50 text-zinc-600 hover:border-zinc-700'}`}
                >
                  <div className="flex items-center gap-2 xs:gap-4">
                    <div className={`p-1.5 xs:p-2 rounded-lg xs:rounded-xl transition-colors ${status === 'draft' ? 'bg-zinc-700' : 'bg-zinc-900'}`}>
                      <Lock size={18} />
                    </div>
                    <div className="text-left min-w-0">
                      <span className="block text-[9px] xs:text-[11px] font-black uppercase tracking-widest truncate">Internal</span>
                      <span className="text-[7px] xs:text-[9px] text-zinc-500 uppercase tracking-tighter truncate hidden sm:block">Encrypted Storage</span>
                    </div>
                  </div>
                  {status === 'draft' && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] flex-shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`flex items-center justify-between p-4 xs:p-6 rounded-xl xs:rounded-2xl border transition-all group ${status === 'published' ? 'bg-emerald-500/10 border-emerald-500/30 text-white' : 'bg-transparent border-zinc-800/50 text-zinc-600 hover:border-zinc-700'}`}
                >
                  <div className="flex items-center gap-2 xs:gap-4">
                    <div className={`p-1.5 xs:p-2 rounded-lg xs:rounded-xl transition-colors ${status === 'published' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-900'}`}>
                      <Globe size={18} />
                    </div>
                    <div className="text-left min-w-0">
                      <span className="block text-[9px] xs:text-[11px] font-black uppercase tracking-widest truncate">Public</span>
                      <span className="text-[7px] xs:text-[9px] text-zinc-500 uppercase tracking-tighter truncate hidden sm:block">Network Access</span>
                    </div>
                  </div>
                  {status === 'published' && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] flex-shrink-0" />}
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 xs:pt-8 border-t border-zinc-800/30">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 xs:h-14 sm:h-16 rounded-xl xs:rounded-2xl text-[9px] xs:text-[11px] uppercase tracking-[0.25em] font-black flex items-center justify-center gap-2 xs:gap-3 bg-white text-black hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              >
                <Save size={20} />
                {loading ? "Syncing..." : "Save Data"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}